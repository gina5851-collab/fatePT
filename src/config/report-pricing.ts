// =====================================================
// 무료 결과 → 유료 해금 가격 실험 설정 (변수화)
// =====================================================
// 아직 확정 X. 여기 배열만 바꾸면 결과 페이지 페이월 가격이 바뀐다.
// 추후 A/B: activeTierIds 로 노출할 티어 조합을 실험.

export type ReportTier = {
  id: string;
  productSlug: string; // 결제 연결용 상품 slug (products 테이블)
  price: number;
  originalPrice?: number; // 가격 앵커(취소선). 없으면 미표시
  label: string;
  sub: string;
  highlight?: boolean; // 추천(앵커) 표시
};

export const REPORT_TIERS: ReportTier[] = [
  { id: "test", productSlug: "inbody", price: 4900, label: "테스트 리포트", sub: "핵심 패턴 1가지만 빠르게" },
  { id: "mini", productSlug: "crush-kit", price: 14900, originalPrice: 24900, label: "미니 리포트", sub: "관계·감정 집중 해석" },
  // full 은 '전체 사주 리포트'(DB slug: premium-saju, 34,900원)와 1:1 —
  // 페이월 표시가와 상품 실판매가 불일치(구: reunion-check 39,000원)를 해소.
  { id: "full", productSlug: "premium-saju", price: 34900, originalPrice: 64900, label: "전체 리포트", sub: "잠긴 패턴 전부 해금", highlight: true },
  { id: "premium", productSlug: "life-master", price: 149000, originalPrice: 240000, label: "프리미엄 확장", sub: "대운·흐름·평생 로드맵" },
];

// 결과 페이지 메인 페이월 노출 티어 — full(34,900) 집중.
// premium(life-master)은 현재 판매 숨김 상태라 페이월에서도 제외.
export const ACTIVE_TIER_IDS = ["full", "mini"];

export function activeTiers(): ReportTier[] {
  // ACTIVE_TIER_IDS 순서대로 반환 (full 먼저)
  return ACTIVE_TIER_IDS
    .map((id) => REPORT_TIERS.find((t) => t.id === id))
    .filter((t): t is ReportTier => !!t);
}
