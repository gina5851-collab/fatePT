// =====================================================
// 사주 결과지 생성 (명식 + LLM 해석 → saju_results 저장)
// =====================================================
// 토스 결제 confirm(/api/orders/confirm) 과 관리자 무통장입금 확인
// (/admin/orders) 양쪽에서 공통으로 호출합니다.
// 이미 결과가 있으면 재생성하지 않고 기존 결과 id 를 반환합니다 (idempotent).

import { createServiceClient } from "@/lib/supabase/server";
import { computeMyeongsik, type Myeongsik } from "./manseryeok";
import { buildSajuPrompt } from "./prompt";
import { generateInterpretation } from "./llm";
import {
  isSajuApiConfigured,
  fetchSajuAnalysis,
  formatSajuToManseryeok,
  ganjiToMyeongsik,
  type BirthInfo,
} from "./saju-api";

type SajuInputRow = {
  birth_date: string; // "YYYY-MM-DD"
  birth_time: string | null; // "HH:mm"
  time_unknown: boolean;
  calendar: "solar" | "lunar";
  gender: "male" | "female";
  concerns: string[];
};

function toBirthInfo(input: SajuInputRow): BirthInfo {
  const [y, m, d] = input.birth_date.split("-");
  const hasTime = !input.time_unknown && !!input.birth_time;
  const [hh, mm] = hasTime ? input.birth_time!.split(":") : [undefined, undefined];
  return {
    birthYear: y,
    birthMonth: String(parseInt(m, 10)),
    birthDay: String(parseInt(d, 10)),
    ...(hasTime ? { birthHour: String(parseInt(hh!, 10)), birthMinute: String(parseInt(mm!, 10)) } : {}),
    calendarType: input.calendar === "lunar" ? "음력" : "양력",
    gender: input.gender,
  };
}

function toComputeInput(input: SajuInputRow) {
  return {
    birthDate: input.birth_date,
    birthTime: input.birth_time,
    timeUnknown: input.time_unknown,
    calendar: input.calendar,
    gender: input.gender,
  };
}

// orderInternalId: orders.id (PK, UUID) — 토스 orderId 텍스트가 아님에 주의.
// 성공 시 생성(또는 기존)된 saju_results.id 반환. 실패 시 throw.
export async function generateSajuResult(orderInternalId: string, productId: string): Promise<string> {
  const service = createServiceClient();

  // idempotent: 이미 결과가 있으면 그대로 반환
  const { data: existing } = await service
    .from("saju_results")
    .select("id")
    .eq("order_id", orderInternalId)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: input } = await service
    .from("saju_inputs")
    .select("*")
    .eq("order_id", orderInternalId)
    .single();
  const { data: product } = await service
    .from("products")
    .select("slug, name")
    .eq("id", productId)
    .single();

  if (!input || !product) {
    throw new Error("사주 입력 또는 상품 조회 실패");
  }

  // 만세력/풀 분석: luckyloveme 키가 있으면 실제 API, 없거나 실패하면 mock 으로 fallback
  let myeongsik: Myeongsik;
  let manseryeokText: string | undefined;
  let analysis: Awaited<ReturnType<typeof fetchSajuAnalysis>> | null = null;

  if (isSajuApiConfigured()) {
    try {
      const birthInfo = toBirthInfo(input);
      analysis = await fetchSajuAnalysis(birthInfo, []); // [] = 16종 전체
      const converted = ganjiToMyeongsik(analysis);
      if (converted) {
        myeongsik = converted;
        manseryeokText = formatSajuToManseryeok(analysis, birthInfo);
      } else {
        myeongsik = await computeMyeongsik(toComputeInput(input));
      }
    } catch (apiErr) {
      console.error("[saju-api] fallback to mock:", apiErr);
      analysis = null;
      myeongsik = await computeMyeongsik(toComputeInput(input));
    }
  } else {
    myeongsik = await computeMyeongsik(toComputeInput(input));
  }

  const { system, user } = buildSajuPrompt({
    productSlug: product.slug,
    productName: product.name,
    myeongsik,
    manseryeokText,
    birthDate: input.birth_date,
    birthTime: input.birth_time,
    timeUnknown: input.time_unknown,
    gender: input.gender,
    concerns: input.concerns,
  });

  const llm = await generateInterpretation({ system, user });

  const { data: result, error: resultErr } = await service
    .from("saju_results")
    .insert({
      order_id: orderInternalId,
      myeongsik: myeongsik as never,
      interpretation_md: llm.text,
      llm_provider: llm.provider,
      llm_model: llm.model,
      analysis: (analysis ?? null) as never, // 만세력 원본 — 결과 페이지 리포트 재구성용
    })
    .select("id")
    .single();

  if (resultErr || !result) {
    throw new Error(`결과 저장 실패: ${resultErr?.message ?? "unknown"}`);
  }

  return result.id;
}
