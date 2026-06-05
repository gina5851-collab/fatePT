// =====================================================
// BrandG 데모용 mock 상품 데이터 (DB 무관, 정적)
// =====================================================
// 5G × 5상품 = 25개. /products, /categories/[slug], 홈 BEST/특가/지나스장바구니가 공통 참조.
// 실제 INSERT/DB 연동은 Phase 2c (별도 사전 승인). 현재는 화면 데모 전용.

export type MockProduct = {
  slug: string;
  brand: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category_slug: string;
  price: number;
  originalPrice?: number;
  isBest?: boolean;
  isSale?: boolean;
  isNew?: boolean;
  gradient: string;
  reviewCount?: number;
  rating?: number;
  highlights?: string[];
};

export const BRANDG_MOCK_PRODUCTS: MockProduct[] = [
  // ───── 동안이G (good-skin) 💧
  {
    slug: "skin-vitc-serum",
    brand: "G.LAB",
    name: "글로우 비타C 세럼 30ml",
    shortDescription: "매일 한 방울, 광채 켜는 비타C 세럼",
    longDescription: "안정형 비타민C 12% + 나이아신아마이드 2%. 데일리 컨디션 관리용으로 자극은 낮추고 광채만 끌어올렸어요.",
    category_slug: "good-skin",
    price: 32000,
    originalPrice: 42000,
    isBest: true,
    isSale: true,
    gradient: "from-sky-200 via-cyan-300 to-blue-400",
    reviewCount: 1284,
    rating: 4.8,
    highlights: ["안정형 비타C 12%", "데일리 사용 OK", "끈적임 0"],
  },
  {
    slug: "skin-cica-toner-pad",
    brand: "지나 PICK",
    name: "진정 시카 토너패드 60매",
    shortDescription: "예민한 날, 5분 진정 마스크 대용",
    longDescription: "센텔라 4종 콤플렉스 + 판테놀. 결마다 다른 60매 패드로 닦토/마스크 둘 다 가능.",
    category_slug: "good-skin",
    price: 19800,
    originalPrice: 26000,
    isBest: true,
    isSale: true,
    isNew: true,
    gradient: "from-emerald-200 via-teal-300 to-emerald-400",
    reviewCount: 892,
    rating: 4.7,
    highlights: ["저자극 시카", "마스크 겸용", "60매"],
  },
  {
    slug: "skin-daily-moisture-cream",
    brand: "G.LAB",
    name: "데일리 모이스처 크림 50g",
    shortDescription: "기름지지 않고 묵직하게 채우는 데일리 크림",
    longDescription: "히알루론산 5종 + 세라마이드 NP. 봄가을엔 단독으로, 겨울엔 페이스 오일과 레이어드.",
    category_slug: "good-skin",
    price: 28000,
    gradient: "from-blue-100 via-indigo-200 to-blue-300",
    reviewCount: 412,
    rating: 4.6,
    highlights: ["히알루론산 5종", "묵직한 보습", "끈적임 ↓"],
  },
  {
    slug: "skin-scalp-detox-cleanser",
    brand: "지나 PICK",
    name: "두피 디톡스 스칼프 클렌저 300ml",
    shortDescription: "주 2회, 두피만 깊게 비우는 클렌징",
    longDescription: "살리실산 0.5% + 멘솔. 두피 각질·과잉 피지를 비우고 산뜻하게 마무리.",
    category_slug: "good-skin",
    price: 24000,
    gradient: "from-slate-200 via-blue-300 to-cyan-500",
    reviewCount: 537,
    rating: 4.5,
    highlights: ["주 2회 케어", "살리실산 0.5%", "쿨링감"],
  },
  {
    slug: "skin-led-beauty-device",
    brand: "G.LAB",
    name: "미니 LED 뷰티 디바이스",
    shortDescription: "10분, 거울 앞에서 끝나는 홈케어",
    longDescription: "적색 LED + 근적외선 듀얼 모드. 하루 10분, 평일 루틴에 자연스럽게 끼워 넣는 디바이스.",
    category_slug: "good-skin",
    price: 89000,
    originalPrice: 129000,
    isBest: true,
    isSale: true,
    isNew: true,
    gradient: "from-rose-200 via-pink-300 to-fuchsia-400",
    reviewCount: 268,
    rating: 4.9,
    highlights: ["듀얼 LED", "10분 루틴", "USB 충전"],
  },

  // ───── 건강이G (good-health) 🌿
  {
    slug: "health-multi-vitamin",
    brand: "G.LAB",
    name: "종합 비타민 60정",
    shortDescription: "하루 1정, 부담 없이 챙기는 멀티",
    longDescription: "비타민 13종 + 미네랄 9종 + 루테인. 캡슐 작아서 삼키기 편함.",
    category_slug: "good-health",
    price: 28000,
    isBest: true,
    gradient: "from-lime-200 via-emerald-300 to-green-500",
    reviewCount: 1592,
    rating: 4.7,
    highlights: ["비타민 13종", "미네랄 9종", "60일분"],
  },
  {
    slug: "health-collagen-stick",
    brand: "지나 PICK",
    name: "콜라겐 펩타이드 스틱 30포",
    shortDescription: "물 없이 한 포, 매일 바르는 콜라겐 대신",
    longDescription: "저분자 콜라겐 1,500mg + 비타민C. 자몽맛, 살짝 시큼해서 입가심에도 좋아요.",
    category_slug: "good-health",
    price: 36000,
    originalPrice: 48000,
    isBest: true,
    isSale: true,
    gradient: "from-amber-200 via-orange-300 to-rose-400",
    reviewCount: 1108,
    rating: 4.8,
    highlights: ["저분자 1,500mg", "자몽맛", "30일분"],
  },
  {
    slug: "health-chamomile-tea",
    brand: "G.LAB",
    name: "데일리 캐모마일 티 20T",
    shortDescription: "잠들기 30분 전, 한 잔의 정리",
    longDescription: "유기농 캐모마일 100%. 카페인 0, 단독 음용 또는 우유 베이스 라떼로.",
    category_slug: "good-health",
    price: 12000,
    gradient: "from-yellow-100 via-amber-200 to-orange-300",
    reviewCount: 463,
    rating: 4.5,
    highlights: ["유기농", "카페인 0", "20티백"],
  },
  {
    slug: "health-lactoferrin",
    brand: "G.LAB",
    name: "락토페린 이너밸런스 60정",
    shortDescription: "장 컨디션이 일상을 결정해요",
    longDescription: "락토페린 200mg + 프리바이오틱스. 아침 공복에 한 정.",
    category_slug: "good-health",
    price: 39000,
    isNew: true,
    gradient: "from-green-200 via-emerald-300 to-teal-500",
    reviewCount: 348,
    rating: 4.6,
    highlights: ["락토페린 200mg", "프리바이오틱스", "60일분"],
  },
  {
    slug: "health-plant-protein",
    brand: "지나 PICK",
    name: "식물성 단백질 쉐이크 1.2kg",
    shortDescription: "아침 대용으로 부담 없는 식물성 단백",
    longDescription: "완두 + 현미 단백질 21g / 1회. 카카오맛, 우유·두유 어디든 잘 풀려요.",
    category_slug: "good-health",
    price: 45000,
    originalPrice: 58000,
    isSale: true,
    gradient: "from-stone-200 via-amber-700 to-stone-800",
    reviewCount: 612,
    rating: 4.7,
    highlights: ["식물성 단백 21g", "카카오맛", "1.2kg"],
  },

  // ───── 힐링이G (good-recovery) 🛁
  {
    slug: "recovery-bath-salt",
    brand: "G.LAB",
    name: "에센셜 오일 입욕솔트 500g",
    shortDescription: "오늘은 좀, 욕조에 누워서 끝내요",
    longDescription: "히말라야 핑크솔트 + 라벤더·유칼립투스. 한 번에 한 스푼, 일주일에 1~2회.",
    category_slug: "good-recovery",
    price: 22000,
    isBest: true,
    gradient: "from-purple-200 via-pink-300 to-rose-400",
    reviewCount: 781,
    rating: 4.8,
    highlights: ["히말라야 솔트", "에센셜 오일", "500g"],
  },
  {
    slug: "recovery-foot-detox-patch",
    brand: "지나 PICK",
    name: "풋 디톡스 패치 10매",
    shortDescription: "발바닥에 붙이고 자면 끝, 다음 날 아침 가벼움",
    longDescription: "쑥·생강 추출물. 자기 전 발바닥에 붙이고 아침에 떼면 묵직함이 한결 풀려요.",
    category_slug: "good-recovery",
    price: 14000,
    originalPrice: 19000,
    isSale: true,
    gradient: "from-amber-100 via-orange-200 to-amber-400",
    reviewCount: 524,
    rating: 4.4,
    highlights: ["수면 중 케어", "쑥·생강", "10매"],
  },
  {
    slug: "recovery-hair-pack",
    brand: "G.LAB",
    name: "인텐시브 헤어팩 200ml",
    shortDescription: "주 1회, 손상모를 끌어올리는 팩",
    longDescription: "케라틴 + 아르간 오일. 샴푸 후 2~3분, 헹굼.",
    category_slug: "good-recovery",
    price: 24000,
    gradient: "from-amber-200 via-rose-300 to-orange-400",
    reviewCount: 389,
    rating: 4.6,
    highlights: ["케라틴 + 아르간", "주 1회", "200ml"],
  },
  {
    slug: "recovery-clay-mask",
    brand: "지나 PICK",
    name: "홈스파 클레이 마스크 100g",
    shortDescription: "한 주에 한 번, 모공 비우는 시간",
    longDescription: "카올린 + 화이트 클레이. 도톰하게 발라 10분, 미온수 헹굼.",
    category_slug: "good-recovery",
    price: 26000,
    isBest: true,
    gradient: "from-stone-200 via-stone-400 to-slate-500",
    reviewCount: 612,
    rating: 4.7,
    highlights: ["카올린·화이트클레이", "주 1회", "100g"],
  },
  {
    slug: "recovery-lavender-diffuser",
    brand: "G.LAB",
    name: "라벤더 룸 디퓨저 200ml",
    shortDescription: "퇴근하고 들어와서 가장 먼저 켜는 향",
    longDescription: "라벤더 + 우디 노트. 침실용, 약 8주 지속.",
    category_slug: "good-recovery",
    price: 32000,
    originalPrice: 39000,
    isSale: true,
    isNew: true,
    gradient: "from-violet-300 via-purple-400 to-indigo-500",
    reviewCount: 247,
    rating: 4.8,
    highlights: ["라벤더 + 우디", "약 8주 지속", "200ml"],
  },

  // ───── 가벼워지G (good-balance) 🌬️
  {
    slug: "balance-edema-capsule",
    brand: "G.LAB",
    name: "데일리 부기 케어 캡슐 60정",
    shortDescription: "오후만 되면 무거운 다리, 미리 챙기는 습관",
    longDescription: "팥·호박·옥수수수염 콤플렉스. 식전 1~2정.",
    category_slug: "good-balance",
    price: 32000,
    isBest: true,
    gradient: "from-sky-200 via-blue-300 to-indigo-400",
    reviewCount: 928,
    rating: 4.6,
    highlights: ["팥·호박·옥수수수염", "식전 1~2정", "60일분"],
  },
  {
    slug: "balance-massage-roller",
    brand: "지나 PICK",
    name: "푸어팟 마사지 롤러",
    shortDescription: "TV 보면서 종아리에 굴리는 5분",
    longDescription: "리지드 폼 + EVA. 종아리·허벅지·등 모두 OK.",
    category_slug: "good-balance",
    price: 42000,
    originalPrice: 55000,
    isSale: true,
    gradient: "from-rose-200 via-pink-300 to-rose-500",
    reviewCount: 734,
    rating: 4.7,
    highlights: ["리지드 폼", "전신 사용", "USB 진동 옵션 미포함"],
  },
  {
    slug: "balance-slim-shake",
    brand: "G.LAB",
    name: "컷팅 슬림 다이어트 쉐이크 14포",
    shortDescription: "한 끼 대용으로 부담 없이 가는 쉐이크",
    longDescription: "단백질 18g + 식이섬유 8g. 초코·바닐라 2종.",
    category_slug: "good-balance",
    price: 36000,
    gradient: "from-amber-100 via-stone-300 to-stone-500",
    reviewCount: 562,
    rating: 4.5,
    highlights: ["단백 18g", "식이섬유 8g", "14포"],
  },
  {
    slug: "balance-stretch-band-set",
    brand: "G.LAB",
    name: "5분 스트레칭 밴드 세트",
    shortDescription: "강도 3단계, 거실에 그냥 두고 쓰는 밴드",
    longDescription: "라텍스 프리. 라이트·미디엄·헤비 3종 + 수납파우치.",
    category_slug: "good-balance",
    price: 18000,
    isBest: true,
    isNew: true,
    gradient: "from-emerald-200 via-teal-300 to-cyan-500",
    reviewCount: 421,
    rating: 4.7,
    highlights: ["라텍스 프리", "3단계", "수납파우치"],
  },
  {
    slug: "balance-calf-cream",
    brand: "지나 PICK",
    name: "종아리 부기 마사지 크림 100ml",
    shortDescription: "씻고 나서 종아리 위로 밀어 올리기",
    longDescription: "멘솔 + 호스체스트넛. 묵직한 쿨링감.",
    category_slug: "good-balance",
    price: 22000,
    originalPrice: 28000,
    isSale: true,
    gradient: "from-cyan-200 via-sky-300 to-blue-500",
    reviewCount: 358,
    rating: 4.5,
    highlights: ["쿨링감", "호스체스트넛", "100ml"],
  },

  // ───── 편안하G (good-inner-care) 🌸
  {
    slug: "inner-cleansing-foam",
    brand: "G.LAB",
    name: "데일리 여성 클렌징 폼 200ml",
    shortDescription: "약산성 5.5, 데일리로 무리 없는 클렌징",
    longDescription: "약산성 5.5 + 무향. 자극은 낮추고 보습은 채웠어요.",
    category_slug: "good-inner-care",
    price: 18000,
    isBest: true,
    gradient: "from-rose-200 via-pink-300 to-rose-400",
    reviewCount: 1342,
    rating: 4.8,
    highlights: ["약산성 5.5", "무향", "200ml"],
  },
  {
    slug: "inner-lactobacillus",
    brand: "G.LAB",
    name: "질유산균 30포",
    shortDescription: "한 달 케어, 가장 기본부터",
    longDescription: "여성 친화 유산균 4종 + 크랜베리. 1일 1포, 식후.",
    category_slug: "good-inner-care",
    price: 36000,
    originalPrice: 48000,
    isBest: true,
    isSale: true,
    gradient: "from-pink-300 via-rose-400 to-fuchsia-500",
    reviewCount: 982,
    rating: 4.7,
    highlights: ["유산균 4종", "크랜베리", "30일분"],
  },
  {
    slug: "inner-y-zone-serum",
    brand: "지나 PICK",
    name: "Y존 인텐시브 케어 세럼 30ml",
    shortDescription: "민감한 부위에도 무리 없는 데일리 케어",
    longDescription: "센텔라 + 판테놀. 약산성, 데일리 사용.",
    category_slug: "good-inner-care",
    price: 28000,
    gradient: "from-rose-100 via-pink-200 to-rose-400",
    reviewCount: 487,
    rating: 4.6,
    highlights: ["저자극", "약산성", "30ml"],
  },
  {
    slug: "inner-menopause-balance",
    brand: "G.LAB",
    name: "갱년기 이너밸런스 60정",
    shortDescription: "흔들리는 컨디션, 미리 준비하는 한 정",
    longDescription: "이소플라본 + 감마리놀렌산. 1일 1정.",
    category_slug: "good-inner-care",
    price: 42000,
    isNew: true,
    gradient: "from-purple-200 via-violet-300 to-pink-400",
    reviewCount: 268,
    rating: 4.7,
    highlights: ["이소플라본", "감마리놀렌산", "60일분"],
  },
  {
    slug: "inner-daily-care-capsule",
    brand: "지나 PICK",
    name: "데일리 이너 케어 캡슐 30정",
    shortDescription: "출장·생리 전후, 컨디션 흔들릴 때",
    longDescription: "락토바실러스 + 비타민B 콤플렉스. 한 달 케어.",
    category_slug: "good-inner-care",
    price: 26000,
    originalPrice: 33000,
    isSale: true,
    gradient: "from-fuchsia-200 via-pink-300 to-rose-500",
    reviewCount: 412,
    rating: 4.6,
    highlights: ["락토바실러스", "비타민B", "30일분"],
  },
];

export function findMockProduct(slug: string): MockProduct | undefined {
  return BRANDG_MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getMockProductsByCategory(categorySlug: string): MockProduct[] {
  return BRANDG_MOCK_PRODUCTS.filter((p) => p.category_slug === categorySlug);
}

export function getBestMockProducts(limit?: number): MockProduct[] {
  const best = BRANDG_MOCK_PRODUCTS.filter((p) => p.isBest);
  return typeof limit === "number" ? best.slice(0, limit) : best;
}

export function getSaleMockProducts(limit?: number): MockProduct[] {
  const sale = BRANDG_MOCK_PRODUCTS.filter((p) => p.isSale);
  return typeof limit === "number" ? sale.slice(0, limit) : sale;
}

export function getJinasPicks(limit = 5): MockProduct[] {
  return BRANDG_MOCK_PRODUCTS.filter((p) => p.brand === "지나 PICK").slice(0, limit);
}

export function getNewMockProducts(limit?: number): MockProduct[] {
  const items = BRANDG_MOCK_PRODUCTS.filter((p) => p.isNew);
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export function getBrandMockProducts(brand: string, limit?: number): MockProduct[] {
  const items = BRANDG_MOCK_PRODUCTS.filter((p) => p.brand === brand);
  return typeof limit === "number" ? items.slice(0, limit) : items;
}
