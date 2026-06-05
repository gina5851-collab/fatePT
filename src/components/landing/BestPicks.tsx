import Link from "next/link";
import { getBestMockProducts } from "@/config/products.mock";
import { MockProductCard } from "@/components/products/MockProductCard";

// 홈 BEST 섹션 — 주간 BEST 6개. mock 데이터 기반.
export function BestPicks() {
  const items = getBestMockProducts(6);
  return (
    <section className="container py-12 border-t border-hairline">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1.5">BEST</p>
          <h2 className="text-[20px] md:text-[22px] font-bold text-ink">이번 주 G가 고른 BEST</h2>
        </div>
        <Link href="/products" className="text-[12px] text-mute hover:text-ink underline underline-offset-4">
          전체 →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((p) => (
          <MockProductCard key={p.slug} product={p} variant="grid" />
        ))}
      </div>
    </section>
  );
}
