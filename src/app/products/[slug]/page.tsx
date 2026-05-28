import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { SajuForm } from "@/components/saju/SajuForm";
import { formatKRW, formatDate } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/env";
import { productsSeed } from "@/config/products.seed";
import { PRODUCT_COPY } from "@/config/product-copy";

type Product = { id: string; slug: string; name: string; description: string; price: number };
type Review = { id: string; rating: number; content: string; created_at: string };

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product | null;
  let reviews: Review[] | null = null;
  let user: Awaited<ReturnType<typeof getCurrentUser>> = null;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("id, slug, name, description, price")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    product = data;

    if (product) {
      const { data: r } = await supabase
        .from("reviews")
        .select("id, rating, content, created_at")
        .eq("product_id", product.id)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(5);
      reviews = r;
    }
    user = await getCurrentUser();
  } else {
    const seed = productsSeed.find((p) => p.slug === slug && p.is_active);
    product = seed ? { id: seed.slug, ...seed } : null;
  }

  if (!product) notFound();

  const copy = PRODUCT_COPY[slug];

  return (
    <div className="container py-12 max-w-2xl">
      {/* ── 헤더 ── */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-mono text-mute">PROGRAM / {product.slug}</p>
          {copy?.badge ? (
            <span className="text-[11px] font-semibold rounded-full bg-ink text-canvas px-2 py-0.5">{copy.badge}</span>
          ) : null}
        </div>

        {copy ? (
          <>
            <p className="text-xs text-body mb-1">{copy.positioning}</p>
            <h1 className="text-3xl font-semibold tracking-tight leading-snug">
              {copy.headline}
            </h1>
            <p className="mt-4 text-sm text-body leading-relaxed whitespace-pre-line">
              {copy.body}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-sm text-body">{product.description}</p>
          </>
        )}

        <div className="mt-5 flex items-baseline gap-2">
          {copy?.originalPrice ? (
            <span className="text-base font-mono text-mute line-through">{formatKRW(copy.originalPrice)}</span>
          ) : null}
          <span className="text-2xl font-mono font-medium text-ink">{formatKRW(product.price)}</span>
          {copy?.originalPrice ? (
            <span className="text-xs font-semibold text-ink">
              {Math.round((1 - product.price / copy.originalPrice) * 100)}% OFF
            </span>
          ) : null}
        </div>

        {copy && (
          <p className="mt-1 text-xs text-mute">{copy.disclaimer}</p>
        )}
      </header>

      {/* ── 결과지 구성 미리보기 ── */}
      {copy && (
        <section className="mb-10 rounded-lg border border-hairline bg-[#fafafa] p-5">
          <p className="text-xs font-semibold text-ink mb-3">📄 리포트에 포함되는 내용</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {copy.resultSections.map((s, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-body">
                <span className="text-mute font-mono">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-hairline">
            <p className="text-xs text-body whitespace-pre-line">{copy.priceJustification}</p>
          </div>
        </section>
      )}

      {/* ── 제공 항목 ── */}
      {copy && (
        <section className="mb-10">
          <p className="text-xs font-semibold text-ink mb-3">✓ 결제 후 받는 것</p>
          <ul className="space-y-1.5">
            {copy.deliverables.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-body">
                <span className="mt-0.5 text-ink">—</span>
                {d}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 사주 입력 폼 (결제 연결 — 수정 금지) ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ink">생년월일 입력</h2>
          <span className="text-xs text-mute bg-[#fafafa] border border-hairline rounded-full px-2.5 py-0.5">
            결제 후 바로 확인 가능
          </span>
        </div>
        <p className="text-xs text-body mb-4">정확할수록 더 정밀한 결과가 나옵니다.</p>
        <SajuForm productId={product.id} productSlug={product.slug} isLoggedIn={!!user} />
      </section>

      {/* ── 후기 ── */}
      {reviews && reviews.length > 0 && (
        <section className="mt-16 pt-10 border-t border-hairline">
          <h2 className="text-sm font-semibold mb-5 text-ink">최근 후기</h2>
          <ul className="divide-y divide-hairline border-y border-hairline">
            {reviews.map((r) => (
              <li key={r.id} className="py-5">
                <div className="flex items-center justify-between text-sm">
                  <span aria-label={`${r.rating}점`}>
                    <span className="text-ink">{"★".repeat(r.rating)}</span>
                    <span className="text-hairline-strong">{"★".repeat(5 - r.rating)}</span>
                  </span>
                  <span className="text-xs text-mute font-mono">{formatDate(r.created_at)}</span>
                </div>
                <p className="mt-2 text-sm text-charcoal leading-relaxed">{r.content}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
