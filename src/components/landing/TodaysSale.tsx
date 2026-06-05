import Link from "next/link";
import { getSaleMockProducts } from "@/config/products.mock";
import { MockProductCard } from "@/components/products/MockProductCard";

// 홈 특가 섹션 — "오늘의 G 특가". mock 데이터에서 isSale 만 추출.
export function TodaysSale() {
  const items = getSaleMockProducts(8);
  return (
    <section className="container py-12 border-t border-hairline">
      <div className="rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/40 dark:via-amber-950/40 dark:to-orange-950/40 px-5 py-6 mb-5">
        <p className="text-[11px] font-mono tracking-[0.3em] text-rose-500 mb-1">TODAY ONLY</p>
        <h2 className="text-[22px] md:text-[24px] font-bold text-ink leading-snug">오늘의 G 특가</h2>
        <p className="mt-1.5 text-[12px] text-body">매일 0시 리프레시 · 한정 수량</p>
      </div>

      <div className="-mx-4 px-4 overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {items.map((p) => (
            <MockProductCard key={p.slug} product={p} variant="compact" />
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <Link href="/products" className="text-[12px] text-mute hover:text-ink underline underline-offset-4">
          특가 전체 보기 →
        </Link>
      </div>
    </section>
  );
}
