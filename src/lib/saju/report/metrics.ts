// =====================================================
// 운명PT 8대 지표 계산
// =====================================================
// 사주 원데이터를 "오래 버틴 사람의 반복 패턴" 관점 지표로 변환.
// 점수는 결정론적(같은 입력=같은 출력). 0-100, 명리 근거를 가중 합산.
// 모든 oneLiner는 평가가 아니라 해석 톤 — "부족해서가 아니라 버티며 생긴 패턴".

import type { NormalizedSaju, Metric, MetricKey } from "./types";

// GPT 검증 반영: clamp(0,100). 대부분 30~85 분포하도록 기저값/계수 조정.
function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}
const up = (n: number) => Math.max(n, 0);

function band(score: number): Metric["band"] {
  if (score >= 80) return "매우 높음";
  if (score >= 60) return "높음";
  if (score >= 40) return "보통";
  return "낮음";
}

export function computeMetrics(s: NormalizedSaju): Metric[] {
  const bigyeop = s.sipseongCount.비겁성;
  const siksang = s.sipseongCount.식상성;
  const jae = s.sipseongCount.재성;
  const gwan = s.sipseongCount.관성;
  const inseong = s.sipseongCount.인성;
  const level = s.sinStrengthLevel ?? 4; // 1-7, 없으면 중화
  const total = bigyeop + siksang + jae + gwan + inseong || 1;

  // ── 버팀력 (GPT 교정) ──
  const endurance = clamp(
    40 + bigyeop * 4 + inseong * 5 + s.ohaengCount.토 * 3 + up(level - 4) * 5 - up(4 - level) * 2 + s.guiinCount * 2,
  );

  // ── 자기보호력 (GPT 교정: 인성·관성약함 보조, 충 가중↓) ──
  const selfProtection = clamp(
    38 + bigyeop * 5 + inseong * 3 + s.geobjaeCount * 5 + s.chungCount * 3 + up(level - 4) * 4 + up(2 - gwan) * 4,
  );

  // ── 감정 감지력 (GPT 교정: 식상 가중↓, 화개·귀문 추가) ──
  const emotionSensing = clamp(
    36 + inseong * 5 + siksang * 3 + s.ohaengCount.수 * 4 +
      (s.hasDohwa ? 5 : 0) + (s.hasHongyeom ? 5 : 0) + (s.hasHwagae ? 3 : 0) + (s.hasGwimun ? 6 : 0),
  );

  // ── 관계 피로도 (GPT 교정: 비겁과다·겁재·충 중심, 도화/홍염 약하게, 귀인 감점) ──
  const relationFatigue = clamp(
    34 + bigyeop * 3 + s.geobjaeCount * 6 + s.chungCount * 5 + up(bigyeop - 2) * 4 +
      (s.ohaengMissing.includes("수") ? 5 : 0) + (s.hasDohwa ? 2 : 0) + (s.hasHongyeom ? 2 : 0) - s.guiinCount * 2,
  );

  // ── 반복 위험도 (GPT 교정: 충·결핍·편중·식상0·대운세운충돌 중심, 합 가중↓) ──
  const repetitionRisk = clamp(
    34 + s.chungCount * 5 + s.hapCount * 3 + s.ohaengMissing.length * 5 +
      (siksang === 0 ? 7 : 0) + (s.sipseongConcentrated ? 8 : 0) + (s.seunChangePressure ? 5 : 0) + (s.hasHwagae ? 3 : 0),
  );

  // ── 전환 준비도 (GPT 교정: 대운십성+6 제거 → 역마·대운교체기·세운변화) ──
  const transitionReady = clamp(
    34 + siksang * 5 + jae * 4 + s.ohaengCount.화 * 2 + s.guiinCount * 2 +
      (s.hasYeokma ? 6 : 0) + (s.daeunTransition ? 8 : 0) + (s.seunChangePressure ? 5 : 0),
  );

  // ── 돈 누수 감도 (GPT 교정: 겁재 중심 + 비겁>재성 + 재성약·식상0·재성충·대운세운겁재) ──
  const moneyLeak = clamp(
    30 + s.geobjaeCount * 7 + up(bigyeop - jae) * 4 + (jae <= 1 ? 6 : 0) +
      (siksang === 0 ? 4 : 0) + (s.jaeChung ? 6 : 0) + (s.daeunSeunGeobjae ? 5 : 0) - (s.guiinCount > 0 ? 2 : 0),
  );

  // ── 회복 탄력성 (GPT 교정: 인성 가중↓, 용신흐름 추가, 충 감점) ──
  const resilience = clamp(
    38 + inseong * 5 + s.guiinCount * 4 + up(level - 4) * 3 + (5 - s.ohaengMissing.length) * 3 +
      (s.inYongsinFlow ? 6 : 0) - s.chungCount * 2,
  );

  const defs: { key: MetricKey; label: string; display: string; score: number; positive: boolean; oneLiner: (sc: number) => string }[] = [
    {
      key: "endurance", label: "버팀력", display: "오래 버틴 힘", score: endurance, positive: true,
      oneLiner: (sc) => sc >= 60
        ? "웬만한 일에는 흔들리지 않고 끝까지 버텨온 분이에요."
        : "버티는 데 에너지를 많이 써와서, 이제는 덜 버텨도 되는 구조가 필요해요.",
    },
    {
      key: "selfProtection", label: "자기보호력", display: "나를 지키는 힘", score: selfProtection, positive: true,
      oneLiner: (sc) => sc >= 60
        ? "상처를 미리 막으려고 경계를 단단히 세워온 패턴이 보여요."
        : "자신을 보호하기보다 먼저 감당해온 쪽이라, 경계선을 다시 그어도 좋아요.",
    },
    {
      key: "emotionSensing", label: "감정 감지력", display: "감정 감지력", score: emotionSensing, positive: true,
      oneLiner: (sc) => sc >= 60
        ? "남의 감정을 빠르게 읽어내요. 그만큼 혼자 흡수하는 양도 많았을 거예요."
        : "감정을 깊이 느끼기보다 일단 처리해온 쪽이에요. 느껴도 괜찮아요.",
    },
    {
      key: "relationFatigue", label: "관계 피로도", display: "관계 소진도", score: relationFatigue, positive: false,
      oneLiner: (sc) => sc >= 60
        ? "관계에서 늘 더 많이 책임지느라 쉽게 지쳐온 구조가 보여요."
        : "관계 에너지는 비교적 안정적인 편이에요.",
    },
    {
      key: "repetitionRisk", label: "반복 위험도", display: "반복 패턴 지수", score: repetitionRisk, positive: false,
      oneLiner: (sc) => sc >= 60
        ? "비슷한 선택·관계가 반복되기 쉬운 흐름이에요. 패턴을 알면 끊을 수 있어요."
        : "같은 패턴에 갇히기보다 빠져나오는 힘이 있는 편이에요.",
    },
    {
      key: "transitionReady", label: "전환 준비도", display: "전환 타이밍 지수", score: transitionReady, positive: true,
      oneLiner: (sc) => sc >= 60
        ? "변화를 현실로 옮길 추진력이 차오르는 시기예요."
        : "아직은 준비를 다지는 구간. 무리한 전환보다 한 걸음씩이 맞아요.",
    },
    {
      key: "moneyLeak", label: "돈 누수 감도", display: "돈이 새는 지점", score: moneyLeak, positive: false,
      oneLiner: (sc) => sc >= 60
        ? "벌어도 새어나가기 쉬운 구조예요. 어디서 빠지는지 알면 막을 수 있어요."
        : "돈을 지키는 힘은 비교적 안정적인 편이에요.",
    },
    {
      key: "resilience", label: "회복 탄력성", display: "다시 일어서는 힘", score: resilience, positive: true,
      oneLiner: (sc) => sc >= 60
        ? "넘어져도 다시 일어서는 회복의 뿌리가 단단해요."
        : "회복에 시간이 걸리는 편이라, 재충전 루틴이 특히 중요해요.",
    },
  ];

  return defs.map((d) => ({
    key: d.key,
    label: d.label,
    display: d.display,
    score: d.score,
    band: band(d.score),
    oneLiner: d.oneLiner(d.score),
    positive: d.positive,
  }));
}
