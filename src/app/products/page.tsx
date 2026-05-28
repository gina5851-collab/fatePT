import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatKRW } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/env";
import { productsSeed } from "@/config/products.seed";
import { PRODUCT_COPY } from "@/config/product-copy";

export const metadata = { title: "상품" };

export default async function ProductsPage() {
  let products: { slug: string; name: string; description: string; price: number }[] | null;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("slug, name, description, price")
      .eq("is_active", true)
      .order("display_order", { ascending: true });
    products = data;
  } else {
    products = productsSeed
      .filter((p) => p.is_active)
      .sort((a, b) => a.display_order - b.display_order)
      .map(({ slug, name, description, price }) => ({ slug, name, description, price }));
  }

  return (
    <div className="container py-12">
      <header className="mb-10">
        <p className="text-xs font-mono text-mute mb-2">PRODUCTS</p>
        <h1 className="text-3xl font-semibold tracking-tight">상품</h1>
        <p className="mt-2 text-sm text-body">가볍게 시작해서 깊이 있게 들어가세요.</p>
      </header>

      {!products || products.length === 0 ? (
        <p className="text-sm text-body">상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const copy = PRODUCT_COPY[p.slug];
            return (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className={`group block rounded-lg border bg-canvas p-6 transition-colors hover:border-ink ${copy?.badge ? "border-ink" : "border-hairline"}`}
            >
              <div className="flex items-center gap-1.5">
                <p className="text-base font-semibold text-ink">{p.name}</p>
                {copy?.badge ? (
                  <span className="text-[10px] font-semibold rounded-full bg-ink text-canvas px-1.5 py-0.5">{copy.badge}</span>
                ) : null}
              </div>
              <p className="mt-1.5 text-sm text-body leading-relaxed line-clamp-2">
                {p.description}
              </p>
              <div className="mt-5 flex items-baseline gap-1.5">
                {copy?.originalPrice ? (
                  <span className="text-xs font-mono text-mute line-through">{formatKRW(copy.originalPrice)}</span>
                ) : null}
                <span className="text-lg font-mono font-medium text-ink">{formatKRW(p.price)}</span>
              </div>
            </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
