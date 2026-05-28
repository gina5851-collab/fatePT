// =====================================================
// 외부 콘텐츠 ↔ 내부 프로그램 매핑 테이블 (운명PT 세계관)
// =====================================================
// 외부 플랫폼(유튜브/인스타/스레드 등) 콘텐츠가 자사몰 어느 프로그램으로
// 연결되는지 정의. 결제/DB/API 코드와 무관한 순수 전략 설정 파일.
// 차가운 유입은 저허들(운명 인바디)로 보내고, 관계/재회는 전용 프로그램으로.

export type ContentMapping = {
  /** 외부 플랫폼에 노출할 콘텐츠 제목 */
  externalTitle: string;
  /** 콘텐츠 카테고리 (URL 구조와 일치) */
  category: "relationship" | "money-career" | "self-understanding" | "choice" | "tests";
  /** 연결할 내부 프로그램 slug */
  productSlug: string;
  /** 내부 프로그램명 */
  productName: string;
  /** CTA 문구 */
  cta: string;
};

export const CONTENT_MAPPINGS: ContentMapping[] = [
  // ── 관계 패턴 ──────────────────────────────────────
  {
    externalTitle: "왜 나는 같은 연애를 반복할까?",
    category: "relationship",
    productSlug: "love-session",
    productName: "연애 집중 세션",
    cta: "내 연애 자세부터 교정하기 →",
  },
  {
    externalTitle: "헤어진 사람을 오래 못 잊는 이유",
    category: "relationship",
    productSlug: "reunion-program",
    productName: "재회 회복 프로그램",
    cta: "재회 회복 프로그램 보기 →",
  },
  {
    externalTitle: "좋아할수록 불안해지는 관계의 구조",
    category: "relationship",
    productSlug: "love-session",
    productName: "연애 집중 세션",
    cta: "내 관계 자세 점검하기 →",
  },
  {
    externalTitle: "나를 흔드는 사람에게 끌리는 이유",
    category: "relationship",
    productSlug: "love-session",
    productName: "연애 집중 세션",
    cta: "연애 집중 세션 보기 →",
  },
  {
    externalTitle: "두 사람이 자꾸 엇갈리는 이유",
    category: "relationship",
    productSlug: "love-session",
    productName: "연애 집중 세션",
    cta: "우리 궁합 흐름 보기 →",
  },

  // ── 돈과 일 ────────────────────────────────────────
  {
    externalTitle: "돈을 버는데도 안 모이는 이유",
    category: "money-career",
    productSlug: "inbody",
    productName: "운명 인바디",
    cta: "내 재물 패턴부터 진단하기 →",
  },
  {
    externalTitle: "이직할 때마다 후회하는 사람의 공통점",
    category: "money-career",
    productSlug: "inbody",
    productName: "운명 인바디",
    cta: "내 운명 체성분부터 진단하기 →",
  },
  {
    externalTitle: "올해 버틸까, 바꿔야 할까?",
    category: "money-career",
    productSlug: "inbody",
    productName: "운명 인바디",
    cta: "내 기질부터 진단하기 →",
  },

  // ── 자기이해 ────────────────────────────────────────
  {
    externalTitle: "중요한 선택 앞에서 늘 흔들리는 이유",
    category: "self-understanding",
    productSlug: "inbody",
    productName: "운명 인바디",
    cta: "내 운명 체성분 측정하기 →",
  },
  {
    externalTitle: "내 인생이 제자리처럼 느껴질 때",
    category: "self-understanding",
    productSlug: "life-master",
    productName: "인생 리디자인 마스터",
    cta: "인생 전체 리디자인하기 →",
  },
  {
    externalTitle: "나는 왜 사람 눈치를 많이 볼까?",
    category: "self-understanding",
    productSlug: "inbody",
    productName: "운명 인바디",
    cta: "내 기질 진단하기 →",
  },

  // ── 선택 상담 ────────────────────────────────────────
  {
    externalTitle: "오늘 조심해야 할 선택 3가지",
    category: "choice",
    productSlug: "inbody",
    productName: "운명 인바디",
    cta: "내 패턴부터 진단하기 →",
  },
  {
    externalTitle: "지금 버텨야 할까, 그만둬야 할까?",
    category: "choice",
    productSlug: "inbody",
    productName: "운명 인바디",
    cta: "내 운명 체성분 측정하기 →",
  },
];

/** slug로 해당 프로그램에 연결된 콘텐츠 목록 조회 */
export function getContentsByProductSlug(productSlug: string): ContentMapping[] {
  return CONTENT_MAPPINGS.filter((m) => m.productSlug === productSlug);
}

/** 카테고리로 콘텐츠 목록 조회 */
export function getContentsByCategory(category: ContentMapping["category"]): ContentMapping[] {
  return CONTENT_MAPPINGS.filter((m) => m.category === category);
}
