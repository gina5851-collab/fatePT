// =====================================================
// 상품 시드 (scripts/seed-products.ts 에서 사용)
// =====================================================
// 가격대만 다른 단순 라인업. 수강생은 자유롭게 추가/수정 후
// pnpm seed:products 로 DB에 반영합니다.

export type ProductSeed = {
  slug: string;
  name: string;
  description: string;
  price: number;
  display_order: number;
  is_active: boolean;
};

export const productsSeed: ProductSeed[] = [
  {
    slug: "today-fortune",
    name: "오늘의 운세 한 줄",
    description: "아침에 가볍게 보는 오늘 하루 흐름 한 문장",
    price: 4900,
    display_order: 10,
    is_active: true,
  },
  {
    slug: "basic-saju",
    name: "기본 사주 풀이",
    description: "사주 4기둥 기반 종합 성향 / 운의 흐름 리포트",
    price: 9900,
    display_order: 20,
    is_active: true,
  },
  {
    slug: "love-saju",
    name: "연애·궁합 리포트",
    description: "내 연애 패턴과 잘 맞는 사람 유형 분석",
    price: 19900,
    display_order: 30,
    is_active: true,
  },
  {
    slug: "premium-saju",
    name: "프리미엄 종합 풀이",
    description: "대운 / 세운 / 직업운 / 재물운 / 건강운 통합 리포트",
    price: 49900,
    display_order: 40,
    is_active: true,
  },
];
