import Link from "next/link";
import { formatKRW } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { productsSeed } from "@/config/products.seed";
import { PRODUCT_COPY } from "@/config/product-copy";

// Ollama: thin-border cards on the same canvas — no shadow, hairline only.
export async function ProductLineup() {
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

  if (!products || products.length === 0) {
    return (
      <section className="container py-12 text-center">
        <p className="text-sm text-body">
          상품이 아직 없어요. <code className="font-mono text-ink">pnpm seed:products</code> 를 실행해 주세요.
        </p>
      </section>
    );
  }

  return (
    <section className="container py-16 border-t border-hairline">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-10">
        상품 라인업
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => {
          const copy = PRODUCT_COPY[p.slug];
          return (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className={`group block rounded-lg border bg-canvas p-4 md:p-6 transition-colors hover:border-ink ${copy?.badge ? "border-ink" : "border-hairline"}`}
          >
            <div className="flex items-center gap-1.5">
              <p className="text-sm md:text-base font-semibold text-ink">{p.name}</p>
              {copy?.badge ? (
                <span className="text-[10px] font-semibold rounded-full bg-ink text-canvas px-1.5 py-0.5">{copy.badge}</span>
              ) : null}
            </div>
            <p className="mt-1.5 text-xs md:text-sm text-body leading-relaxed line-clamp-2">
              {p.description}
            </p>
            <div className="mt-3 md:mt-5 flex items-baseline gap-1.5">
              {copy?.originalPrice ? (
                <span className="text-xs font-mono text-mute line-through">{formatKRW(copy.originalPrice)}</span>
              ) : null}
              <span className="text-base md:text-lg font-mono font-medium text-ink">{p.price === 0 ? "무료" : formatKRW(p.price)}</span>
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
