import { redirect } from "next/navigation";

// 구 타로 상세 URL 보존 — 통합 상품 상세(/products/[slug])로 이동.
// 기존 공유·광고 링크의 source/utm 쿼리는 유지해서 넘긴다.
// (/tarot/result/[publicToken] 결과 라우트는 별도 경로라 영향 없음)
export default async function TarotSlugRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") qs.set(k, v);
  }
  const query = qs.toString();
  redirect(`/products/${slug}${query ? `?${query}` : ""}`);
}
