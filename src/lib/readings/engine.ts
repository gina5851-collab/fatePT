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

// 'generating' 고착 판단 기준 — 생성 함수(maxDuration 60초)가 죽어 상태만 남은 경우.
// 이 시간보다 오래된 generating 만 재개 대상으로 claim 한다(진행 중인 생성은 절대 가로채지 않음).
export const GENERATING_STALE_MS = 3 * 60 * 1000;

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

  // 동시 호출 경쟁 안전: ON CONFLICT DO NOTHING — 먼저 저장된 드로우가 정본이 되고,
  // 진 쪽은 저장된 드로우를 다시 읽어 반환한다. 어떤 경로로도 기존 드로우를 덮지 않는다.
  const { data: inserted, error } = await service
    .from("readings")
    .upsert(
      {
        order_id: order.id,
        service_type: order.service_type as "tarot",
        draw_record: drawRecord as unknown as Json,
        status: "drawn",
      },
      { onConflict: "order_id", ignoreDuplicates: true },
    )
    .select("id");
  if (error) throw new Error(`드로우 저장 실패: ${error.message}`);
  if (inserted && inserted.length > 0) {
    await service.from("orders").update({ reading_status: "drawn" }).eq("id", order.id);
    return { readingId: inserted[0].id, drawRecord };
  }

  // 충돌로 건너뜀 — 경쟁자가 먼저 썼거나, 행만 있고 draw_record 가 비어 있던 경우
  const { data: row } = await service
    .from("readings")
    .select("id, draw_record")
    .eq("order_id", order.id)
    .maybeSingle();
  if (!row) throw new Error("드로우 저장 실패: 행 조회 불가");
  if (row.draw_record) {
    return { readingId: row.id, drawRecord: row.draw_record as unknown as DrawRecord };
  }

  // draw_record 가 비어 있는 기존 행만 조건부로 채운다 (다른 드로우는 절대 덮지 않음)
  await service
    .from("readings")
    .update({ draw_record: drawRecord as unknown as Json, status: "drawn" })
    .eq("id", row.id)
    .is("draw_record", null);
  const { data: filled } = await service.from("readings").select("draw_record").eq("id", row.id).maybeSingle();
  if (!filled?.draw_record) throw new Error("드로우 저장 실패: draw_record 채움 불가");
  await service.from("orders").update({ reading_status: "drawn" }).eq("id", order.id);
  return { readingId: row.id, drawRecord: filled.draw_record as unknown as DrawRecord };
}

// 2) AI 초안 생성 — 드로우 결과로 프롬프트 구성 → JSON 생성 → draft_result 저장.
//    실패 시 status='failed' + error_log. (관리자 재생성 가능)
//    동시성: 'generating' 전이를 원자적 claim 으로 처리한다.
//    - 기본(자동 재개 경로): drawn/failed, 또는 고착된 generating(updated_at 이 GENERATING_STALE_MS
//      보다 오래됨)만 claim — 같은 주문에 LLM 생성이 동시에 2번 돌지 않는다.
//    - force(관리자 재생성 전용): 상태 무관 재생성.
export async function generateDraft(
  orderInternalId: string,
  opts: { force?: boolean } = {},
): Promise<{ status: "draft" | "failed" | "generating"; error?: string }> {
  const { service, order, svc, payload, product } = await loadContext(orderInternalId);
  const { drawRecord } = await ensureDrawn(order.id);

  if (opts.force) {
    await service.from("readings").update({ status: "generating", error_log: null }).eq("order_id", order.id);
  } else {
    const staleBefore = new Date(Date.now() - GENERATING_STALE_MS).toISOString();
    const { data: claimed } = await service
      .from("readings")
      .update({ status: "generating", error_log: null })
      .eq("order_id", order.id)
      .or(`status.in.(drawn,failed),and(status.eq.generating,updated_at.lt.${staleBefore})`)
      .select("id");
    if (!claimed || claimed.length === 0) {
      // 다른 워커가 생성 중(신선한 generating)이거나 이미 draft/published 로 진행됨 — 중복 생성 금지
      return { status: "generating" };
    }
  }

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
// idempotent 재개 계약(결과 URL·recover API·confirm 이 공유):
//   published            → 아무것도 만들지 않고 기존 결과 그대로
//   draft                → 기존 초안 발행만 (LLM 재호출 없음)
//   drawn/failed/없음    → 기존 카드로 해석 생성 후 자동 발행 (재드로우 없음)
//   generating(신선)     → 가로채지 않고 'generating' 반환 (고착이면 claim 후 재개)
export async function runPaidReading(orderInternalId: string): Promise<{ publicToken: string | null; status: string }> {
  const { service, order, svc, product } = await loadContext(orderInternalId);
  await ensureDrawn(order.id);

  const { data: existing } = await service
    .from("readings")
    .select("status, draft_result, final_result")
    .eq("order_id", order.id)
    .maybeSingle();
  // 이미 발행됨 — 기존 결과 반환 (발행정책 무관)
  if (existing?.status === "published" && existing.final_result) {
    return { publicToken: order.public_token, status: "published" };
  }

  const policy = svc.publishPolicy(product.slug);
  if (policy === "auto") {
    // 초안까지 있으면 발행만 — LLM 을 다시 부르지 않는다
    if (existing?.status === "draft" && existing.draft_result) {
      await publishReading(order.id);
      return { publicToken: order.public_token, status: "published" };
    }
    const gen = await generateDraft(order.id);
    if (gen.status === "draft") {
      await publishReading(order.id);
      return { publicToken: order.public_token, status: "published" };
    }
    if (gen.status === "generating") {
      return { publicToken: order.public_token, status: "generating" };
    }
    return { publicToken: order.public_token, status: "failed" };
  }
  // review: 드로우만 완료. 관리자 검수 대기.
  return { publicToken: order.public_token, status: "drawn" };
}
