import Link from "next/link";
import { getBestMockProducts } from "@/config/products.mock";
import { formatKRW } from "@/lib/utils";
import { MockProductCard } from "@/components/products/MockProductCard";
import { ProductMockBackdrop } from "@/components/products/ProductMockBackdrop";

// 홈 BEST 섹션 — 1위 cinematic + 2-6위 그리드 (올영베러식 BEST 흐름).
export function BestPicks() {
  const items = getBestMockProducts(7);
  if (items.length === 0) return null;
  const [first, ...rest] = items;
  const restToShow = rest.slice(0, 6);

  return (
    <section className="container py-12 border-t border-hairline">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1.5">WEEKLY BEST</p>
          <h2 className="text-[22px] md:text-[26px] font-bold text-ink">이번 주 가장 많이 담긴 G</h2>
        </div>
        <Link href="/products" className="text-[12px] text-mute hover:text-ink underline underline-offset-4">
          전체 →
        </Link>
      </div>

      {/* 1위 — cinematic hero */}
      <Link href={`/products/${first.slug}`} className="group block mb-5">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]">
            <ProductMockBackdrop product={first} size="lg" showName={false} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="rounded bg-amber-400 text-[#0c1322] text-[10px] font-bold px-2 py-0.5">BEST 1</span>
            {first.isSale ? (
              <span className="rounded bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5">특가</span>
            ) : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-[11px] opacity-80">{first.brand}</p>
            <p className="text-[17px] sm:text-[19px] font-bold leading-snug">{first.name}</p>
            <p className="mt-1 text-[12px] opacity-90 line-clamp-1">{first.shortDescription}</p>
            <div className="mt-2.5 flex items-baseline gap-2">
              {first.originalPrice ? (
                <span className="text-[12px] font-mono opacity-60 line-through">{formatKRW(first.originalPrice)}</span>
              ) : null}
              <span className="text-[18px] font-mono font-bold">{formatKRW(first.price)}</span>
              {first.originalPrice ? (
                <span className="text-[12px] font-bold text-amber-200">
                  {Math.round((1 - first.price / first.originalPrice) * 100)}%
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>

      {/* 2-7위 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8">
        {restToShow.map((p, i) => (
          <div key={p.slug} className="relative">
            <span className="absolute -top-1 -left-1 z-20 w-7 h-7 rounded-full bg-ink text-canvas text-[11px] font-bold flex items-center justify-center shadow">
              {i + 2}
            </span>
            <MockProductCard product={p} variant="grid" />
          </div>
        ))}
      </div>
    </section>
  );
}
