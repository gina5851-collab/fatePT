// =====================================================
// 타로 스프레드 정의 — 포지션(단일 소스)
// =====================================================
// 기준: docs/TAROT_PRODUCT_STANDARD.md (타로 상품 기준 v1)
import type { TarotSpreadKind } from "./config";

export type SpreadPosition = {
  index: number;
  label: string; // 포지션명(결과/프롬프트 공통)
  hint: string; // 고객 안내용 짧은 설명
};

export const SPREAD_LABEL: Record<TarotSpreadKind, string> = {
  daily: "원 카드",
  "three-card-time": "3 카드 — 과거 / 현재 / 미래",
  "three-card-relation": "3 카드 — 나 / 상대방 / 관계",
  "three-card-flow": "3 카드 — 원인 / 과정 / 결과",
  "celtic-cross": "켈틱 크로스 (10장)",
};

export const SPREADS: Record<TarotSpreadKind, SpreadPosition[]> = {
  daily: [{ index: 0, label: "핵심 메시지", hint: "지금 흐름에서 붙잡아야 할 한 마디와 오늘의 조언" }],
  "three-card-time": [
    { index: 0, label: "과거", hint: "지금 상황을 만든 지나온 흐름" },
    { index: 1, label: "현재", hint: "지금 놓여 있는 상태" },
    { index: 2, label: "미래", hint: "이대로 갈 때 다가올 흐름" },
  ],
  "three-card-relation": [
    { index: 0, label: "나", hint: "이 관계에서 나의 마음과 자세" },
    { index: 1, label: "상대방", hint: "상대가 품고 있는 마음" },
    { index: 2, label: "관계", hint: "두 사람 사이의 기류와 방향" },
  ],
  "three-card-flow": [
    { index: 0, label: "원인", hint: "문제가 시작된 지점" },
    { index: 1, label: "과정", hint: "지금 진행되고 있는 흐름" },
    { index: 2, label: "결과", hint: "이 흐름이 향하는 지점" },
  ],
  "celtic-cross": [
    { index: 0, label: "현재 상황", hint: "지금 내가 서 있는 자리" },
    { index: 1, label: "도전 또는 장애물", hint: "정면으로 마주한 과제" },
    { index: 2, label: "의식적 목표", hint: "내가 의식적으로 바라는 것" },
    { index: 3, label: "무의식 또는 기반", hint: "상황 아래에 깔린 뿌리" },
    { index: 4, label: "과거의 영향", hint: "지금까지 영향을 준 흐름" },
    { index: 5, label: "가까운 미래", hint: "곧 다가올 국면" },
    { index: 6, label: "나의 접근 방식", hint: "내가 취하고 있는 태도" },
    { index: 7, label: "외부 영향", hint: "주변 사람·환경의 작용" },
    { index: 8, label: "희망과 두려움", hint: "마음속 기대와 불안" },
    { index: 9, label: "최종 결과", hint: "이 흐름의 종착점" },
  ],
};

export function getSpread(kind: TarotSpreadKind): SpreadPosition[] {
  return SPREADS[kind];
}
