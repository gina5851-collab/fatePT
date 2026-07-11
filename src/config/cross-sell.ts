// =====================================================
// 교차추천(크로스셀) 매핑 — 사주 ↔ 타로
// =====================================================
// 결과 페이지 하단 추천을 코드 곳곳에 흩지 않고 여기서만 관리한다.
// key = 방금 본 상품 slug, value = 추천할 상품들.
// 클릭 추적은 utm/source 로 이어지도록 추천 링크에 source 쿼리를 붙인다.

export type CrossSellItem = {
  slug: string; // 추천 대상 상품 slug
  href: string; // 이동 경로(사주=/products/[slug], 타로=/tarot/[slug])
  label: string; // 버튼/링크 문구
  blurb: string; // 한 줄 설명
  source: string; // 유입 추적용 source 값
};

// 타로 결과 하단 → 관련 사주 상품 추천
export const TAROT_TO_SAJU: Record<string, CrossSellItem[]> = {
  "tarot-three-card": [
    {
      slug: "crush-kit",
      href: "/products/crush-kit",
      label: "짝사랑 키트 보기",
      blurb: "그 사람 마음과 다가갈 타이밍을 사주로 더 깊이 진단해보세요.",
      source: "xsell_tarot-three-card",
    },
  ],
  "tarot-celtic-cross": [
    {
      slug: "premium-saju",
      href: "/products/premium-saju",
      label: "전체 사주 리포트 보기",
      blurb: "카드로 본 구조를, 사주의 반복 패턴으로 더 길게 내다볼 수 있어요.",
      source: "xsell_tarot-celtic-cross",
    },
    {
      slug: "reunion-check",
      href: "/products/reunion-check",
      label: "재회 가능성 리포트 보기",
      blurb: "이미 멀어진 관계라면, 재회 가능성부터 사주로 짚어보세요.",
      source: "xsell_tarot-celtic-cross",
    },
  ],
  "tarot-one-card": [
    {
      slug: "inbody",
      href: "/products/inbody",
      label: "운명 인바디 보기",
      blurb: "하루 메시지를 넘어, 타고난 기질을 한 장으로 진단해보세요.",
      source: "xsell_tarot-one-card",
    },
  ],
};

// 사주 결과 하단 → 관련 타로 상품 추천
export const SAJU_TO_TAROT: Record<string, CrossSellItem[]> = {
  "love-session": [
    {
      slug: "tarot-three-card",
      href: "/products/tarot-three-card",
      label: "3 카드 타로 보기",
      blurb: "나·상대방·관계 구성의 카드 3장으로 지금 마음의 기류를 짚어보세요.",
      source: "xsell_love-session",
    },
  ],
  "crush-kit": [
    {
      slug: "tarot-three-card",
      href: "/products/tarot-three-card",
      label: "3 카드 타로 보기",
      blurb: "나·상대방·관계 구성으로 그 사람의 지금 마음을 가볍게 들여다볼 수 있어요.",
      source: "xsell_crush-kit",
    },
  ],
  "reunion-check": [
    {
      slug: "tarot-celtic-cross",
      href: "/products/tarot-celtic-cross",
      label: "켈틱 크로스 타로 보기",
      blurb: "재회 문제의 전체 구조가 궁금하다면, 켈틱 크로스 10장으로 펼쳐보세요.",
      source: "xsell_reunion-check",
    },
  ],
};

// 기본값 — 매핑에 없을 때 타로관으로 유도(사주 결과 공통)
export const DEFAULT_SAJU_TO_TAROT: CrossSellItem = {
  slug: "tarot-one-card",
  href: "/tarot",
  label: "타로로도 물어보기",
  blurb: "카드가 짚어주는 오늘의 메시지, 타로관에서 만나보세요.",
  source: "xsell_saju_default",
};

export function tarotCrossSellForSaju(slug: string): CrossSellItem[] {
  return SAJU_TO_TAROT[slug] ?? [DEFAULT_SAJU_TO_TAROT];
}

export function sajuCrossSellForTarot(slug: string): CrossSellItem[] {
  return TAROT_TO_SAJU[slug] ?? [];
}
