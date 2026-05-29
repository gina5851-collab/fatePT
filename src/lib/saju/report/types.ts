// =====================================================
// 운명PT 리포트 — 내부 표준 데이터 타입
// =====================================================
// luckyloveme(운세위키) API 응답을 이 표준형으로 정리(adapter)한 뒤,
// 지표 계산(metrics) → 리포트 조립(report)에 사용한다.
// 원본 점술 데이터를 "오래 버틴 사람의 반복 패턴" 관점으로 변환하기 위한 중간 표준.

export type Ohaeng = "목" | "화" | "토" | "금" | "수";
export type SipseongCategory = "비겁성" | "식상성" | "재성" | "관성" | "인성";

export type NormalizedPillar = {
  position: "year" | "month" | "day" | "hour";
  label: string; // 년주/월주/일주/시주
  gan: string; // 한글 천간
  ji: string; // 한글 지지
  ganHanja?: string;
  jiHanja?: string;
  ganOhaeng?: Ohaeng | null;
  jiOhaeng?: Ohaeng | null;
  isDayMaster: boolean;
};

export type HapChungLite = {
  type: string; // 합/충/형/해/파/원진/삼합...
  source: string;
  target: string;
  meaning?: string;
};

export type SinsalLite = {
  name: string;
  position?: string;
  ji?: string;
};

// luckyloveme 응답 → 이 표준형으로 정리
export type NormalizedSaju = {
  // 사주팔자 (시주는 없을 수 있음)
  pillars: NormalizedPillar[];
  dayGan: string | null; // 일간

  // 오행 분포 (천간+지지 8글자 카운트)
  ohaengCount: Record<Ohaeng, number>;
  ohaengDominant: Ohaeng | null; // 가장 많은 오행
  ohaengMissing: Ohaeng[]; // 0개인 오행

  // 십성 분포
  sipseongCount: Record<SipseongCategory, number>;
  sipseongDominant: SipseongCategory | null;

  // 신강/신약 (1 태약 ~ 7 태왕)
  sinStrengthLevel: number | null; // 1-7
  sinStrengthLabel: string | null; // "신강" 등
  isStrong: boolean | null;

  // 대운/세운/월운 (요약만)
  daeun: { currentLabel: string | null; currentSipseong: string | null; direction: string | null };
  seun: { currentYear: number | null; currentLabel: string | null; currentSipseong: string | null };
  weolun: { currentLabel: string | null };

  // 합충 (개수 + 목록)
  hapchung: HapChungLite[];
  chungCount: number; // 충+형+파+해+원진 (불안정 신호)
  hapCount: number; // 합 (얽힘 신호)

  // 신살 (12신살 + 도화/홍염/화개 통합)
  sinsals: SinsalLite[];
  hasDohwa: boolean;
  hasHwagae: boolean;
  hasHongyeom: boolean;
  hasYeokma: boolean; // 역마 (이동성/전환)
  hasGwimun: boolean; // 귀문관살 (감정·직관 민감)

  // 귀인 (조력 신호)
  guiinCount: number;

  // 격국/용신
  gyeokgukName: string | null;
  yongsinOhaeng: Ohaeng | null; // 보강하면 좋은 오행
  gisinOhaeng: Ohaeng | null; // 과하면 부담되는 오행

  // 비겁(비견/겁재) 디테일 — 버팀력·관계 피로 계산용
  bigyeonCount: number;
  geobjaeCount: number;

  // ── GPT 검증 반영: 파생 신호 ──
  sipseongConcentrated: boolean;   // 십성 편중 (한 분류가 전체의 절반 이상)
  daeunTransition: boolean;        // 대운 교체기 (현재 대운 진입/마감 ±1년 또는 충/합)
  seunChangePressure: boolean;     // 세운이 원국과 충돌(충/형/파)
  jaeChung: boolean;               // 재성이 충을 받음 (돈 누수 신호)
  daeunSeunGeobjae: boolean;       // 대운/세운 천간이 비겁(겁재 흐름)
  inYongsinFlow: boolean;          // 현재 대운이 용신/희신 오행 (회복 흐름)

  // 원본 보존 (LLM 프롬프트 풀명식 텍스트 등에 활용)
  hasTimePillar: boolean;
};

// 운명PT 8대 지표
export type MetricKey =
  | "endurance"        // 버팀력
  | "selfProtection"   // 자기보호력
  | "emotionSensing"   // 감정 감지력
  | "relationFatigue"  // 관계 피로도
  | "repetitionRisk"   // 반복 위험도
  | "transitionReady"  // 전환 준비도
  | "moneyLeak"        // 돈 누수 감도
  | "resilience";      // 회복 탄력성

export type Metric = {
  key: MetricKey;
  label: string;      // 내부/기존 라벨
  display: string;    // 결과 카드 노출용 부드러운 이름 (GPT 검증 반영)
  score: number; // 0-100
  band: "낮음" | "보통" | "높음" | "매우 높음";
  // 고객 언어 한 줄 (불안 자극 X, 해석 톤). 무료 미리보기에도 노출 가능.
  oneLiner: string;
  positive: boolean; // 높을수록 좋은 지표인지(회복탄력성 등) vs 주의 지표(반복위험 등)
};

// 리포트 항목 (무료 2 + 잠금 21 = 23)
export type ReportItemCategory = "나" | "관계" | "돈·일" | "흐름" | "회복";

export type ReportItem = {
  id: string;
  category: ReportItemCategory;
  title: string;
  // 미리보기용 한 줄 티저 (잠금 항목도 제목+티저는 노출, 본문만 잠금)
  teaser: string;
  free: boolean;
};

export type CtaCopy = {
  primary: string;
  secondary: string;
  tertiary: string;
};

export type DunmyeongReport = {
  saju: NormalizedSaju;
  metrics: Metric[];
  items: ReportItem[];
  freeCount: number;
  lockedCount: number;
  cta: CtaCopy;
};
