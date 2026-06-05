import { getMockProductsByCategory, type MockProduct } from "@/config/products.mock";
import { MockProductCard } from "./MockProductCard";

// 상품 상세 하단 — 같은 G 카테고리에서 3개 추천. 현재 상품 제외.
export function RelatedProducts({ product }: { product: MockProduct }) {
  const sibs = getMockProductsByCategory(product.category_slug).filter((p) => p.slug !== product.slug);
  if (sibs.length === 0) return null;
  const items = sibs.slice(0, 3);
  return (
    <section className="mb-8">
      <p className="text-[12px] font-semibold text-ink mb-3">함께 둘러본 G</p>
      <div className="grid grid-cols-3 gap-2.5">
        {items.map((p) => (
          <MockProductCard key={p.slug} product={p} variant="grid" />
        ))}
      </div>
    </section>
  );
}
