// =====================================================
// 상품 시드 (scripts/seed-products.ts 에서 사용)
// =====================================================
// 운명PT 세계관: "운명도 단련된다" — 각 상품은 단품 사주가 아니라
// 진단(인바디) → 집중 세션 → 회복 프로그램 → 인생 리디자인으로 이어지는
// '트레이닝 프로그램'. 한 프로그램 = 한 결제(현재 단일상품 결제 모델에 그대로 맞음).
// 가격/구성 수정 후 pnpm seed:products 로 DB 반영.

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
    slug: "inbody",
    name: "운명 인바디",
    description: "내 운명 체성분 측정 — 타고난 기질·강점·약점을 한 장으로 진단",
    price: 4900,
    display_order: 10,
    is_active: true,
  },
  {
    slug: "love-session",
    name: "연애 집중 세션",
    description: "그 사람 속마음·궁합·타이밍을 집중 트레이닝하는 관계 세션",
    price: 19900,
    display_order: 20,
    is_active: true,
  },
  {
    slug: "reunion-program",
    name: "재회 회복 프로그램",
    description: "헤어진 관계를 다시 세우는 8주 집중 회복 프로그램",
    price: 99000,
    display_order: 30,
    is_active: true,
  },
  {
    slug: "life-master",
    name: "인생 리디자인 마스터",
    description: "직업·재물·관계·건강·대운까지 인생 전체를 재설계하는 마스터 프로그램",
    price: 149000,
    display_order: 40,
    is_active: true,
  },
];
