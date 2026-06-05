import Link from "next/link";
import { getJinasPicks } from "@/config/products.mock";
import { formatKRW } from "@/lib/utils";
import { ProductMockBackdrop } from "@/components/products/ProductMockBackdrop";
import { MockProductCard } from "@/components/products/MockProductCard";

// "지나스 장바구니" 공개 — 큐레이터 사장님이 직접 담은 G.
// 매거진식 hero 1 + 사이드 그리드.
export function JinasCart() {
  const items = getJinasPicks(5);
  if (items.length === 0) return null;
  const [feature, ...rest] = items;

  return (
    <section className="container py-12 border-t border-hairline">
      <div className="grid md:grid-cols-[1.05fr_1fr] gap-5 items-stretch">
        {/* 좌측 hero feature */}
        <Link href={`/products/${feature.slug}`} className="group relative block rounded-2xl overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[420px]">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]">
            <ProductMockBackdrop product={feature} size="lg" showName={false} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/10" />
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5">
            <span className="rounded-full bg-white/95 text-ink text-[10px] font-bold px-2.5 py-1">지나 PICK</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-[11px] tracking-[0.3em] font-mono opacity-80">JINA&apos;S CART</p>
            <p className="mt-1 text-[20px] md:text-[22px] font-bold leading-snug">지나스 장바구니 공개</p>
            <p className="mt-1 text-[12px] opacity-90 line-clamp-2">{feature.shortDescription}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-[#0c1322] text-[12px] font-bold px-3.5 py-1.5">
              지나의 픽 보기 →
            </div>
          </div>
        </Link>

        {/* 우측 미니 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          {rest.slice(0, 4).map((p) => (
            <div key={p.slug} className="block">
              <MockProductCard product={p} variant="grid" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-hairline bg-surface-soft px-5 py-4">
        <p className="text-[13px] text-body leading-relaxed">
          <span className="font-semibold text-ink">왜 지나가 골랐어요?</span><br />
          요즘 지나가 매일 쓰고, 친구한테도 권한 거. 마진 안 보고 마음으로 담은 G만 모았어요.
        </p>
      </div>
    </section>
  );
}
