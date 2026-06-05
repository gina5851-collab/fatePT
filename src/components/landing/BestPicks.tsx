import Link from "next/link";
import { getBestMockProducts } from "@/config/products.mock";
import { formatKRW } from "@/lib/utils";
import { ProductMockBackdrop } from "@/components/products/ProductMockBackdrop";

// 홈 BEST 섹션 — 올영베러식 1위 큰 카드 + 2~5위 그리드.
export function BestPicks() {
  const items = getBestMockProducts(5);
  if (items.length === 0) return null;
  const [first, ...rest] = items;
  const restFour = rest.slice(0, 4);

  return (
    <section className="container py-10 border-t border-hairline">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1">WEEKLY BEST</p>
          <h2 className="text-[20px] md:text-[24px] font-bold text-ink">이번 주 BEST</h2>
        </div>
        <Link href="/products" className="text-[12px] text-mute hover:text-ink underline underline-offset-4">
          전체 →
        </Link>
      </div>

      <div className="grid md:grid-cols-[1.15fr_1fr] gap-4 items-stretch">
        {/* 1위 — 큰 카드 */}
        <Link href={`/products/${first.slug}`} className="group block">
          <div className="relative aspect-[4/5] md:aspect-[5/6] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]">
              <ProductMockBackdrop product={first} size="lg" showName={false} />
            </div>
            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
              <span className="rounded bg-amber-400 text-[#0c1322] text-[11px] font-extrabold px-2.5 py-1">BEST 1</span>
              {first.isSale ? (
                <span className="rounded bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5">특가</span>
              ) : null}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-[11px] text-mute">{first.brand}</p>
            <p className="text-[15px] font-bold text-ink leading-snug">{first.name}</p>
            <p className="mt-1 text-[12px] text-body line-clamp-1">{first.shortDescription}</p>
            <div className="mt-2 flex items-baseline gap-2">
              {first.originalPrice ? (
                <span className="text-[11px] font-mono text-mute line-through">{formatKRW(first.originalPrice)}</span>
              ) : null}
              <span className="text-[17px] font-mono font-bold text-ink">{formatKRW(first.price)}</span>
              {first.originalPrice ? (
                <span className="text-[12px] font-bold text-rose-500">
                  {Math.round((1 - first.price / first.originalPrice) * 100)}%
                </span>
              ) : null}
            </div>
            {typeof first.rating === "number" ? (
              <p className="mt-1 text-[11px] text-mute">
                <span className="text-amber-500">★ {first.rating.toFixed(1)}</span> ({first.reviewCount?.toLocaleString()})
              </p>
            ) : null}
          </div>
        </Link>

        {/* 2~5위 — 2x2 미니 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          {restFour.map((p, i) => (
            <Link key={p.slug} href={`/products/${p.slug}`} className="group block">
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                  <ProductMockBackdrop product={p} size="sm" showName={false} />
                </div>
                <span className="absolute top-2 left-2 z-10 rounded bg-ink text-canvas text-[10px] font-bold px-1.5 py-0.5">
                  {i + 2}위
                </span>
              </div>
              <p className="mt-2 text-[10px] text-mute">{p.brand}</p>
              <p className="text-[12px] font-medium text-ink leading-snug line-clamp-2 min-h-[2.4em]">{p.name}</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                {p.originalPrice ? (
                  <span className="text-[10px] font-mono text-mute line-through">{formatKRW(p.originalPrice)}</span>
                ) : null}
                <span className="text-[12px] font-mono font-bold text-ink">{formatKRW(p.price)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
