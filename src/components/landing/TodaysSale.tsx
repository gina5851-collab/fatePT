import Link from "next/link";
import { getSaleMockProducts } from "@/config/products.mock";
import { formatKRW } from "@/lib/utils";
import { ProductMockBackdrop } from "@/components/products/ProductMockBackdrop";

// 홈 특가 섹션 — "오늘의 G 특가". 큰 카드 + 가격 강조.
export function TodaysSale() {
  const items = getSaleMockProducts(8);
  if (items.length === 0) return null;

  return (
    <section className="container py-12 border-t border-hairline">
      <div className="rounded-2xl bg-gradient-to-br from-rose-500 via-rose-600 to-amber-600 px-5 py-6 mb-5 text-white">
        <p className="text-[11px] font-mono tracking-[0.3em] opacity-80 mb-1">TODAY ONLY</p>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[24px] md:text-[28px] font-bold leading-snug">오늘의 G 특가</h2>
          <p className="text-[11px] opacity-90 text-right whitespace-nowrap">매일 0시 리프레시<br /><span className="opacity-70">한정 수량</span></p>
        </div>
      </div>

      <div className="-mx-4 px-4 overflow-x-auto">
        <div className="flex gap-3 pb-3">
          {items.map((p) => {
            const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
            return (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group block w-[180px] shrink-0"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                    <ProductMockBackdrop product={p} size="sm" showName={false} />
                  </div>
                  {discount > 0 ? (
                    <span className="absolute top-2 left-2 z-10 rounded bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 shadow">
                      {discount}% OFF
                    </span>
                  ) : null}
                </div>
                <p className="mt-2.5 text-[10px] text-mute">{p.brand}</p>
                <p className="text-[12px] font-medium text-ink leading-snug line-clamp-2 min-h-[2.4em]">{p.name}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  {p.originalPrice ? (
                    <span className="text-[10px] font-mono text-mute line-through">{formatKRW(p.originalPrice)}</span>
                  ) : null}
                  <span className="text-[14px] font-mono font-bold text-rose-500">{formatKRW(p.price)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
