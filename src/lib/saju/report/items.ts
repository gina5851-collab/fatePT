// =====================================================
// 리포트 항목 (무료 2 + 잠금 21) — relatedSignals 포함
// =====================================================
import type { NormalizedSaju, ReportItem, ReportItemCategory, Metric } from "./types";

function pick(metrics: Metric[], key: string) {
  return metrics.find((m) => m.key === key);
}

export function buildItems(s: NormalizedSaju, metrics: Metric[]): ReportItem[] {
  const rep = pick(metrics, "repetitionRisk");

  type Def = { category: ReportItemCategory; title: string; teaser: string; free?: boolean; signals?: string[] };
  const defs: Def[] = [
    // ── 무료 2 ──
    {
      category: "나", free: true,
      title: "오래 버틴 사람의 기질",
      teaser: `${s.sinStrengthLabel ?? "당신"}의 구조 — 부족해서가 아니라, 오래 버티며 단단해진 기질이에요.`,
    },
    {
      category: "흐름", free: true,
      title: "지금 반복되고 있는 신호 1가지",
      teaser: rep && rep.score >= 60
        ? "비슷한 선택이 되풀이되기 쉬운 흐름이 보여요. 그 출발점을 짚어드려요."
        : "지금 흐름에서 가장 먼저 정리하면 좋은 패턴 하나를 짚어드려요.",
    },

    // ── 잠금 21 (relatedSignals 포함) ──
    // [나]
    { category: "나", title: "오래 버틴 시간이 자산으로 바뀌는 시기", teaser: "버틴 게 손해가 아니라 밑천이 되는 그 지점.", signals: ["비겁", "인성", "대운"] },
    { category: "나", title: "전성기가 늦게 열리는 이유", teaser: "왜 지금까지 안 풀렸는지, 그리고 언제 열리는지.", signals: ["일주", "대운", "인성"] },
    { category: "나", title: "남에게 안 들키는 약한 지점", teaser: "강해 보이지만 가장 먼저 무너지는 자리.", signals: ["MBTI", "식상", "수기운"] },
    { category: "나", title: "더 세게 버티지 않아도 되는 첫 번째 행동", teaser: "이제 힘 빼도 되는 자리를 짚어드려요.", signals: ["신강/신약", "비겁", "관성"] },
    { category: "나", title: "지금 회복해야 할 나만의 기준", teaser: "남 기준 말고, 내 기준을 다시 세우는 법.", signals: ["관성", "인성", "MBTI"] },

    // [관계]
    { category: "관계", title: "관계가 바뀌어도 같은 상처가 반복되는 이유", teaser: "사람을 바꿔도 똑같은 자리에서 아픈 구조.", signals: ["비겁", "겁재", "충"] },
    { category: "관계", title: "나를 지치게 만드는, 무해한 척하는 관계", teaser: "나쁜 사람은 아닌데 곁에 있으면 닳는 관계.", signals: ["겁재", "비견", "관성"] },
    { category: "관계", title: "끌리는 사람 / 지치는 사람", teaser: "왜 매번 비슷한 유형에게 끌리는지.", signals: ["도화", "홍염", "MBTI"] },
    { category: "관계", title: "참다가 한 번에 무너지는 갈등의 방아쇠", teaser: "터지기 직전까지 가는 그 지점.", signals: ["충", "식상", "감정지표"] },
    { category: "관계", title: "곁에 두면 회복되는 인연", teaser: "에너지를 채워주는 사람의 결.", signals: ["귀인", "인성", "합"] },

    // [돈·일]
    { category: "돈·일", title: "돈이 들어와도 남지 않는 진짜 누수 지점", teaser: "버는 게 아니라 새는 자리가 문제일 때.", signals: ["재성", "비겁", "겁재"] },
    { category: "돈·일", title: "일·돈 흐름에서 반복되는 병목 구간", teaser: "매번 같은 데서 막히는 그 구간.", signals: ["재성", "식상", "대운"] },
    { category: "돈·일", title: "나에게 맞는 돈 버는 방식", teaser: "직접 뛸 때 / 쌓을 때 / 모을 때 — 내 결.", signals: ["재성", "식상", "MBTI"] },
    { category: "돈·일", title: "버틸 때와 움직일 때를 가르는 신호", teaser: "전환·이직 타이밍의 분기점.", signals: ["대운", "세운", "역마"] },
    { category: "돈·일", title: "올해 다시 반복될 가능성이 높은 선택 패턴", teaser: `${s.seun.currentLabel ?? "2026년"}에 또 나올 수 있는 그 선택.`, signals: ["합", "충", "결핍오행"] },

    // [흐름]
    { category: "흐름", title: "2026년에 반드시 조심해야 할 시기", teaser: "무리하면 반복 패턴이 도지는 구간.", signals: ["세운", "월운", "충"] },
    { category: "흐름", title: "움직이기 좋은 시기", teaser: "결정·시작이 잘 풀리는 흐름의 창.", signals: ["역마", "식상", "화기운"] },
    { category: "흐름", title: "오래 버틴 시간이 풀리기 시작하는 길목", teaser: `${s.daeun.currentLabel ? `${s.daeun.currentLabel} 대운` : "지금 대운"}이 만드는 10년의 결.`, signals: ["대운교체", "귀인", "인성"] },
    { category: "흐름", title: "올해 반드시 조심해야 할 선택", teaser: "운이 새기 쉬운 결정의 자리.", signals: ["재성충돌", "겁재", "세운"] },

    // [회복]
    { category: "회복", title: "쓰러지기 전 몸·마음이 보내는 경고 신호", teaser: "번아웃 직전의 사인을 미리.", signals: ["인성 과다", "식상 부족", "오행 결핍"] },
    { category: "회복", title: "오늘부터 할 수 있는 작은 처방", teaser: "내일이 아니라 오늘 할 한 가지.", signals: ["용신흐름", "오행보완", "MBTI"] },
  ];

  return defs.map((d, i) => ({
    id: `item-${i + 1}`,
    category: d.category,
    title: d.title,
    teaser: d.teaser,
    free: d.free ?? false,
    relatedSignals: d.signals,
  }));
}
