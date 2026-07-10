// =====================================================
// 리딩 엔진 — 드로우 → LLM(JSON) → 저장 → 발행 (idempotent)
// =====================================================
// 서비스 무관 오케스트레이션. 사주는 이 엔진을 쓰지 않는다(기존 generateSajuResult 유지).
// 결제 confirm 과 어드민(검수/재생성/발행) 양쪽에서 호출된다.

import { createServiceClient } from "@/lib/supabase/server";
import { getReadingService } from "./registry";
import { generateDrawSeed } from "./status";
import { generateJson } from "./llm-json";
import { readingResultSchema } from "./schema";
import type { DrawRecord, PromptContext, ReadingResult } from "./types";
import type { Json } from "@/types/database";

type OrderLite = {
  id: string;
  product_id: string;
  service_type: string;
  public_token: string | null;
};

async function loadContext(orderInternalId: string) {
  const service = createServiceClient();
  const { data: order } = await service
    .from("orders")
    .select("id, product_id, service_type, public_token")
    .eq("id", orderInternalId)
    .maybeSingle();
  if (!order) throw new Error("주문을 찾을 수 없습니다");

  const svc = getReadingService(order.service_type);
  if (!svc) throw new Error(`지원하지 않는 서비스: ${order.service_type}`);

  const { data: input } = await service
    .from("reading_inputs")
    .select("payload")
    .eq("order_id", order.id)
    .maybeSingle();
  const { data: product } = await service
    .from("products")
    .select("slug, name")
    .eq("id", order.product_id)
    .maybeSingle();
  if (!input || !product) throw new Error("리딩 입력 또는 상품 조회 실패");

  return { service, order: order as OrderLite, svc, payload: input.payload, product };
}

// 1) 드로우 보장 — 이미 readings 가 있으면 재드로우하지 않는다(새로고침/중복호출 방어).
export async function ensureDrawn(orderInternalId: string): Promise<{ readingId: string; drawRecord: DrawRecord }> {
  const { service, order, svc, payload } = await loadContext(orderInternalId);

  const { data: existing } = await service
    .from("readings")
    .select("id, draw_record")
    .eq("order_id", order.id)
    .maybeSingle();
  if (existing?.draw_record) {
    return { readingId: existing.id, drawRecord: existing.draw_record as unknown as DrawRecord };
  }

  const parsedInput = svc.inputSchema.parse(payload);
  const seed = generateDrawSeed();
  const drawRecord = svc.draw(parsedInput, seed);

  // upsert: 혹시 row 만 있고 draw_record 가 비어있는 경우까지 커버
  const { data: row, error } = await service
    .from("readings")
    .upsert(
      {
        order_id: order.id,
        service_type: order.service_type as "tarot",
        draw_record: drawRecord as unknown as Json,
        status: "drawn",
      },
      { onConflict: "order_id" },
    )
    .select("id")
    .single();
  if (error || !row) throw new Error(`드로우 저장 실패: ${error?.message ?? "unknown"}`);

  await service.from("orders").update({ reading_status: "drawn" }).eq("id", order.id);
  return { readingId: row.id, drawRecord };
}

// 2) AI 초안 생성 — 드로우 결과로 프롬프트 구성 → JSON 생성 → draft_result 저장.
//    실패 시 status='failed' + error_log. (관리자 재생성 가능)
export async function generateDraft(orderInternalId: string): Promise<{ status: "draft" | "failed"; error?: string }> {
  const { service, order, svc, payload, product } = await loadContext(orderInternalId);
  const { drawRecord } = await ensureDrawn(order.id);

  await service.from("readings").update({ status: "generating", error_log: null }).eq("order_id", order.id);

  const parsedInput = svc.inputSchema.parse(payload) as { question?: string | null };
  const ctx: PromptContext = {
    productSlug: product.slug,
    productName: product.name,
    question: parsedInput.question ?? null,
    draw: drawRecord,
  };
  const prompt = svc.buildPrompt(ctx);
  const result = await generateJson(prompt, readingResultSchema, { maxRetries: 2 });

  if (!result.parsed) {
    await service
      .from("readings")
      .update({
        status: "failed",
        raw_response: (result.raw ?? "") as unknown as Json,
        model: result.model,
        prompt_version: result.promptVersion,
        error_log: result.error ?? "생성 실패",
      })
      .eq("order_id", order.id);
    await service.from("orders").update({ reading_status: "failed" }).eq("id", order.id);
    return { status: "failed", error: result.error };
  }

  await service
    .from("readings")
    .update({
      status: "draft",
      raw_response: result.raw as unknown as Json,
      draft_result: result.parsed as unknown as Json,
      model: result.model,
      prompt_version: result.promptVersion,
      error_log: null,
    })
    .eq("order_id", order.id);
  await service.from("orders").update({ reading_status: "draft" }).eq("id", order.id);
  return { status: "draft" };
}

// 3) 발행 — final_result 확정(관리자 수정본 우선, 없으면 draft) + published.
export async function publishReading(
  orderInternalId: string,
  finalResult?: ReadingResult,
): Promise<void> {
  const service = createServiceClient();
  const { data: reading } = await service
    .from("readings")
    .select("id, draft_result, final_result")
    .eq("order_id", orderInternalId)
    .maybeSingle();
  if (!reading) throw new Error("리딩을 찾을 수 없습니다");

  const final = finalResult ?? reading.final_result ?? reading.draft_result;
  if (!final) throw new Error("발행할 결과(초안)가 없습니다");

  await service
    .from("readings")
    .update({
      final_result: final as unknown as Json,
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("order_id", orderInternalId);
  await service.from("orders").update({ reading_status: "published" }).eq("id", orderInternalId);
}

// 발행 취소 — 고객 노출 중단(초안 상태로 되돌림)
export async function unpublishReading(orderInternalId: string): Promise<void> {
  const service = createServiceClient();
  await service.from("readings").update({ status: "draft", published_at: null }).eq("order_id", orderInternalId);
  await service.from("orders").update({ reading_status: "draft" }).eq("id", orderInternalId);
}

// 관리자 수정본 저장(발행 없이 final_result 만 갱신)
export async function saveFinalResult(orderInternalId: string, finalResult: ReadingResult): Promise<void> {
  const service = createServiceClient();
  await service
    .from("readings")
    .update({ final_result: finalResult as unknown as Json })
    .eq("order_id", orderInternalId);
}

// 결제 confirm 후 호출 — 드로우는 항상, 생성/발행은 상품 발행정책에 따라.
//   auto  : 드로우 → 초안 생성 → 발행(고객 즉시 확인)
//   review: 드로우만(관리자 검수/생성 대기). 고객은 '준비 중'으로 표시됨.
// LLM 실패해도 결제 흐름은 깨지 않는다(토큰 반환, 관리자 재생성).
export async function runPaidReading(orderInternalId: string): Promise<{ publicToken: string | null; status: string }> {
  const { order, svc, product } = await loadContext(orderInternalId);
  await ensureDrawn(order.id);

  const policy = svc.publishPolicy(product.slug);
  if (policy === "auto") {
    const gen = await generateDraft(order.id);
    if (gen.status === "draft") {
      await publishReading(order.id);
      return { publicToken: order.public_token, status: "published" };
    }
    return { publicToken: order.public_token, status: "failed" };
  }
  // review: 드로우만 완료. 관리자 검수 대기.
  return { publicToken: order.public_token, status: "drawn" };
}
