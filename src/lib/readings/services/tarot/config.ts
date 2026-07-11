// =====================================================
// 타로 상품 설정 — 단일 소스 (가격/스프레드/발행정책)
// =====================================================
// 기준: docs/TAROT_PRODUCT_STANDARD.md (타로 상품 기준 v1 — 사장님 승인 없이 변경 금지)
// 상품·가격·정상가·카드 수·스프레드·발행방식은 전부 여기서만 수정한다.
// 상품 시드(products.seed.ts)와 랜딩/상세/결제/드로우가 이 설정을 참조한다.

import type { PublishPolicy } from "../../types";

export type TarotSpreadKind =
  | "daily"              // 1장 — 핵심 메시지
  | "three-card-time"    // 3장 — 과거/현재/미래
  | "three-card-relation"// 3장 — 나/상대방/관계
  | "three-card-flow"    // 3장 — 원인/과정/결과
  | "celtic-cross";      // 10장 — 켈틱 크로스

/** 3 카드처럼 고객이 구성을 고를 수 있는 상품의 선택지 */
export type SpreadOption = { kind: TarotSpreadKind; label: string };

export type TarotProduct = {
  slug: string; // products.slug (DB) 와 동일
  name: string;
  description: string;
  price: number; // 원(KRW) — 실제 결제가. DB products.price 와 동일해야 한다.
  originalPrice?: number; // 정상가(취소선 표기 전용) — DB에는 저장하지 않는다.
  spread: TarotSpreadKind; // 기본 스프레드
  spreadOptions?: SpreadOption[]; // 고객 선택 가능 구성 (미지정 시 기본 스프레드 고정)
  cardCount: 1 | 3 | 10;
  publish: PublishPolicy; // 기준 v1: 전 상품 auto(자동 발행)
  display_order: number;
  headline: string; // 랜딩 후크
  intro: string; // 랜딩 설명
};

export const TAROT_PRODUCTS: TarotProduct[] = [
  {
    slug: "tarot-one-card",
    name: "원 카드 타로",
    description: "한 장으로 받는 핵심 메시지와 오늘의 조언",
    price: 1000,
    spread: "daily",
    cardCount: 1,
    publish: "auto",
    display_order: 110,
    headline: "오늘, 나에게 필요한 한 마디",
    intro: "카드 한 장이 지금 흐름의 핵심 메시지와 오늘의 조언을 짚어줍니다. 결제 후 바로 확인할 수 있어요.",
  },
  {
    slug: "tarot-three-card",
    name: "3 카드 타로",
    description: "세 장으로 읽는 상황의 앞뒤 — 구성은 내가 선택",
    price: 3800,
    spread: "three-card-time",
    spreadOptions: [
      { kind: "three-card-time", label: "과거 / 현재 / 미래" },
      { kind: "three-card-relation", label: "나 / 상대방 / 관계" },
      { kind: "three-card-flow", label: "원인 / 과정 / 결과" },
    ],
    cardCount: 3,
    publish: "auto",
    display_order: 120,
    headline: "세 장이면, 상황의 앞뒤가 보입니다",
    intro: "시간의 흐름, 두 사람의 마음, 일의 인과 — 원하는 구성을 골라 세 장으로 짚어봅니다. 결제 후 바로 확인할 수 있어요.",
  },
  {
    slug: "tarot-celtic-cross",
    name: "켈틱 크로스 타로",
    description: "10장으로 펼치는 가장 깊은 정통 리딩",
    price: 5800,
    originalPrice: 8700,
    spread: "celtic-cross",
    cardCount: 10,
    publish: "auto",
    display_order: 130,
    headline: "10장이 펼치는, 문제의 전체 지도",
    intro: "현재 상황부터 최종 결과까지 — 정통 켈틱 크로스 10장으로 문제의 구조 전체를 펼쳐 읽습니다. 결제 후 바로 확인할 수 있어요.",
  },
];

export function getTarotProduct(slug: string): TarotProduct | undefined {
  return TAROT_PRODUCTS.find((p) => p.slug === slug);
}

export function isTarotSlug(slug: string): boolean {
  return TAROT_PRODUCTS.some((p) => p.slug === slug);
}

/** 해당 상품에서 허용되는 스프레드 목록 (기본 + 선택지) */
export function allowedSpreads(product: TarotProduct): TarotSpreadKind[] {
  const opts = product.spreadOptions?.map((o) => o.kind) ?? [];
  return Array.from(new Set([product.spread, ...opts]));
}

// =====================================================
// 구→신 slug 매핑 — 무중단 전환 전용 (이 파일에서만 정의)
// =====================================================
// 용도: ① next.config redirect ② Production SQL 매핑 ③ DB fallback 조회.
// 구 slug 는 UI 상품 정의(TAROT_PRODUCTS)·클라이언트·내부 링크에 절대 포함하지 않는다.
// SQL(scripts/sql/tarot_standard_v1.sql) 적용 전에는 운영 DB 가 구 slug 행이므로,
// 신 slug 조회 실패 시 대응 구 slug 로 '한 번만' fallback 한다. 적용 후에는 신 slug 로 즉시 매칭.

export const LEGACY_TAROT_SLUG_MAP: Record<string, string> = {
  "tarot-daily": "tarot-one-card",
  "tarot-inner-mind": "tarot-three-card",
  "tarot-relationship": "tarot-celtic-cross",
};

const NEW_TO_LEGACY: Record<string, string> = Object.fromEntries(
  Object.entries(LEGACY_TAROT_SLUG_MAP).map(([legacy, next]) => [next, legacy]),
);

/** 신 slug 에 대응하는 구 slug (없으면 undefined — 사주 등 비대상 slug) */
export function legacyTarotSlugFor(slug: string): string | undefined {
  return NEW_TO_LEGACY[slug];
}

/** DB 조회용 slug 목록 확장 — 신 slug 뒤에 대응 구 slug 를 덧붙인다 (fallback 후보) */
export function expandSlugsWithLegacy(slugs: string[]): string[] {
  const out = new Set<string>();
  for (const s of slugs) {
    out.add(s);
    const legacy = legacyTarotSlugFor(s);
    if (legacy) out.add(legacy);
  }
  return Array.from(out);
}

export type SlugPick<T> = { row: T | null; usedLegacy: boolean; warning?: string };

/**
 * 조회된 행들 중 요청 slug 에 해당하는 행 선택.
 * - 신 slug 행 우선. 없으면 대응 구 slug 행으로 fallback.
 * - 신·구가 동시에 존재하는 비정상 상태면 신 slug 행을 쓰고 warning 을 남긴다.
 */
export function pickRowForSlug<T extends { slug: string }>(requested: string, rows: T[]): SlugPick<T> {
  const exact = rows.find((r) => r.slug === requested) ?? null;
  const legacySlug = legacyTarotSlugFor(requested);
  const legacy = legacySlug ? rows.find((r) => r.slug === legacySlug) ?? null : null;
  if (exact && legacy) {
    return {
      row: exact,
      usedLegacy: false,
      warning: `신·구 slug 동시 존재: '${requested}' 와 '${legacySlug}' — 신 slug 행 사용. SQL 적용 상태를 점검하세요.`,
    };
  }
  if (exact) return { row: exact, usedLegacy: false };
  if (legacy) return { row: legacy, usedLegacy: true };
  return { row: null, usedLegacy: false };
}
