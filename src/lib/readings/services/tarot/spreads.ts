// =====================================================
// 타로 스프레드 정의 — 포지션(단일 소스)
// =====================================================
import type { TarotSpreadKind } from "./config";

export type SpreadPosition = {
  index: number;
  label: string; // 포지션명(결과/프롬프트 공통)
  hint: string; // 고객 안내용 짧은 설명
};

export const SPREADS: Record<TarotSpreadKind, SpreadPosition[]> = {
  daily: [{ index: 0, label: "지금 필요한 메시지", hint: "오늘 당신이 붙잡아야 할 한 마디" }],
  "inner-mind": [
    { index: 0, label: "현재 상황", hint: "지금 두 사람이 놓인 상황" },
    { index: 1, label: "상대의 속마음", hint: "그 사람이 속으로 품은 감정" },
    { index: 2, label: "앞으로의 흐름", hint: "관계가 향하는 방향" },
  ],
  relationship: [
    { index: 0, label: "현재 관계", hint: "지금 두 사람의 관계 상태" },
    { index: 1, label: "상대의 감정", hint: "그 사람이 느끼는 마음" },
    { index: 2, label: "숨겨진 장애물", hint: "드러나지 않은 걸림돌" },
    { index: 3, label: "가까운 미래", hint: "곧 다가올 흐름" },
    { index: 4, label: "조언", hint: "당신이 취하면 좋은 태도" },
  ],
};

export function getSpread(kind: TarotSpreadKind): SpreadPosition[] {
  return SPREADS[kind];
}
