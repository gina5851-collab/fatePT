import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { productsSeed } from "@/config/products.seed";
import { CinematicCard } from "@/components/products/CinematicCard";

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
      <header className="mb-10 text-center">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">SHOP</p>
        <h1 className="text-[26px] md:text-[30px] font-bold text-ink leading-snug">
          오늘의 나에게 필요한 G
        </h1>
        <p className="mt-3 text-[13px] text-body">
          40+ 자기관리 루틴, 한 줄씩 검수해서 골라 담았어요.
        </p>
        <p className="mt-4 text-[12px] text-mute">
          내 G가 헷갈리면 —{" "}
          <Link href="/categories" className="text-ink underline underline-offset-4 hover:text-body">
            5가지 G 카테고리 둘러보기
          </Link>
        </p>
      </header>

      {!products || products.length === 0 ? (
        <p className="text-sm text-body text-center">상품이 곧 열립니다.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <CinematicCard key={p.slug} slug={p.slug} name={p.name} price={p.price} />
          ))}
        </div>
      )}
    </div>
  );
}
