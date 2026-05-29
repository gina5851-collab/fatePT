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

// 지표를 티저 문구에 녹여 "내 얘기"처럼 — 평가 X, 해석 O
function pick(metrics: Metric[], key: string): Metric | undefined {
  return metrics.find((m) => m.key === key);
}

function buildItems(s: NormalizedSaju, metrics: Metric[]): ReportItem[] {
  const rep = pick(metrics, "repetitionRisk");

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

    // ── 잠금 21 (제목 = 결제 이유. 자극적이되 비단정) ──
    // [나] 5
    { category: "나", title: "오래 버틴 시간이 자산으로 바뀌는 시기", teaser: "버틴 게 손해가 아니라 밑천이 되는 그 지점." },
    { category: "나", title: "전성기가 늦게 열리는 이유", teaser: "왜 지금까지 안 풀렸는지, 그리고 언제 열리는지." },
    { category: "나", title: "남에게 안 들키는 약한 지점", teaser: "강해 보이지만 사실 가장 먼저 무너지는 자리." },
    { category: "나", title: "더 세게 버티지 않아도 되는 첫 번째 행동", teaser: "이제 힘 빼도 되는 자리를 짚어드려요." },
    { category: "나", title: "지금 회복해야 할 나만의 기준", teaser: "남 기준 말고, 내 기준을 다시 세우는 법." },

    // [관계] 5
    { category: "관계", title: "관계가 바뀌어도 같은 상처가 반복되는 이유", teaser: "사람을 바꿔도 똑같은 자리에서 아픈 구조." },
    { category: "관계", title: "나를 지치게 만드는, 무해한 척하는 관계", teaser: "나쁜 사람은 아닌데 곁에 있으면 닳는 관계." },
    { category: "관계", title: "끌리는 사람 / 지치는 사람", teaser: "왜 매번 비슷한 유형에게 끌리는지." },
    { category: "관계", title: "참다가 한 번에 무너지는 갈등의 방아쇠", teaser: "터지기 직전까지 가는 그 지점." },
    { category: "관계", title: "곁에 두면 회복되는 인연", teaser: "에너지를 채워주는 사람의 결." },

    // [돈·일] 4
    { category: "돈·일", title: "돈이 들어와도 남지 않는 진짜 누수 지점", teaser: "버는 게 아니라 새는 자리가 문제일 때." },
    { category: "돈·일", title: "일·돈 흐름에서 반복되는 병목 구간", teaser: "매번 같은 데서 막히는 그 구간." },
    { category: "돈·일", title: "나에게 맞는 돈 버는 방식", teaser: "직접 뛸 때 / 쌓을 때 / 모을 때 — 내 결." },
    { category: "돈·일", title: "버틸 때와 움직일 때를 가르는 신호", teaser: "전환·이직 타이밍의 분기점." },

    // [흐름] 4
    { category: "흐름", title: "올해 다시 반복될 가능성이 높은 선택 패턴", teaser: `${s.seun.currentLabel ?? "2026년"}에 또 나올 수 있는 그 선택.` },
    { category: "흐름", title: "오래 버틴 시간이 풀리기 시작하는 길목", teaser: `${s.daeun.currentLabel ? `${s.daeun.currentLabel} 대운` : "지금 대운"}이 만드는 10년의 결.` },
    { category: "흐름", title: "올해 반드시 조심해야 할 시기", teaser: "무리하면 반복 패턴이 도지는 구간." },
    { category: "흐름", title: "움직이기 좋은 시기", teaser: "결정·시작이 잘 풀리는 흐름의 창." },

    // [회복] 3
    { category: "회복", title: "2026년에 반드시 점검해야 할 감정 루틴", teaser: "방전 전에 채우는 나만의 회복 방식." },
    { category: "회복", title: "쓰러지기 전 몸·마음이 보내는 경고 신호", teaser: "번아웃 직전의 사인을 미리." },
    { category: "회복", title: "오늘부터 할 수 있는 작은 처방", teaser: "내일이 아니라 오늘 할 한 가지." },
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
