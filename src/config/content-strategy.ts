// =====================================================
// 외부 콘텐츠 ↔ 내부 상품 매핑 테이블
// =====================================================
// 외부 플랫폼(유튜브/인스타/스레드 등)에서 유입된 트래픽이
// 자사몰 어느 상품 페이지로 연결되어야 하는지 정의합니다.
// 결제/DB/API 코드와 무관한 순수 전략 설정 파일입니다.

export type ContentMapping = {
  /** 외부 플랫폼에 노출할 콘텐츠 제목 */
  externalTitle: string;
  /** 콘텐츠 카테고리 (URL 구조와 일치) */
  category: "relationship" | "money-career" | "self-understanding" | "choice" | "tests";
  /** 연결할 내부 상품 slug */
  productSlug: string;
  /** 내부 상품명 */
  productName: string;
  /** CTA 문구 */
  cta: string;
};

export const CONTENT_MAPPINGS: ContentMapping[] = [
  // ── 관계 패턴 ──────────────────────────────────────
  {
    externalTitle: "왜 나는 같은 연애를 반복할까?",
    category: "relationship",
    productSlug: "love-saju",
    productName: "관계 패턴 리포트",
    cta: "내 연애 패턴을 리포트로 확인하기 →",
  },
  {
    externalTitle: "헤어진 사람을 오래 못 잊는 이유",
    category: "relationship",
    productSlug: "love-saju",
    productName: "관계 패턴 리포트",
    cta: "관계 패턴 리포트 확인하기 →",
  },
  {
    externalTitle: "좋아할수록 불안해지는 관계의 구조",
    category: "relationship",
    productSlug: "love-saju",
    productName: "관계 패턴 리포트",
    cta: "내 관계 패턴 확인하기 →",
  },
  {
    externalTitle: "나를 흔드는 사람에게 끌리는 이유",
    category: "relationship",
    productSlug: "love-saju",
    productName: "관계 패턴 리포트",
    cta: "관계 패턴 리포트 보기 →",
  },
  {
    externalTitle: "두 사람이 자꾸 엇갈리는 이유",
    category: "relationship",
    productSlug: "love-saju",
    productName: "관계 패턴 리포트",
    cta: "관계 흐름 리포트 확인하기 →",
  },

  // ── 돈과 일 ────────────────────────────────────────
  {
    externalTitle: "돈을 버는데도 안 모이는 이유",
    category: "money-career",
    productSlug: "basic-saju",
    productName: "기본 자기이해 리포트",
    cta: "올해 돈의 흐름 리포트 확인하기 →",
  },
  {
    externalTitle: "이직할 때마다 후회하는 사람의 공통점",
    category: "money-career",
    productSlug: "basic-saju",
    productName: "기본 자기이해 리포트",
    cta: "올해 일의 흐름 리포트 확인하기 →",
  },
  {
    externalTitle: "올해 버틸까, 바꿔야 할까?",
    category: "money-career",
    productSlug: "basic-saju",
    productName: "기본 자기이해 리포트",
    cta: "올해 흐름 리포트 확인하기 →",
  },

  // ── 자기이해 ────────────────────────────────────────
  {
    externalTitle: "중요한 선택 앞에서 늘 흔들리는 이유",
    category: "self-understanding",
    productSlug: "basic-saju",
    productName: "기본 자기이해 리포트",
    cta: "자기이해 리포트 시작하기 →",
  },
  {
    externalTitle: "내 인생이 제자리처럼 느껴질 때",
    category: "self-understanding",
    productSlug: "premium-saju",
    productName: "종합 분석 리포트",
    cta: "종합 리포트에서 더 자세히 확인하기 →",
  },
  {
    externalTitle: "나는 왜 사람 눈치를 많이 볼까?",
    category: "self-understanding",
    productSlug: "basic-saju",
    productName: "기본 자기이해 리포트",
    cta: "내 관계 패턴 리포트 확인하기 →",
  },

  // ── 선택 상담 ────────────────────────────────────────
  {
    externalTitle: "오늘 조심해야 할 선택 3가지",
    category: "choice",
    productSlug: "today-fortune",
    productName: "오늘의 선택 리포트",
    cta: "오늘의 선택 리포트 시작하기 →",
  },
  {
    externalTitle: "지금 버텨야 할까, 그만둬야 할까?",
    category: "choice",
    productSlug: "today-fortune",
    productName: "오늘의 선택 리포트",
    cta: "오늘의 흐름 리포트 확인하기 →",
  },
];

/** slug로 해당 상품에 연결된 콘텐츠 목록 조회 */
export function getContentsByProductSlug(productSlug: string): ContentMapping[] {
  return CONTENT_MAPPINGS.filter((m) => m.productSlug === productSlug);
}

/** 카테고리로 콘텐츠 목록 조회 */
export function getContentsByCategory(category: ContentMapping["category"]): ContentMapping[] {
  return CONTENT_MAPPINGS.filter((m) => m.category === category);
}
