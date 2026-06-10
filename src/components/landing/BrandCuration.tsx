import Link from "next/link";
import { getBrandMockProducts } from "@/config/products.mock";
import { ProductMockBackdrop } from "@/components/products/ProductMockBackdrop";

// 브랜드 큐레이션 — G.LAB (자체 라인) + 지나 PICK (큐레이션) 두 패널.
const PANELS = [
  {
    brand: "G.LAB",
    eyebrow: "OWN LINE",
    title: "G.LAB",
    body: "BrandG 자체 개발 라인. 40+ 컨디션에 맞춘 농도·자극·향.",
    accent: "bg-ink text-canvas",
  },
  {
    brand: "지나 PICK",
    eyebrow: "CURATED",
    title: "지나 PICK",
    body: "마진보다 마음. 지나가 매일 쓰고 친구한테 권한 것만.",
    accent: "bg-amber-400 text-[#0c1322]",
  },
];

export function BrandCuration() {
  return (
    <section className="container py-12 border-t border-hairline">
      <div className="mb-5">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1.5">BRANDS</p>
        <h2 className="text-[22px] md:text-[24px] font-bold text-ink">BrandG가 고른 두 줄기</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {PANELS.map((panel) => {
          const items = getBrandMockProducts(panel.brand, 4);
          if (items.length === 0) return null;
          return (
            <div key={panel.brand} className="rounded-2xl border border-hairline bg-surface-soft p-5">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="text-[10px] font-mono tracking-[0.3em] text-mute">{panel.eyebrow}</p>
                  <p className="text-[20px] font-extrabold text-ink mt-0.5">{panel.title}</p>
                  <p className="mt-1 text-[12px] text-body leading-relaxed">{panel.body}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold rounded-full px-2.5 py-1 ${panel.accent}`}>
                  {items.length}+ 상품
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {items.map((p) => (
                  <Link key={p.slug} href={`/products/${p.slug}`} className="group block">
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.05]">
                        <ProductMockBackdrop product={p} size="sm" showName={false} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
