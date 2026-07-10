// =====================================================
// 타로 상품 설정 — 단일 소스 (가격/스프레드/발행정책)
// =====================================================
// 상품·가격·스프레드·발행방식은 전부 여기서만 수정한다.
// 상품 시드(products.seed.ts)와 랜딩/결제/드로우가 이 설정을 참조한다.
// ⚠️ 가격은 초기 임시값(승인된 값). 정식 확정 시 이 파일만 바꾸면 된다.

import type { PublishPolicy } from "../../types";

export type TarotSpreadKind = "daily" | "inner-mind" | "relationship";

export type TarotProduct = {
  slug: string; // products.slug (DB) 와 동일
  name: string;
  description: string;
  price: number; // 원(KRW), 임시값
  spread: TarotSpreadKind;
  cardCount: 1 | 3 | 5;
  publish: PublishPolicy; // auto = 자동발행, review = 관리자 검수 후 발행
  display_order: number;
  headline: string; // 랜딩 후크
  intro: string; // 랜딩 설명
};

export const TAROT_PRODUCTS: TarotProduct[] = [
  {
    slug: "tarot-daily",
    name: "오늘의 타로",
    description: "지금 나에게 필요한 한 장의 메시지",
    price: 990,
    spread: "daily",
    cardCount: 1,
    publish: "auto",
    display_order: 110,
    headline: "오늘, 나에게 필요한 한 마디",
    intro: "카드 한 장이 지금 흐름에서 당신이 붙잡아야 할 메시지를 짚어줍니다. 결제 후 바로 확인할 수 있어요.",
  },
  {
    slug: "tarot-inner-mind",
    name: "그 사람의 속마음",
    description: "3장으로 읽는 그 사람의 진짜 마음",
    price: 2970,
    spread: "inner-mind",
    cardCount: 3,
    publish: "review",
    display_order: 120,
    headline: "그 사람, 지금 무슨 생각일까?",
    intro: "현재 상황 · 상대의 속마음 · 앞으로의 흐름을 3장으로 짚어봅니다. 검수를 거쳐 정성껏 발행해 드려요.",
  },
  {
    slug: "tarot-relationship",
    name: "우리 관계의 흐름",
    description: "5장으로 보는 두 사람의 관계 흐름",
    price: 4950,
    spread: "relationship",
    cardCount: 5,
    publish: "review",
    display_order: 130,
    headline: "우리 관계, 지금 어디로 가고 있을까?",
    intro: "현재 관계 · 상대의 감정 · 숨은 장애물 · 가까운 미래 · 조언까지 5장으로 깊이 있게 읽어드립니다. 검수 후 발행돼요.",
  },
];

export function getTarotProduct(slug: string): TarotProduct | undefined {
  return TAROT_PRODUCTS.find((p) => p.slug === slug);
}

export function isTarotSlug(slug: string): boolean {
  return TAROT_PRODUCTS.some((p) => p.slug === slug);
}
