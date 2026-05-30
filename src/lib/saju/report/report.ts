// =====================================================
// 운명PT 리포트 조립 — 무료 2 + 잠금 21 (총 23) + CTA
// =====================================================
// 사주 원데이터 → "반복 패턴 리포트" 항목 목록으로 변환.
// 제목·티저는 모두 노출(후킹), 본문은 잠금 항목만 가린다(페이월).

import type { SajuAnalysisResponse } from "@/lib/saju/saju-api";
import type { CtaCopy, DunmyeongReport } from "./types";
import { normalizeSaju } from "./adapter";
import { computeMetrics } from "./metrics";
import { buildItems } from "./items";
import { buildPersona } from "./persona";
import { readMbti, type MbtiType } from "./mbti";

const CTA: CtaCopy = {
  primary: "내 반복 패턴 전체 해금하기",
  secondary: "내 운의 누수 지점 보기",
  tertiary: "2026년 전환 흐름 확인하기",
};

// GPT 검증 반영: 신살 → 운명PT 톤 (점술 단정 X, 자기이해 언어)
export const SINSAL_COPY: Record<string, string> = {
  역마: "한곳에 오래 머물기보다, 움직이면서 길이 열리는 사람입니다.",
  도화: "사람들의 시선을 끌고, 관계 안에서 존재감이 쉽게 드러나는 흐름입니다.",
  화개: "혼자 있을 때 깊어지고, 고독을 통해 감각과 생각이 정리되는 사람입니다.",
  망신: "말과 행동이 예상보다 크게 드러날 수 있어, 이미지와 표현 방식을 섬세하게 관리할 필요가 있습니다.",
  재살: "갑작스러운 변수에 예민한 흐름이 있어, 무리한 선택보다 안전장치가 중요합니다.",
  홍염: "감정의 온도와 분위기로 사람을 끌어당기는 결이 있습니다.",
};

// 신살 이름에서 핵심 키워드를 뽑아 위 카피로 매핑 (예: "역마살" → "역마")
export function sinsalCopy(name: string): string | null {
  for (const key of Object.keys(SINSAL_COPY)) {
    if (name.includes(key)) return SINSAL_COPY[key];
  }
  return null;
}

// GPT 검증 반영: 재회 가능성 CS 응대 스크립트 (단정 X)
export const REUNION_CS_SCRIPT = [
  "운명PT는 재회 가능성을 몇 %처럼 단정해서 말씀드리지는 않습니다.",
  "대신 두 사람의 관계에서 반복되는 감정 패턴, 다시 연락이 이어지기 쉬운 흐름, 그리고 지금 조심해야 할 선택을 함께 읽어드립니다.",
  "재회 여부보다 중요한 건 같은 상처를 반복하지 않도록 내 감정의 방향과 상대와의 거리감을 먼저 확인하는 것입니다.",
].join("\n");

export function buildDunmyeongReport(
  analysis: SajuAnalysisResponse,
  mbti: MbtiType = "UNKNOWN",
): DunmyeongReport {
  const saju = normalizeSaju(analysis);
  const metrics = computeMetrics(saju);
  const items = buildItems(saju, metrics);
  return {
    saju,
    metrics,
    items,
    freeCount: items.filter((i) => i.free).length,
    lockedCount: items.filter((i) => !i.free).length,
    cta: CTA,
    persona: buildPersona(saju, mbti),
    mbti,
    mbtiReading: readMbti(mbti),
  };
}
