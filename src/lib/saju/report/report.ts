// =====================================================
// 운명PT 리포트 조립 — 무료 2 + 잠금 21 (총 23) + CTA
// =====================================================
// 사주 원데이터 → "반복 패턴 리포트" 항목 목록으로 변환.
// 제목·티저는 모두 노출(후킹), 본문은 잠금 항목만 가린다(페이월).

import type { SajuAnalysisResponse } from "@/lib/saju/saju-api";
import type {
  NormalizedSaju, ReportItem, ReportItemCategory, CtaCopy, DunmyeongReport, Metric,
} from "./types";
import { normalizeSaju } from "./adapter";
import { computeMetrics } from "./metrics";

const CTA: CtaCopy = {
  primary: "내 반복 패턴 전체 해금하기",
  secondary: "내 운의 누수 지점 보기",
  tertiary: "2026년 전환 흐름 확인하기",
};

// 지표를 티저 문구에 녹여 "내 얘기"처럼 — 평가 X, 해석 O
function pick(metrics: Metric[], key: string): Metric | undefined {
  return metrics.find((m) => m.key === key);
}

function buildItems(s: NormalizedSaju, metrics: Metric[]): ReportItem[] {
  const dom = s.sipseongDominant ?? "비겁성";
  const missing = s.ohaengMissing[0] ?? null;
  const rep = pick(metrics, "repetitionRisk");
  const leak = pick(metrics, "moneyLeak");
  const fatigue = pick(metrics, "relationFatigue");

  // free 2개: 가장 후킹되는 "나의 본질" + "반복 신호" — 본문 공개
  const items: { category: ReportItemCategory; title: string; teaser: string; free?: boolean }[] = [
    // ── 무료 공개 2 ──
    {
      category: "나",
      title: "오래 버틴 사람의 기질",
      teaser: `${s.sinStrengthLabel ?? "당신"}의 구조 — 부족해서가 아니라, 오래 버티며 단단해진 기질이에요.`,
      free: true,
    },
    {
      category: "흐름",
      title: "지금 반복되고 있는 신호 1가지",
      teaser: rep && rep.score >= 60
        ? "비슷한 선택이 되풀이되기 쉬운 흐름이 보여요. 그 출발점을 짚어드려요."
        : "지금 흐름에서 가장 먼저 정리하면 좋은 패턴 하나를 짚어드려요.",
      free: true,
    },

    // ── 잠금 21 ──
    // [나] 5
    { category: "나", title: "내 안의 진짜 동력", teaser: `${dom}이 만든 추진 방식과 지칠 때의 신호.` },
    { category: "나", title: "남에게 안 들키는 약한 지점", teaser: "강해 보이지만 사실 가장 먼저 무너지는 자리." },
    { category: "나", title: "내가 나를 검열하는 방식", teaser: "스스로에게 가장 가혹해지는 순간의 패턴." },
    { category: "나", title: "타고난 강점 근육 3가지", teaser: "이미 잘 쓰고 있어 당연하게 여겨온 힘." },
    { category: "나", title: missing ? `결핍된 ${missing} 기운이 만든 습관` : "기질의 빈 자리가 만든 습관", teaser: "비어 있는 자리가 행동에 남긴 흔적." },

    // [관계] 5
    { category: "관계", title: "관계에서 반복되는 자세", teaser: fatigue && fatigue.score >= 60 ? "늘 더 많이 책임지다 지치는 구조." : "관계에서 되풀이되는 거리 두기 방식." },
    { category: "관계", title: "끌리는 사람 / 지치는 사람", teaser: "왜 비슷한 유형에게 매번 끌리는지." },
    { category: "관계", title: "갈등이 터지는 지점", teaser: "참다가 한 번에 무너지는 패턴의 방아쇠." },
    { category: "관계", title: "거리 두기와 죄책감", teaser: "선을 그으면 미안해지는 마음의 구조." },
    { category: "관계", title: "곁에 두면 회복되는 인연", teaser: "당신의 에너지를 채워주는 사람의 결." },

    // [돈·일] 4
    { category: "돈·일", title: "돈이 새어나가는 지점", teaser: leak && leak.score >= 60 ? "벌어도 모이지 않는 구조의 출구." : "지출에서 반복되는 습관의 자리." },
    { category: "돈·일", title: "나에게 맞는 돈 버는 방식", teaser: "직접 뛸 때 / 쌓을 때 / 모을 때 — 내 결." },
    { category: "돈·일", title: "일에서 지치는 진짜 이유", teaser: "성과가 아니라 방식에서 새는 에너지." },
    { category: "돈·일", title: "전환·이직 타이밍", teaser: "버틸 때와 움직일 때를 가르는 신호." },

    // [흐름] 4
    { category: "흐름", title: "2026년 전환 흐름", teaser: `${s.seun.currentLabel ?? "올해"}의 큰 방향 — 무엇이 열리고 무엇을 조심할지.` },
    { category: "흐름", title: "대운이 바뀌는 길목", teaser: `${s.daeun.currentLabel ? `현재 ${s.daeun.currentLabel} 대운` : "지금 대운"}이 만드는 10년의 결.` },
    { category: "흐름", title: "조심해야 할 시기", teaser: "무리하면 반복 패턴이 도지는 구간." },
    { category: "흐름", title: "움직이기 좋은 시기", teaser: "결정·시작이 잘 풀리는 흐름의 창." },

    // [회복] 3
    { category: "회복", title: "나만의 회복 루틴", teaser: "방전됐을 때 가장 빨리 채워지는 방식." },
    { category: "회복", title: "번아웃 경고 신호", teaser: "쓰러지기 전에 몸·마음이 보내는 사인." },
    { category: "회복", title: "오늘부터의 작은 처방", teaser: "내일이 아니라 오늘 할 수 있는 한 가지." },
  ];

  return items.map((it, i) => ({
    id: `item-${i + 1}`,
    category: it.category,
    title: it.title,
    teaser: it.teaser,
    free: it.free ?? false,
  }));
}

export function buildDunmyeongReport(analysis: SajuAnalysisResponse): DunmyeongReport {
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
  };
}
