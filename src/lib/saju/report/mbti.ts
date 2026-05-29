// =====================================================
// MBTI — 사회적 가면 해석 + 사주 본성과의 대조
// =====================================================
// 천기문 핵심 프레임: MBTI=사회적 가면, 사주=숨겨진 본성.
// 일치하면 강점 극대화, 충돌하면 피로·반복 패턴.

export type MbtiType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP"
  | "UNKNOWN";

export const MBTI_LIST: MbtiType[] = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

export function isMbti(v: string | null | undefined): v is MbtiType {
  return !!v && (MBTI_LIST as string[]).includes(v);
}

// 축별 한 줄 (가면의 특징 + 숨은 피로 지점)
const AXIS_LINE: Record<string, string> = {
  E: "관계 안에서 에너지를 얻지만, 남의 흐름에 쉽게 끌려갈 수 있어요.",
  I: "혼자 정리하는 힘은 강하지만, 도움 요청이 늦어질 수 있어요.",
  S: "현실 감각은 강하지만, 반복되는 감정 패턴을 늦게 알아차릴 수 있어요.",
  N: "가능성을 크게 보지만, 현실의 작은 신호를 놓칠 수 있어요.",
  T: "겉으로는 이성적이고 단단해 보이지만, 감정을 늦게 알아차려 한 번에 무너질 수 있어요.",
  F: "겉으로는 다정하고 맞춰주지만, 속에는 쉽게 양보하지 않는 기준과 오래 쌓인 피로가 있어요.",
  J: "계획과 통제는 강하지만, 예상 밖의 흐름 앞에서 피로가 커질 수 있어요.",
  P: "흐름을 잘 타지만, 결정이 늦어져 같은 선택을 반복할 수 있어요.",
};

export type MbtiReading = {
  mask: string;     // 사회적 가면(겉모습) 한 줄
  axisLines: string[]; // 4축 해석
  known: boolean;
};

// MBTI별 '사회적 가면' 한 줄
const MASK_BY_TYPE: Partial<Record<MbtiType, string>> = {
  INTJ: "혼자 판단하고, 기준이 높고, 쉽게 기대지 않는 사람",
  INTP: "끊임없이 분석하고, 거리를 두고 관찰하는 사람",
  ENTJ: "앞장서서 끌고 가고, 효율로 증명하려는 사람",
  ENTP: "아이디어로 판을 흔들고, 논쟁을 즐기는 사람",
  INFJ: "조용히 깊게 이해하고, 의미를 좇는 사람",
  INFP: "자기 가치에 충실하고, 속을 잘 안 보이는 사람",
  ENFJ: "사람을 챙기고, 분위기를 끌어올리는 사람",
  ENFP: "가능성에 설레고, 사람에게 열려 있는 사람",
  ISTJ: "원칙을 지키고, 끝까지 책임지는 사람",
  ISFJ: "묵묵히 돌보고, 티 안 내고 감당하는 사람",
  ESTJ: "체계를 세우고, 결과로 말하는 사람",
  ESFJ: "관계를 살피고, 도움을 먼저 주는 사람",
  ISTP: "필요할 때 움직이고, 군더더기 없는 사람",
  ISFP: "조용히 자기 감각대로 사는 사람",
  ESTP: "현장에서 빠르게 판단하고 움직이는 사람",
  ESFP: "지금 이 순간을 살리는, 분위기 메이커",
};

export function readMbti(mbti: MbtiType): MbtiReading {
  if (mbti === "UNKNOWN") {
    return {
      mask: "아직 MBTI를 고르지 않으셨어요. 사주 본성 위주로 읽어드려요.",
      axisLines: [],
      known: false,
    };
  }
  const axes = mbti.split("");
  return {
    mask: MASK_BY_TYPE[mbti] ?? "자기만의 방식이 뚜렷한 사람",
    axisLines: axes.map((a) => AXIS_LINE[a]).filter(Boolean),
    known: true,
  };
}
