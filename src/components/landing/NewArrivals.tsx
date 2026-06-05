import Link from "next/link";
import { getNewMockProducts } from "@/config/products.mock";
import { MockProductCard } from "@/components/products/MockProductCard";

// 신상 라인업 — isNew 상품.
export function NewArrivals() {
  const items = getNewMockProducts(6);
  if (items.length === 0) return null;

  return (
    <section className="container py-12 border-t border-hairline">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1.5">NEW IN</p>
          <h2 className="text-[22px] md:text-[24px] font-bold text-ink">막 도착한 새 G</h2>
          <p className="mt-1 text-[13px] text-body">이번 주에 처음 입고된 라인업.</p>
        </div>
        <Link href="/products" className="text-[12px] text-mute hover:text-ink underline underline-offset-4">
          전체 →
        </Link>
      </div>

      <div className="-mx-4 px-4 overflow-x-auto">
        <div className="flex gap-3 pb-3">
          {items.map((p) => (
            <div key={p.slug} className="w-[180px] shrink-0">
              <MockProductCard product={p} variant="grid" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
