// =====================================================
// 스토어프런트 카탈로그 — 프런트 상품 진열의 단일 소스
// =====================================================
// - 프런트(메인/목록/상세)에 노출되는 상품·카피·FAQ·결과예시는 전부 여기서 관리한다.
// - 결제 금액의 원천은 지금까지처럼 운영 DB(products.price)다.
//   priceHint 는 표시용 참고값이며, 렌더 시 DB 가격이 조회되면 DB 값을 우선한다.
// - isPublished=false 상품은 프런트에 노출하지 않는다 (DB is_active 와 별개의 프런트 스위치).
// - 결제/주문/결과 생성 코드는 이 파일을 참조하지 않는다 (표시 전용).

export type ServiceType = "saju" | "tarot";

/** 고민별 탐색 태그 — /products?tab= 필터와 헤더 카테고리가 사용 */
export type ConcernTag = "self" | "love" | "reunion" | "money" | "daily";

export const CONCERN_LABEL: Record<ConcernTag, string> = {
  self: "자기이해·종합",
  love: "연애·궁합",
  reunion: "재회",
  money: "돈·직장",
  daily: "오늘의 운세",
};

/** 결과 예시 블록 — SampleViewer 가 렌더링 (외부 이미지 없이 자체 렌더) */
export type SampleBlock =
  | {
      kind: "saju";
      title: string;
      oneLiner: string;
      sections: { label: string; text: string }[];
      actions: string[];
    }
  | {
      kind: "tarot";
      title: string;
      question: string;
      cards: { position: string; card: string; meaning: string }[];
      summary: string;
      action: string;
    };

export type CatalogProduct = {
  slug: string; // DB products.slug 와 1:1
  serviceType: ServiceType;
  concerns: ConcernTag[];
  displayName: string; // 프런트 표시명 (DB name 을 덮어씀 — DB 는 변경하지 않는다)
  shortDescription: string; // 카드 한 줄 문구
  headline: string; // 상세 헤드라인 (질문형 훅)
  empathy: string[]; // 고민 공감 문장들
  questions: string[]; // 이 상품이 답하는 질문
  forWhom: string[]; // 이런 사람에게 필요
  resultToc: string[]; // 결과 전체 목차
  sample: SampleBlock; // 결과 예시
  process: string[]; // 신청 과정
  methodNote: string; // 분석/리딩 방식 설명
  delivery: { mode: "auto" | "review"; timeText: string };
  priceHint: number; // 표시용 참고가 — DB 가격이 있으면 DB 우선
  originalPrice?: number;
  badge?: string;
  faq: { q: string; a: string }[];
  caution: string; // 환불·주의 안내 (환불정책 링크는 템플릿에서 공통 노출)
  related: string[]; // 연관 상품 slug
  isPublished: boolean;
  displayOrder: number;
};

// ── 공통 FAQ 조각 ──
const FAQ_TIME_UNKNOWN = {
  q: "태어난 시간을 모르면 어떻게 되나요?",
  a: "시간을 몰라도 신청할 수 있어요. 연·월·일 세 기둥만으로 분석하며, 시간이 있으면 더 정밀해집니다. 입력 폼에서 '시 모름'을 선택하면 됩니다.",
};
const FAQ_REVIEW_LINK = {
  q: "결과를 나중에 다시 볼 수 있나요?",
  a: "네. 결과 페이지 링크가 발급되며, 로그인 상태로 결제하셨다면 마이페이지에서도 언제든 다시 열어볼 수 있어요.",
};
const FAQ_REFUND = {
  q: "환불은 어떻게 되나요?",
  a: "결과가 발행되기 전에는 전액 환불이 가능합니다. 디지털 콘텐츠 특성상 결과 열람 이후에는 환불이 제한될 수 있어요. 자세한 기준은 하단 환불정책에서 확인해 주세요.",
};
const FAQ_NOT_PROPHECY = {
  q: "미래를 확정해서 알려주는 건가요?",
  a: "아니요. 운명PT는 단정적인 예언 대신, 반복되는 패턴과 흐름을 읽고 지금 할 수 있는 선택을 정리해 드리는 서비스예요. 결과는 판단을 돕는 참고 자료입니다.",
};
const FAQ_TAROT_QUESTION = {
  q: "질문을 꼭 적어야 하나요?",
  a: "선택 사항이에요. 다만 상황을 한두 줄이라도 적어주시면 카드 해석이 훨씬 구체적으로 나옵니다.",
};
const FAQ_TAROT_REVIEW = {
  q: "'검수 후 발행'이 무슨 뜻인가요?",
  a: "자동으로 나온 초안을 그대로 내보내지 않고, 발행 전에 사람이 내용을 확인하고 다듬은 뒤 보내드린다는 뜻이에요. 그만큼 시간이 걸리지만(보통 24시간 이내) 더 정돈된 결과를 받으실 수 있어요.",
};

// ── 카탈로그 본문 ──
export const CATALOG: CatalogProduct[] = [
  // ─────────────────────────────────────────────
  // 1. 무료 운명 맛보기
  // ─────────────────────────────────────────────
  {
    slug: "free-taste",
    serviceType: "saju",
    concerns: ["self"],
    displayName: "무료 운명 맛보기",
    shortDescription: "1분 무료 — 내 반복 패턴의 큰 그림부터",
    headline: "내가 자꾸 막히는 지점, 1분이면 보입니다",
    empathy: [
      "열심히 사는데도 같은 자리에서 자꾸 막히는 기분이 들 때가 있어요.",
      "그건 당신이 부족해서가 아니라, 아직 내 패턴을 확인해 본 적이 없기 때문일 수 있어요.",
    ],
    questions: [
      "나는 타고나길 어떤 기질의 사람인가?",
      "요즘 흐름에서 내가 붙잡아야 할 건 뭘까?",
      "더 깊게 본다면 어디부터 봐야 할까?",
    ],
    forWhom: [
      "사주를 제대로 본 적이 없어서 가볍게 시작하고 싶은 분",
      "결제 전에 결과 스타일을 먼저 확인하고 싶은 분",
    ],
    resultToc: ["내 기질 한 줄 진단", "오늘의 흐름 한두 가지", "잠긴 전체 패턴 미리보기", "다음 단계 추천"],
    sample: {
      kind: "saju",
      title: "무료 결과 예시",
      oneLiner: "“버티는 힘은 강한데, 시작 타이밍을 미루는 패턴이 있어요.”",
      sections: [
        { label: "기질", text: "신중하게 재고 움직이는 유형. 대신 기회 앞에서 반 박자 늦는 경향." },
        { label: "오늘의 흐름", text: "미뤄둔 연락·결정을 처리하기 좋은 날. 큰 지출은 하루 보류." },
      ],
      actions: ["잠긴 21개 항목은 전체 사주 리포트에서 열립니다"],
    },
    process: ["생년월일 입력 (1분)", "무료 결과 즉시 확인", "마음에 들면 전체 리포트로 해금"],
    methodNote: "생년월일로 사주 명식을 계산하고, 운명PT 리포트 엔진이 핵심 요약만 무료로 보여드립니다.",
    delivery: { mode: "auto", timeText: "바로 확인 · 하루 1회" },
    priceHint: 0,
    badge: "무료",
    faq: [
      { q: "정말 무료인가요?", a: "네, 하루 1회 완전 무료입니다. 카드 등록도 필요 없어요." },
      { q: "로그인해야 하나요?", a: "아니요, 무료 진단은 로그인 없이 바로 받을 수 있어요." },
      FAQ_TIME_UNKNOWN,
      FAQ_NOT_PROPHECY,
    ],
    caution: "맛보기용 짧은 진단입니다. 더 정밀한 분석은 유료 리포트에서 제공됩니다.",
    related: ["premium-saju", "inbody", "tarot-daily"],
    isPublished: true,
    displayOrder: 5,
  },

  // ─────────────────────────────────────────────
  // 2. 운명 인바디
  // ─────────────────────────────────────────────
  {
    slug: "inbody",
    serviceType: "saju",
    concerns: ["self"],
    displayName: "운명 인바디",
    shortDescription: "타고난 기질·강점·약점을 한 장으로 측정",
    headline: "왜 나는 자꾸 같은 선택을 반복할까?",
    empathy: [
      "헬스를 시작하기 전 인바디부터 재듯, 인생도 내 '운명 체성분'을 알아야 단련이 시작돼요.",
      "커피 한 잔 값으로 내 패턴의 기본 골격을 먼저 확인해 보세요.",
    ],
    questions: [
      "나는 타고나길 뭐가 강하고 뭐가 약한 사람인가?",
      "왜 매번 비슷한 지점에서 힘들어질까?",
      "오늘부터 뭘 바꾸면 흐름이 달라질까?",
    ],
    forWhom: [
      "본격적인 사주 리포트 전에 기본 진단부터 받고 싶은 분",
      "나에 대한 설명을 한 장으로 정리해 두고 싶은 분",
    ],
    resultToc: ["한 줄 진단", "운명 명식 (년·월·일·시 4기둥)", "운명 체성분 (기질)", "타고난 강점 근육", "보완 포인트", "오늘의 루틴 처방 3가지"],
    sample: {
      kind: "saju",
      title: "리포트 예시 (익명)",
      oneLiner: "“밀어붙이는 힘보다 버티는 힘이 강한 지구력형.”",
      sections: [
        { label: "강점 근육", text: "한 번 잡은 일을 끝까지 끌고 가는 지속력. 신뢰를 쌓는 속도는 느리지만 단단함." },
        { label: "보완 포인트", text: "시작 결정이 늦어 기회비용이 생기는 편. '80%면 시작'을 기준으로 잡아볼 것." },
      ],
      actions: ["이번 주: 미뤄둔 결정 1개를 수요일 전에 확정하기"],
    },
    process: ["생년월일·성별 입력", "결제 (카드/무통장)", "리포트 바로 확인"],
    methodNote: "만세력 기반으로 사주 명식을 계산하고, AI가 운명PT 관점(패턴·강점·보완·행동)으로 해석해 리포트를 만듭니다.",
    delivery: { mode: "auto", timeText: "결제 후 바로 확인" },
    priceHint: 4900,
    faq: [
      FAQ_TIME_UNKNOWN,
      { q: "무료 맛보기와 뭐가 다른가요?", a: "무료는 핵심 요약 한두 가지만 보여드려요. 운명 인바디는 기질·강점·보완·루틴까지 진단 리포트 형태로 정리해 드립니다." },
      FAQ_REVIEW_LINK,
      FAQ_REFUND,
      FAQ_NOT_PROPHECY,
    ],
    caution: "운명을 예언하는 것이 아니라, 단련의 출발점을 진단하는 입문 측정입니다.",
    related: ["premium-saju", "crush-kit", "tarot-daily"],
    isPublished: true,
    displayOrder: 10,
  },

  // ─────────────────────────────────────────────
  // 3. 전체 사주 리포트 (DB slug: premium-saju — 표시명만 재정의)
  // ─────────────────────────────────────────────
  {
    slug: "premium-saju",
    serviceType: "saju",
    concerns: ["self", "money"],
    displayName: "전체 사주 리포트",
    shortDescription: "관계·돈·일·감정 — 잠긴 패턴 전부 해금",
    headline: "잠긴 내 패턴 전부, 한 번에 열어봅니다",
    empathy: [
      "무료 결과에서 본 건 요약 두 가지뿐이에요. 진짜 궁금한 건 그 뒤에 있죠.",
      "관계에서 반복되는 자세, 돈이 새는 지점, 일에서 막히는 타이밍, 감정이 무너지는 순간 — 전부 하나의 패턴으로 이어져 있어요.",
    ],
    questions: [
      "나는 관계·돈·일·감정에서 각각 어떤 패턴을 반복하고 있나?",
      "올해 흐름에서 밀어붙일 때와 멈출 때는 언제인가?",
      "지금 내 상황에서 가장 먼저 고칠 것 하나는 뭔가?",
    ],
    forWhom: [
      "무료 맛보기에서 잠긴 항목이 궁금했던 분",
      "관계·돈·일을 따로가 아니라 한 번에 정리하고 싶은 분",
      "막연한 불안을 구체적인 체크리스트로 바꾸고 싶은 분",
    ],
    resultToc: [
      "한 줄 진단 + 운명 명식",
      "종합 기질 심층 (성향·에너지 지표)",
      "관계 패턴 — 끌리는 사람, 지치는 지점",
      "돈 패턴 — 들어오는 길, 새는 길",
      "일·커리어 패턴 — 강점이 먹히는 환경",
      "감정 리듬 — 무너지기 쉬운 순간과 회복법",
      "올해 흐름 — 밀 때와 멈출 때",
      "행동 루틴 처방",
      "… 무료 결과에서 잠겨 있던 분석 전부",
    ],
    sample: {
      kind: "saju",
      title: "리포트 예시 (익명)",
      oneLiner: "“관계와 돈이 같은 패턴으로 움직이는 유형 — 거절을 미루다 손해를 봅니다.”",
      sections: [
        { label: "관계 패턴", text: "먼저 맞춰주다 뒤늦게 서운함이 터지는 구조. 관계 초반 3주의 기준 설정이 관건." },
        { label: "돈 패턴", text: "큰 지출보다 '거절 못한 소비'가 누수의 핵심. 매월 고정 상한을 정하면 방어력이 크게 올라감." },
        { label: "올해 흐름", text: "상반기는 정리·학습, 하반기부터 확장에 유리한 리듬." },
      ],
      actions: ["이번 달: 반복 지출 3개 해지", "관계: 부탁 받으면 '하루 뒤 답변' 원칙"],
    },
    process: ["생년월일·성별·고민 입력", "결제 (카드/무통장)", "전체 리포트 바로 확인"],
    methodNote: "만세력 기반 명식 계산 + AI 해석으로, 무료 결과에서 잠겨 있던 전체 분석을 한 번에 발행합니다. 결과 페이지는 영구 링크로 소장됩니다.",
    delivery: { mode: "auto", timeText: "결제 후 바로 확인" },
    priceHint: 34900,
    badge: "BEST",
    faq: [
      { q: "무료 결과의 잠긴 항목과 같은 내용인가요?", a: "네. 무료 결과에서 블러 처리돼 있던 분석 항목 전체가 이 리포트에서 열립니다. 무료 결과 없이 바로 구매하셔도 동일한 전체 리포트를 받아요." },
      FAQ_TIME_UNKNOWN,
      { q: "분량이 어느 정도인가요?", a: "요약 카드 + 영역별(관계·돈·일·감정) 분석 + 올해 흐름 + 행동 처방으로 구성된 긴 리포트입니다. 스크롤로 천천히 읽는 분량이며 링크로 언제든 다시 볼 수 있어요." },
      FAQ_REVIEW_LINK,
      FAQ_REFUND,
      FAQ_NOT_PROPHECY,
    ],
    caution: "결과는 결정을 대신하지 않습니다. 반복 패턴을 읽고 선택을 돕는 참고 자료로 활용해 주세요.",
    related: ["reunion-check", "crush-kit", "inbody"],
    isPublished: true,
    displayOrder: 15,
  },

  // ─────────────────────────────────────────────
  // 4. 짝사랑 키트
  // ─────────────────────────────────────────────
  {
    slug: "crush-kit",
    serviceType: "saju",
    concerns: ["love"],
    displayName: "짝사랑 키트",
    shortDescription: "다가가도 될 신호인지, 타이밍부터 진단",
    headline: "그 사람한테, 다가가도 될까?",
    empathy: [
      "좋아하는 마음은 커지는데 상대의 마음은 깜깜할 때, 혼자 시나리오만 수십 번 돌리게 되죠.",
      "고백할까, 기다릴까 — 감으로 정하기 전에 내 짝사랑의 현재 좌표부터 확인하세요.",
    ],
    questions: [
      "그 사람은 지금 나를 어떻게 보고 있을까?",
      "다가가도 되는 신호일까, 아직일까?",
      "움직인다면 언제, 어떤 방식이 좋을까?",
    ],
    forWhom: [
      "고백 타이밍을 재고 있는 분",
      "티를 내야 할지 숨겨야 할지 헷갈리는 분",
      "혼자 앓는 시간을 끝내고 싶은 분",
    ],
    resultToc: ["한 줄 진단", "운명 명식", "그 사람의 지금 마음 상태", "그 사람이 나를 보는 시선", "다가가도 될 신호 / 아직일 신호", "고백·접근 타이밍", "짝사랑 성공 루틴"],
    sample: {
      kind: "saju",
      title: "리포트 예시 (익명)",
      oneLiner: "“호감은 있으나 확신이 없는 상태 — 지금은 '고백'보다 '접점 늘리기' 구간.”",
      sections: [
        { label: "다가가도 될 신호", text: "먼저 연락이 오는 빈도가 유지되는 것 자체가 긍정 신호. 단, 큰 고백은 아직 부담." },
        { label: "타이밍", text: "이번 달은 가벼운 1:1 접점을 만들고, 다음 달 흐름에서 마음을 표현하는 편이 유리." },
      ],
      actions: ["이번 주: 부담 없는 공통 관심사로 대화 1회 만들기"],
    },
    process: ["내 생년월일·고민 입력", "결제 (카드/무통장)", "리포트 바로 확인"],
    methodNote: "내 명식을 기준으로 관계 패턴과 타이밍 흐름을 읽습니다. 상대를 단정하는 게 아니라, 내가 어떻게 다가갈지 방향을 잡는 데 초점을 둡니다.",
    delivery: { mode: "auto", timeText: "결제 후 바로 확인" },
    priceHint: 14900,
    faq: [
      { q: "상대방 정보가 없어도 되나요?", a: "네. 기본 분석은 내 명식을 중심으로 진행됩니다. 고민 입력란에 상황을 적어주시면 해석에 반영돼요." },
      { q: "성공 확률을 알려주나요?", a: "확률 수치로 단정하지 않아요. 대신 지금이 다가갈 구간인지, 기다릴 구간인지와 그 이유·행동 방법을 정리해 드립니다." },
      FAQ_TIME_UNKNOWN,
      FAQ_REFUND,
      FAQ_REVIEW_LINK,
    ],
    caution: "상대의 마음을 단정하거나 성공을 보장하지 않습니다. 접근 방향을 잡는 참고 자료입니다.",
    related: ["tarot-inner-mind", "premium-saju", "reunion-check"],
    isPublished: true,
    displayOrder: 20,
  },

  // ─────────────────────────────────────────────
  // 5. 재회 가능성 리포트
  // ─────────────────────────────────────────────
  {
    slug: "reunion-check",
    serviceType: "saju",
    concerns: ["reunion", "love"],
    displayName: "재회 가능성 리포트",
    shortDescription: "연락 버튼 누르기 전에, 좌표부터 확인",
    headline: "우리, 다시 될 수 있을까?",
    empathy: [
      "'지금 연락해도 될까'가 하루에도 몇 번씩 떠오른다면, 이미 감정만으로 움직이기 직전이라는 뜻이에요.",
      "감으로 연락하기 전에, 지금 관계의 상태와 움직이기 좋은 타이밍부터 확인하세요.",
    ],
    questions: [
      "그 사람과 다시 이어질 가능성이 있는 흐름인가?",
      "상대의 마음은 지금 어느 단계에 있을까?",
      "연락한다면 언제, 지금 하지 말아야 할 행동은 뭔가?",
    ],
    forWhom: [
      "이별 후 재회를 진지하게 고민 중인 분",
      "연락 타이밍을 감으로 정하고 싶지 않은 분",
      "매달리기 전에 상황을 객관적으로 보고 싶은 분",
    ],
    resultToc: ["한 줄 진단", "운명 명식", "지금 우리 관계 상태", "재회 가능성 분석", "상대의 마음 변화 흐름", "다가가기 좋은 타이밍", "지금 할 수 있는 행동 / 피할 행동"],
    sample: {
      kind: "saju",
      title: "리포트 예시 (익명)",
      oneLiner: "“끊긴 게 아니라 식은 상태 — 재점화 여지는 있으나 지금 연락은 역효과 구간.”",
      sections: [
        { label: "관계 상태", text: "상대는 정리보다 회피에 가까운 상태. 감정이 남아 있어 침묵이 길수록 오히려 환기됨." },
        { label: "타이밍", text: "최소 3주는 접점 없이 내 리듬 회복에 집중. 다음 달 중순 이후 가벼운 안부가 안전." },
      ],
      actions: ["금지: 취한 밤의 장문 메시지", "지금 할 것: 끊었던 운동·일상 루틴 복구"],
    },
    process: ["내 생년월일·상황 입력", "결제 (카드/무통장)", "리포트 바로 확인"],
    methodNote: "내 명식과 현재 흐름을 기준으로 관계의 리듬을 읽습니다. 재회를 보장하는 게 아니라, 가능성과 타이밍·행동 기준을 정리해 드립니다.",
    delivery: { mode: "auto", timeText: "결제 후 바로 확인" },
    priceHint: 39000,
    faq: [
      { q: "재회 가능성을 %로 알려주나요?", a: "수치로 단정하지 않습니다. 대신 지금 관계가 어떤 상태인지, 흐름상 여지가 있는지, 언제 어떻게 움직이는 게 안전한지를 구체적으로 정리해 드려요." },
      { q: "이미 연락을 해버렸는데 의미가 있나요?", a: "네. 현재 상태 기준으로 다음 행동을 다시 설계하는 것이 이 리포트의 목적이에요. 상황을 고민 입력란에 적어주세요." },
      FAQ_TIME_UNKNOWN,
      FAQ_REFUND,
      FAQ_NOT_PROPHECY,
    ],
    caution: "재회를 보장하거나 상대의 마음을 단정하지 않습니다. 행동 전 점검용 리포트입니다.",
    related: ["tarot-relationship", "premium-saju", "crush-kit"],
    isPublished: true,
    displayOrder: 25,
  },

  // ─────────────────────────────────────────────
  // 6. 오늘의 타로 (1장)
  // ─────────────────────────────────────────────
  {
    slug: "tarot-daily",
    serviceType: "tarot",
    concerns: ["daily"],
    displayName: "오늘의 타로",
    shortDescription: "지금 나에게 필요한 한 장의 메시지",
    headline: "오늘, 나에게 필요한 한 마디",
    empathy: [
      "결정할 게 많은 날, 마음이 어수선한 날 — 긴 리포트까지는 필요 없고, 방향을 잡아줄 한 마디면 충분할 때가 있죠.",
    ],
    questions: [
      "오늘 하루, 어디에 힘을 주고 어디서 힘을 빼야 할까?",
      "지금 마음에 걸리는 그 일, 오늘 움직여도 될까?",
    ],
    forWhom: ["아침 루틴처럼 가볍게 하루 방향을 잡고 싶은 분", "타로를 처음 결제해 보는 분"],
    resultToc: ["오늘의 카드 1장", "카드가 짚는 오늘의 흐름", "오늘의 행동 메시지"],
    sample: {
      kind: "tarot",
      title: "결과 예시",
      question: "오늘 미뤄둔 결정을 처리해도 될까요?",
      cards: [
        { position: "오늘의 카드", card: "완드 에이스 (정방향)", meaning: "새로 시작하는 에너지가 살아나는 날. 미뤄둔 일의 첫 단추를 끼우기에 좋은 흐름." },
      ],
      summary: "오늘은 '완벽한 준비'보다 '작은 착수'가 유리한 날이에요. 크게 벌이기보다 첫 걸음 하나만.",
      action: "오늘 안에 그 일의 가장 작은 첫 단계 하나를 실행해 보세요.",
    },
    process: ["질문 입력 (선택)", "결제 990원", "카드 드로우 · 결과 바로 확인"],
    methodNote: "결제 즉시 카드가 드로우되고, 카드 의미와 질문 맥락을 반영한 해석이 자동 발행됩니다.",
    delivery: { mode: "auto", timeText: "결제 후 바로 확인" },
    priceHint: 990,
    badge: "입문",
    faq: [
      FAQ_TAROT_QUESTION,
      { q: "매일 뽑아도 되나요?", a: "네. 오늘의 타로는 하루의 흐름을 읽는 용도라 매일 새로 받아보셔도 좋아요." },
      { q: "결과는 어디서 보나요?", a: "결제 직후 결과 페이지로 이동하며, 전용 링크로 언제든 다시 볼 수 있어요. 로그인 상태라면 마이페이지에서도 확인됩니다." },
      FAQ_REFUND,
      FAQ_NOT_PROPHECY,
    ],
    caution: "타로는 확정된 미래가 아니라 지금 흐름을 비추는 거울입니다. 가벼운 마음으로 활용해 주세요.",
    related: ["tarot-inner-mind", "free-taste", "inbody"],
    isPublished: true,
    displayOrder: 110,
  },

  // ─────────────────────────────────────────────
  // 7. 그 사람의 속마음 (3장)
  // ─────────────────────────────────────────────
  {
    slug: "tarot-inner-mind",
    serviceType: "tarot",
    concerns: ["love"],
    displayName: "그 사람의 속마음",
    shortDescription: "3장으로 읽는 그 사람의 진짜 마음",
    headline: "그 사람, 지금 무슨 생각일까?",
    empathy: [
      "읽씹인지 바쁜 건지, 관심인지 예의인지 — 메시지 하나에 하루 종일 마음이 오르락내리락하죠.",
      "혼자 해석하다 지치기 전에, 카드 3장으로 지금 상황을 정리해 보세요.",
    ],
    questions: [
      "그 사람은 지금 나를 어떤 마음으로 보고 있을까?",
      "우리 사이, 지금 어떤 상황에 놓여 있을까?",
      "이대로 가면 흐름은 어디로 갈까?",
    ],
    forWhom: ["상대의 마음이 헷갈려 잠이 안 오는 분", "썸·연애 초반에 방향을 잡고 싶은 분"],
    resultToc: ["카드 3장 드로우 (현재 상황 · 상대의 속마음 · 앞으로의 흐름)", "자리별 카드 해석", "종합 리딩", "지금 할 수 있는 행동 메시지"],
    sample: {
      kind: "tarot",
      title: "결과 예시",
      question: "요즘 연락이 뜸해진 그 사람, 마음이 식은 걸까요?",
      cards: [
        { position: "현재 상황", card: "소드 4 (정방향)", meaning: "관계가 식었다기보다, 상대가 스스로를 재정비하는 휴지기." },
        { position: "상대의 속마음", card: "컵 2 (정방향)", meaning: "호감의 기반은 남아 있음. 표현이 줄었을 뿐 마음의 연결은 유지." },
        { position: "앞으로의 흐름", card: "펜타클 페이지 (역방향)", meaning: "서두르면 부담, 기다리며 신뢰를 쌓으면 회복되는 흐름." },
      ],
      summary: "식은 게 아니라 멈춰 서 있는 상태에 가까워요. 지금 필요한 건 확인 요구가 아니라 편안한 존재감입니다.",
      action: "답장을 재촉하기보다, 부담 없는 안부 한 번으로 연결만 유지해 보세요.",
    },
    process: ["질문·상황 입력 (선택)", "결제 (카드/무통장)", "카드 드로우", "검수 후 발행 — 보통 24시간 이내"],
    methodNote: "결제 시 카드가 드로우되고 해석 초안이 만들어집니다. 초안을 그대로 내보내지 않고 검수를 거쳐 정돈된 결과로 발행해 드려요.",
    delivery: { mode: "review", timeText: "검수 후 24시간 이내 발행" },
    priceHint: 2970,
    faq: [
      FAQ_TAROT_REVIEW,
      FAQ_TAROT_QUESTION,
      { q: "발행되면 어떻게 알 수 있나요?", a: "결제 직후 발급되는 결과 링크에서 상태를 확인할 수 있어요. 발행이 완료되면 같은 링크에서 전체 리딩이 열립니다." },
      FAQ_REFUND,
      FAQ_NOT_PROPHECY,
    ],
    caution: "상대의 마음을 단정하지 않습니다. 지금 상황을 정리하고 다음 행동을 잡는 참고 자료입니다.",
    related: ["crush-kit", "tarot-relationship", "tarot-daily"],
    isPublished: true,
    displayOrder: 120,
  },

  // ─────────────────────────────────────────────
  // 8. 우리 관계의 흐름 (5장)
  // ─────────────────────────────────────────────
  {
    slug: "tarot-relationship",
    serviceType: "tarot",
    concerns: ["love", "reunion"],
    displayName: "우리 관계의 흐름",
    shortDescription: "5장으로 보는 두 사람의 관계 흐름",
    headline: "우리 관계, 지금 어디로 가고 있을까?",
    empathy: [
      "나쁘지 않은데 어딘가 정체된 느낌, 좋다가도 반복되는 다툼 — 관계가 어디로 흐르는지 모른 채 감정만 소모될 때가 있어요.",
      "카드 5장으로 관계의 현재 좌표와 방향을 한 번에 펼쳐봅니다.",
    ],
    questions: [
      "우리 관계는 지금 어떤 상태에 있나?",
      "겉으로 안 보이는 걸림돌은 뭘까?",
      "가까운 미래의 흐름과, 지금 내가 할 수 있는 건?",
    ],
    forWhom: ["관계의 방향이 헷갈리는 커플·썸 단계의 분", "이별 후 관계의 흐름을 정리하고 싶은 분"],
    resultToc: ["카드 5장 드로우 (현재 관계 · 상대의 감정 · 숨은 장애물 · 가까운 미래 · 조언)", "자리별 카드 해석", "종합 리딩", "관계를 위한 행동 메시지"],
    sample: {
      kind: "tarot",
      title: "결과 예시",
      question: "권태기 같은 우리, 계속 가도 괜찮을까요?",
      cards: [
        { position: "현재 관계", card: "은둔자 (정방향)", meaning: "각자 생각이 깊어진 시기. 멀어짐이 아니라 정리의 구간." },
        { position: "상대의 감정", card: "컵 8 (역방향)", meaning: "떠나고 싶은 게 아니라, 관계가 나아지길 바라며 머무는 마음." },
        { position: "숨은 장애물", card: "소드 8 (정방향)", meaning: "'말해도 안 변할 것'이라는 서로의 체념이 진짜 걸림돌." },
        { position: "가까운 미래", card: "절제 (정방향)", meaning: "속도를 맞추면 회복되는 흐름. 급한 결론은 금물." },
        { position: "조언", card: "컵 에이스 (정방향)", meaning: "평가 없는 솔직한 감정 표현이 물꼬를 튼다." },
      ],
      summary: "끝나가는 관계가 아니라, 대화 방식이 멈춘 관계예요. 체념을 깨는 쪽이 흐름을 바꿉니다.",
      action: "이번 주, '요즘 우리'에 대한 판단 없는 대화 30분을 먼저 제안해 보세요.",
    },
    process: ["질문·상황 입력 (선택)", "결제 (카드/무통장)", "카드 드로우", "검수 후 발행 — 보통 24시간 이내"],
    methodNote: "5장 스프레드로 관계의 구조(현재·감정·장애물·미래·조언)를 읽습니다. 검수를 거쳐 정돈된 리딩으로 발행됩니다.",
    delivery: { mode: "review", timeText: "검수 후 24시간 이내 발행" },
    priceHint: 4950,
    faq: [
      FAQ_TAROT_REVIEW,
      { q: "헤어진 사이여도 볼 수 있나요?", a: "네. 끝난 관계의 흐름 정리, 재회 가능성 점검용으로도 많이 활용돼요. 더 깊은 재회 분석은 사주 기반 '재회 가능성 리포트'와 함께 보시면 좋아요." },
      FAQ_TAROT_QUESTION,
      FAQ_REFUND,
      FAQ_NOT_PROPHECY,
    ],
    caution: "관계의 미래를 확정하지 않습니다. 지금 구조를 이해하고 다음 행동을 잡는 참고 자료입니다.",
    related: ["reunion-check", "tarot-inner-mind", "premium-saju"],
    isPublished: true,
    displayOrder: 130,
  },

  // ─────────────────────────────────────────────
  // 숨김 상품 — isPublished=false (프런트 미노출, 직접 URL 은 /products 로 안내)
  // ─────────────────────────────────────────────
  {
    slug: "love-session",
    serviceType: "saju",
    concerns: ["love"],
    displayName: "연애 집중 세션",
    shortDescription: "그 사람 속마음·궁합·타이밍 집중 세션",
    headline: "그 사람 속마음, 집중 세션으로 들여다봅니다",
    empathy: [],
    questions: [],
    forWhom: [],
    resultToc: [],
    sample: { kind: "saju", title: "", oneLiner: "", sections: [], actions: [] },
    process: [],
    methodNote: "",
    delivery: { mode: "auto", timeText: "결제 후 바로 확인" },
    priceHint: 19900,
    faq: [],
    caution: "",
    related: [],
    isPublished: false,
    displayOrder: 900,
  },
  {
    slug: "reunion-program",
    serviceType: "saju",
    concerns: ["reunion"],
    displayName: "재회 회복 프로그램",
    shortDescription: "재회 회복 집중 프로그램",
    headline: "",
    empathy: [],
    questions: [],
    forWhom: [],
    resultToc: [],
    sample: { kind: "saju", title: "", oneLiner: "", sections: [], actions: [] },
    process: [],
    methodNote: "",
    delivery: { mode: "auto", timeText: "결제 후 바로 확인" },
    priceHint: 99000,
    faq: [],
    caution: "",
    related: [],
    isPublished: false,
    displayOrder: 910,
  },
  {
    slug: "life-master",
    serviceType: "saju",
    concerns: ["self", "money"],
    displayName: "인생 리디자인 마스터",
    shortDescription: "인생 전체 재설계 마스터 프로그램",
    headline: "",
    empathy: [],
    questions: [],
    forWhom: [],
    resultToc: [],
    sample: { kind: "saju", title: "", oneLiner: "", sections: [], actions: [] },
    process: [],
    methodNote: "",
    delivery: { mode: "auto", timeText: "결제 후 바로 확인" },
    priceHint: 149000,
    faq: [],
    caution: "",
    related: [],
    isPublished: false,
    displayOrder: 920,
  },
];

// ── 헬퍼 ──

export function publishedProducts(): CatalogProduct[] {
  return CATALOG.filter((p) => p.isPublished).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCatalogProduct(slug: string): CatalogProduct | undefined {
  return CATALOG.find((p) => p.slug === slug);
}

export function productsByConcern(tag: ConcernTag): CatalogProduct[] {
  return publishedProducts().filter((p) => p.concerns.includes(tag));
}

export function productsByService(service: ServiceType): CatalogProduct[] {
  return publishedProducts().filter((p) => p.serviceType === service);
}

export function relatedProducts(slug: string): CatalogProduct[] {
  const p = getCatalogProduct(slug);
  if (!p) return [];
  return p.related
    .map((s) => getCatalogProduct(s))
    .filter((x): x is CatalogProduct => !!x && x.isPublished)
    .slice(0, 3);
}
