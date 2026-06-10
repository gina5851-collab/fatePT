import Link from "next/link";
import { LIFE_ISSUE_PLANS } from "@/config/life-issues";
import { findMockProduct } from "@/config/products.mock";
import { formatKRW } from "@/lib/utils";
import { ProductMockBackdrop } from "@/components/products/ProductMockBackdrop";

// "생활문제별 기획전" — 큰 매거진 카드 + 묶음 상품 미리보기.
export function LifeIssuePlans() {
  return (
    <section className="container py-12 border-t border-hairline">
      <div className="mb-5">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1.5">PLANS</p>
        <h2 className="text-[22px] md:text-[24px] font-bold text-ink">생활문제별 기획전</h2>
        <p className="mt-1 text-[13px] text-body">한 가지 문제를 끝까지 챙겨주는 묶음 큐레이션.</p>
      </div>

      <div className="space-y-5">
        {LIFE_ISSUE_PLANS.map((plan) => {
          const products = plan.productSlugs
            .map((s) => findMockProduct(s))
            .filter((x): x is NonNullable<typeof x> => !!x);
          if (products.length === 0) return null;
          return (
            <Link
              key={plan.id}
              href={`/categories/${plan.category_slug}`}
              className="group block overflow-hidden rounded-2xl border border-hairline bg-canvas hover:border-ink transition-colors"
            >
              <div className="grid md:grid-cols-[1.2fr_1.5fr]">
                {/* 커버 */}
                <div className={`relative aspect-[4/3] md:aspect-auto md:min-h-[220px] bg-gradient-to-br ${plan.cover}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_60%)]" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                    <p className="text-[10px] font-mono tracking-[0.3em] opacity-80">{plan.eyebrow}</p>
                    <p className="mt-1 text-[20px] md:text-[22px] font-bold leading-snug">{plan.title}</p>
                    <p className="mt-1.5 text-[12px] opacity-90 leading-relaxed line-clamp-2">{plan.body}</p>
                  </div>
                </div>

                {/* 상품 묶음 */}
                <div className="p-4 md:p-5">
                  <p className="text-[10px] font-mono tracking-[0.2em] text-mute mb-3">함께 담는 G {products.length}개</p>
                  <div className="grid grid-cols-3 gap-2">
                    {products.map((p) => (
                      <div key={p.slug} className="block">
                        <div className="relative aspect-square rounded-lg overflow-hidden">
                          <ProductMockBackdrop product={p} size="sm" showName={false} />
                        </div>
                        <p className="mt-1.5 text-[10px] text-mute line-clamp-1">{p.brand}</p>
                        <p className="text-[11px] font-medium text-ink leading-snug line-clamp-2 min-h-[2.4em]">{p.name}</p>
                        <p className="mt-0.5 text-[11px] font-mono font-semibold text-ink">{formatKRW(p.price)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-ink group-hover:underline underline-offset-4">
                    기획전 보러가기 →
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
