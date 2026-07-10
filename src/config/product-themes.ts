// =====================================================
// 상품별 비주얼 테마 — 카드/상세 히어로 배경·포인트·그래픽 선택
// =====================================================
// Tailwind JIT 특성상 클래스 문자열은 전부 리터럴로 둔다 (동적 조립 금지).

export type ArtKind = "wheel" | "tarot-1" | "tarot-3" | "tarot-5" | "reunion" | "crush" | "measure" | "gate";

export type ProductTheme = {
  /** 카드·상세 히어로 배경 그라데이션 (리터럴 클래스) */
  bg: string;
  /** 포인트 텍스트 색 */
  accentText: string;
  /** 그래픽 종류 */
  art: ArtKind;
  /** 카테고리 라벨 */
  categoryLabel: string;
};

const NAVY_GOLD: Omit<ProductTheme, "art" | "categoryLabel"> = {
  bg: "bg-gradient-to-b from-[#16264a] via-[#101d3a] to-[#0a1226]",
  accentText: "text-sf-gold",
};

export const PRODUCT_THEMES: Record<string, ProductTheme> = {
  "free-taste": {
    bg: "bg-gradient-to-b from-[#1d2b4e] via-[#152242] to-[#0e1a33]",
    accentText: "text-sf-gold",
    art: "gate",
    categoryLabel: "무료 진단",
  },
  inbody: {
    bg: "bg-gradient-to-b from-[#14304a] via-[#102540] to-[#0a1728]",
    accentText: "text-sf-gold",
    art: "measure",
    categoryLabel: "사주 · 측정",
  },
  "premium-saju": {
    bg: "bg-gradient-to-b from-[#1a2a54] via-[#131f42] to-[#0a1226]",
    accentText: "text-sf-gold",
    art: "wheel",
    categoryLabel: "사주 · 전체",
  },
  "crush-kit": {
    bg: "bg-gradient-to-b from-[#3a1430] via-[#2b0f24] to-[#150812]",
    accentText: "text-[#f0a8c0]",
    art: "crush",
    categoryLabel: "사주 · 짝사랑",
  },
  "reunion-check": {
    bg: "bg-gradient-to-b from-[#33102a] via-[#240c1e] to-[#120610]",
    accentText: "text-sf-gold",
    art: "reunion",
    categoryLabel: "사주 · 재회",
  },
  "tarot-daily": {
    bg: "bg-gradient-to-b from-[#141d3a] via-[#0d1530] to-[#070d1e]",
    accentText: "text-sf-gold",
    art: "tarot-1",
    categoryLabel: "타로 · 1장",
  },
  "tarot-inner-mind": {
    bg: "bg-gradient-to-b from-[#231740] via-[#191033] to-[#0d081f]",
    accentText: "text-sf-gold",
    art: "tarot-3",
    categoryLabel: "타로 · 3장",
  },
  "tarot-relationship": {
    bg: "bg-gradient-to-b from-[#1a1a46] via-[#141238] to-[#0a0922]",
    accentText: "text-sf-gold",
    art: "tarot-5",
    categoryLabel: "타로 · 5장",
  },
};

const DEFAULT_THEME: ProductTheme = {
  ...NAVY_GOLD,
  art: "wheel",
  categoryLabel: "사주",
};

export function productTheme(slug: string): ProductTheme {
  return PRODUCT_THEMES[slug] ?? DEFAULT_THEME;
}
