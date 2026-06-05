// =====================================================
// BrandG 5G 카테고리 정적 데이터
// =====================================================
// /categories, /categories/[slug], GCategoryCards.tsx 가 공통 참조.
// 카테고리 ↔ 상품 연결은 Phase 2c 의 products.category_slug 마이그레이션 후 활성화.

export type GCategory = {
  slug: string;
  korean: string;
  english: string;
  tagline: string;
  emoji: string;
  subCategories: string[];
};

export const G_CATEGORIES: GCategory[] = [
  {
    slug: "good-skin",
    korean: "동안이G",
    english: "Good Skin",
    tagline: "오늘부터 매일 조금씩, 동안이가 되는 루틴",
    emoji: "💧",
    subCategories: ["스킨케어", "헤어케어", "두피케어", "바디케어", "홈뷰티 디바이스"],
  },
  {
    slug: "good-health",
    korean: "건강이G",
    english: "Good Health",
    tagline: "잘 먹고 잘 자는 일상에 더하는 한 끗",
    emoji: "🌿",
    subCategories: ["영양제", "건강식품", "차", "이너뷰티", "단백질"],
  },
  {
    slug: "good-recovery",
    korean: "힐링이G",
    english: "Good Recovery",
    tagline: "지친 하루 끝에 나를 차분히 풀어주는 시간",
    emoji: "🛁",
    subCategories: ["입욕제", "바디케어", "헤어팩", "홈스파", "향기템"],
  },
  {
    slug: "good-balance",
    korean: "가벼워지G",
    english: "Good Balance",
    tagline: "몸이 가벼워지는 작은 습관과 도구",
    emoji: "🌬️",
    subCategories: ["붓기", "순환", "다이어트", "스트레칭", "마사지"],
  },
  {
    slug: "good-inner-care",
    korean: "편안하G",
    english: "Good Inner Care",
    tagline: "여성의 일상을 더 편안하게 받쳐주는 케어",
    emoji: "🌸",
    subCategories: ["여성청결", "질유산균", "Y존케어", "갱년기", "이너케어"],
  },
];

export function findGCategory(slug: string): GCategory | undefined {
  return G_CATEGORIES.find((c) => c.slug === slug);
}
