// =====================================================
// 무료 결과 → 유료 해금 가격 실험 설정 (변수화)
// =====================================================
// 아직 확정 X. 여기 배열만 바꾸면 결과 페이지 페이월 가격이 바뀐다.
// 추후 A/B: activeTierIds 로 노출할 티어 조합을 실험.

export type ReportTier = {
  id: string;
  productSlug: string; // 결제 연결용 상품 slug (products 테이블)
  price: number;
  label: string;
  sub: string;
  highlight?: boolean; // 추천(앵커) 표시
};

export const REPORT_TIERS: ReportTier[] = [
  { id: "test", productSlug: "inbody", price: 4900, label: "테스트 리포트", sub: "핵심 패턴 1가지만 빠르게" },
  { id: "mini", productSlug: "crush-kit", price: 14900, label: "미니 리포트", sub: "관계·감정 집중 해석" },
  { id: "full", productSlug: "reunion-check", price: 34900, label: "전체 리포트", sub: "23개 패턴 전부 해금", highlight: true },
  { id: "premium", productSlug: "life-master", price: 149000, label: "프리미엄 확장", sub: "대운·2026 흐름·평생 로드맵" },
];

// 결과 페이지에서 기본 노출할 티어 id (실험용으로 좁히기 가능)
export const ACTIVE_TIER_IDS = ["test", "mini", "full", "premium"];

export function activeTiers(): ReportTier[] {
  return REPORT_TIERS.filter((t) => ACTIVE_TIER_IDS.includes(t.id));
}
