// =====================================================
// 운명PT 8대 지표 계산
// =====================================================
// 사주 원데이터를 "오래 버틴 사람의 반복 패턴" 관점 지표로 변환.
// 점수는 결정론적(같은 입력=같은 출력). 0-100, 명리 근거를 가중 합산.
// 모든 oneLiner는 평가가 아니라 해석 톤 — "부족해서가 아니라 버티며 생긴 패턴".

import type { NormalizedSaju, Metric, MetricKey } from "./types";

function clamp(n: number): number {
  return Math.max(2, Math.min(98, Math.round(n)));
}

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

  // ── 버팀력: 비겁·인성(자립/뿌리) + 신강 + 토 기운 ──
  const endurance = clamp(
    30 +
      (bigyeop + inseong) * 6 +
      (level - 4) * 6 +
      s.ohaengCount.토 * 4 +
      (s.isStrong ? 8 : 0),
  );

  // ── 자기보호력: 비겁(경계심) + 충(방어 반응) + 신강 ──
  const selfProtection = clamp(
    32 + bigyeop * 7 + s.chungCount * 5 + (level - 4) * 5 + s.geobjaeCount * 4,
  );

  // ── 감정 감지력: 인성·식상(수용/표현) + 수 기운 + 도화/홍염 ──
  const emotionSensing = clamp(
    34 +
      (inseong + siksang) * 6 +
      s.ohaengCount.수 * 5 +
      (s.hasDohwa ? 6 : 0) +
      (s.hasHongyeom ? 5 : 0),
  );

  // ── 관계 피로도(주의 지표): 비겁 과다(경쟁) + 충 + 겁재 ──
  const relationFatigue = clamp(
    28 + bigyeop * 5 + s.geobjaeCount * 7 + s.chungCount * 6 + (s.ohaengMissing.includes("수") ? 8 : 0),
  );

  // ── 반복 위험도(주의 지표): 합(얽힘) + 결핍 오행 + 식상 부족(출구 막힘) ──
  const repetitionRisk = clamp(
    30 +
      s.hapCount * 6 +
      s.ohaengMissing.length * 7 +
      (siksang === 0 ? 12 : 0) +
      (s.hasHwagae ? 5 : 0),
  );

  // ── 전환 준비도: 식상·재성(추진/현실화) + 대운/세운 변화 신호 + 귀인 ──
  const transitionReady = clamp(
    30 +
      (siksang + jae) * 6 +
      s.guiinCount * 3 +
      (s.daeun.currentSipseong ? 6 : 0) +
      s.ohaengCount.화 * 3,
  );

  // ── 돈 누수 감도(주의 지표): 비겁 과다(재성 분탈) + 재성 약함 + 겁재 ──
  const moneyLeak = clamp(
    26 +
      bigyeop * 6 +
      s.geobjaeCount * 7 +
      (jae <= 1 ? 10 : 0) +
      (s.sipseongDominant === "비겁성" ? 8 : 0),
  );

  // ── 회복 탄력성: 인성(재충전) + 귀인 + 균형(결핍 적음) + 신강 ──
  const resilience = clamp(
    34 +
      inseong * 7 +
      s.guiinCount * 4 +
      (5 - s.ohaengMissing.length) * 4 +
      (s.isStrong ? 6 : 0),
  );

  const defs: { key: MetricKey; label: string; score: number; positive: boolean; oneLiner: (sc: number) => string }[] = [
    {
      key: "endurance", label: "버팀력", score: endurance, positive: true,
      oneLiner: (sc) => sc >= 60
        ? "웬만한 일에는 흔들리지 않고 끝까지 버텨온 분이에요."
        : "버티는 데 에너지를 많이 써와서, 이제는 덜 버텨도 되는 구조가 필요해요.",
    },
    {
      key: "selfProtection", label: "자기보호력", score: selfProtection, positive: true,
      oneLiner: (sc) => sc >= 60
        ? "상처를 미리 막으려고 경계를 단단히 세워온 패턴이 보여요."
        : "자신을 보호하기보다 먼저 감당해온 쪽이라, 경계선을 다시 그어도 좋아요.",
    },
    {
      key: "emotionSensing", label: "감정 감지력", score: emotionSensing, positive: true,
      oneLiner: (sc) => sc >= 60
        ? "남의 감정을 빠르게 읽어내요. 그만큼 혼자 흡수하는 양도 많았을 거예요."
        : "감정을 깊이 느끼기보다 일단 처리해온 쪽이에요. 느껴도 괜찮아요.",
    },
    {
      key: "relationFatigue", label: "관계 피로도", score: relationFatigue, positive: false,
      oneLiner: (sc) => sc >= 60
        ? "관계에서 늘 더 많이 책임지느라 쉽게 지쳐온 구조가 보여요."
        : "관계 에너지는 비교적 안정적인 편이에요.",
    },
    {
      key: "repetitionRisk", label: "반복 위험도", score: repetitionRisk, positive: false,
      oneLiner: (sc) => sc >= 60
        ? "비슷한 선택·관계가 반복되기 쉬운 흐름이에요. 패턴을 알면 끊을 수 있어요."
        : "같은 패턴에 갇히기보다 빠져나오는 힘이 있는 편이에요.",
    },
    {
      key: "transitionReady", label: "전환 준비도", score: transitionReady, positive: true,
      oneLiner: (sc) => sc >= 60
        ? "변화를 현실로 옮길 추진력이 차오르는 시기예요."
        : "아직은 준비를 다지는 구간. 무리한 전환보다 한 걸음씩이 맞아요.",
    },
    {
      key: "moneyLeak", label: "돈 누수 감도", score: moneyLeak, positive: false,
      oneLiner: (sc) => sc >= 60
        ? "벌어도 새어나가기 쉬운 구조예요. 어디서 빠지는지 알면 막을 수 있어요."
        : "돈을 지키는 힘은 비교적 안정적인 편이에요.",
    },
    {
      key: "resilience", label: "회복 탄력성", score: resilience, positive: true,
      oneLiner: (sc) => sc >= 60
        ? "넘어져도 다시 일어서는 회복의 뿌리가 단단해요."
        : "회복에 시간이 걸리는 편이라, 재충전 루틴이 특히 중요해요.",
    },
  ];

  return defs.map((d) => ({
    key: d.key,
    label: d.label,
    score: d.score,
    band: band(d.score),
    oneLiner: d.oneLiner(d.score),
    positive: d.positive,
  }));
}
