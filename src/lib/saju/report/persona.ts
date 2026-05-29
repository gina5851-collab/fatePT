// =====================================================
// 개인 타입명 생성 — 사주 신호 + MBTI 결합 (랜덤 금지)
// =====================================================
import type { NormalizedSaju } from "./types";
import type { MbtiType } from "./mbti";

export type PersonaProfile = {
  typeName: string;
  subtitle: string;
  oneLiner: string;
  keywords: string[];
  basis: string[]; // 근거(명식 신호) — 신뢰감용
};

// 우선순위 규칙(위에서부터 먼저 매칭). 결정론적.
export function buildPersona(s: NormalizedSaju, mbti: MbtiType): PersonaProfile {
  const bigyeop = s.sipseongCount.비겁성;
  const siksang = s.sipseongCount.식상성;
  const jae = s.sipseongCount.재성;
  const gwan = s.sipseongCount.관성;
  const inseong = s.sipseongCount.인성;
  const strong = s.isStrong === true;
  const isF = mbti !== "UNKNOWN" && mbti.includes("F");
  const isNT = mbti === "INTJ" || mbti === "ENTJ";

  const basis: string[] = [];
  if (s.sinStrengthLabel) basis.push(`신강약: ${s.sinStrengthLabel}`);
  if (s.dayGan) basis.push(`일간 ${s.dayGan}`);
  if (s.sipseongDominant) basis.push(`${s.sipseongDominant} 우세`);
  if (s.ohaengDominant) basis.push(`오행 ${s.ohaengDominant} 강`);
  if (s.ohaengMissing.length) basis.push(`${s.ohaengMissing.join("·")} 결핍`);
  if (mbti !== "UNKNOWN") basis.push(`MBTI ${mbti}`);

  type Rule = { when: boolean; typeName: string; subtitle: string; oneLiner: string; keywords: string[] };
  const rules: Rule[] = [
    {
      when: strong && isNT,
      typeName: "단단한 전략가형",
      subtitle: "혼자 버티는 힘은 강하지만, 위임이 늦어지는 사람",
      oneLiner: "다 감당하려다 혼자 지쳐온, 기준 높은 전략가예요.",
      keywords: ["#독립", "#전략", "#위임이숙제"],
    },
    {
      when: isF && bigyeop >= 3,
      typeName: "다정하지만 쉽게 꺾이지 않는 사람",
      subtitle: "맞춰주는 듯 보여도 자기 기준이 강한 구조",
      oneLiner: "겉은 부드러운데 속은 단단해서, 양보 끝에 혼자 지쳐요.",
      keywords: ["#겉다정", "#속단단", "#기준강함"],
    },
    {
      when: bigyeop >= 3 && gwan <= 1,
      typeName: "오래 버틴 독립형",
      subtitle: "누구의 통제보다 자기 기준으로 버틴 사람",
      oneLiner: "남 기준에 맞추기보다, 내 방식으로 버텨온 사람이에요.",
      keywords: ["#독립", "#자기기준", "#오래버팀"],
    },
    {
      when: inseong >= 2 && siksang === 0,
      typeName: "생각이 깊어 멈추는 사람",
      subtitle: "많이 이해하지만 표현이 늦어지는 구조",
      oneLiner: "머릿속 정리는 끝났는데, 시작이 자꾸 늦어져요.",
      keywords: ["#생각많음", "#표현지연", "#신중"],
    },
    {
      when: jae <= 1 && bigyeop >= 2,
      typeName: "돈이 머물기 어려운 확장형",
      subtitle: "벌어도 주변과 책임으로 새기 쉬운 흐름",
      oneLiner: "버는 힘은 있는데, 남는 구조를 아직 못 만든 거예요.",
      keywords: ["#확장", "#돈누수", "#책임과다"],
    },
    {
      when: siksang >= 2 && jae >= 1,
      typeName: "움직이면 풀리는 실행형",
      subtitle: "표현과 행동이 돈의 흐름을 여는 사람",
      oneLiner: "가만히 있을 때보다, 움직일 때 길이 열려요.",
      keywords: ["#실행", "#표현", "#흐름개방"],
    },
    {
      when: gwan >= 2,
      typeName: "기준 속에서 인정받는 사람",
      subtitle: "책임과 역할 안에서 빛나는 구조",
      oneLiner: "맡은 자리에서 인정받을 때 가장 단단해져요.",
      keywords: ["#책임", "#역할", "#인정"],
    },
  ];

  const matched = rules.find((r) => r.when);
  if (matched) {
    return { typeName: matched.typeName, subtitle: matched.subtitle, oneLiner: matched.oneLiner, keywords: matched.keywords, basis };
  }
  // 폴백
  return {
    typeName: "오래 버틴 사람",
    subtitle: "자신을 지키기 위해 반복 패턴을 만든 사람",
    oneLiner: "부족해서가 아니라, 오래 버티며 단단해진 사람이에요.",
    keywords: ["#오래버팀", "#자기보호", "#반복패턴"],
    basis,
  };
}
