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
    slug: "free-taste",
    name: "무료 운명 맛보기",
    description: "1분 무료 진단 — 오늘의 흐름과 내 기질을 가볍게 확인 (하루 1회)",
    price: 0,
    display_order: 5,
    is_active: true,
  },
  {
    // 외부(/contents) → "오늘의 선택 리포트" 라벨로 유입되는 경량 리포트.
    // DB 마이그레이션 0003 과 동기화. product-copy.ts / prompt.ts 의 today-fortune 항목과 톤 일치.
    slug: "today-fortune",
    name: "오늘의 선택 리포트",
    description: "아침에 가볍게 확인하는 오늘 하루의 선택 흐름 — 점괘가 아니라 오늘 의식할 패턴",
    price: 4900,
    display_order: 8,
    is_active: true,
  },
  {
    slug: "inbody",
    name: "운명 인바디",
    description: "내 운명 체성분 측정 — 타고난 기질·강점·약점을 한 장으로 진단",
    price: 4900,
    display_order: 10,
    is_active: true,
  },
  {
    slug: "crush-kit",
    name: "짝사랑 키트",
    description: "짝사랑 상대의 마음과 다가갈 타이밍을 진단하는 감정 키트",
    price: 14900,
    display_order: 15,
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
    slug: "reunion-check",
    name: "재회 가능성 리포트",
    description: "헤어진 그 사람과 다시 이어질 가능성·타이밍을 집중 진단",
    price: 39000,
    display_order: 25,
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
    // 본상품 (34,900원) — 무료 결과 이후 이어보는 심화 전체 리포트.
    // 운영 DB 0003 마이그레이션의 premium-saju slug 를 본상품으로 재정의.
    // 운영 DB price UPDATE 필요 (콘솔에서 직접 실행).
    slug: "premium-saju",
    name: "나의 전체 흐름 리포트",
    description: "무료 테스트 이후 이어보는 심화 전체 리포트 — 타고난 기질, 관계, 돈과 일, 현재 선택 흐름까지 한 번에 확인합니다.",
    price: 34900,
    display_order: 35,
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
