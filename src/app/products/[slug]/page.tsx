import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { getCatalogProduct, relatedProducts } from "@/config/catalog";
import { fetchDbProducts, resolvePrice } from "@/lib/catalog-db";
import { ProductDetailTemplate } from "@/components/product-detail/ProductDetailTemplate";
import { SajuForm } from "@/components/saju/SajuForm";
import { TarotOrderForm } from "@/components/tarot/TarotOrderForm";

type Review = { id: string; rating: number; content: string; created_at: string };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getCatalogProduct(slug);
  return { title: p?.displayName ?? "상품" };
}

// 공통 상품 상세 — 사주·타로 모두 카탈로그 + ProductDetailTemplate 으로 렌더링.
// 주문·결제 로직은 기존 SajuForm / TarotOrderForm 이 그대로 담당한다.
export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ source?: string }>;
}) {
  const { slug } = await params;
  const { source } = await searchParams;

  const catalog = getCatalogProduct(slug);
  if (!catalog) notFound();
  // 숨김 상품 직접 접근 → 목록으로 안내 (404 대신)
  if (!catalog.isPublished) redirect("/products");

  // DB 조회 — 가격/상품 id 원천 (읽기 전용). 데모 모드면 카탈로그 폴백.
  const related = relatedProducts(slug);
  const dbSlugs = [slug, ...related.map((r) => r.slug)];
  const dbMap = await fetchDbProducts(dbSlugs);
  const dbRow = dbMap.get(slug);

  // 운영 DB 에서 내려간(is_active=false) 상품은 노출하지 않음
  if (dbRow && !dbRow.is_active) redirect("/products");

  const price = resolvePrice(dbRow, catalog.priceHint);
  const isFree = price === 0;

  // 후기 (실데이터만) + 로그인 상태
  let reviews: Review[] = [];
  let isLoggedIn = false;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (dbRow) {
      const { data: r } = await supabase
        .from("reviews")
        .select("id, rating, content, created_at")
        .eq("product_id", dbRow.id)
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(5);
      reviews = r ?? [];
    }
    isLoggedIn = !!(await getCurrentUser());
  }

  const relatedEntries = related.map((r) => ({
    product: r,
    price: resolvePrice(dbMap.get(r.slug), r.priceHint),
  }));

  return (
    <ProductDetailTemplate product={catalog} price={price} related={relatedEntries} reviews={reviews}>
      {catalog.serviceType === "tarot" ? (
        isLoggedIn ? (
          <TarotOrderForm productSlug={catalog.slug} source={source ?? null} />
        ) : (
          <LoginGate redirectTo={`/products/${catalog.slug}`} />
        )
      ) : (
        <SajuForm
          productId={dbRow?.id ?? catalog.slug}
          productSlug={catalog.slug}
          isLoggedIn={isLoggedIn}
          isFree={isFree}
        />
      )}
    </ProductDetailTemplate>
  );
}

// 타로 폼은 로그인 필수(주문 API 401) — 기존 타로 상세와 동일한 로그인 유도 처리.
function LoginGate({ redirectTo }: { redirectTo: string }) {
  return (
    <div className="space-y-2">
      <a
        href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
        className="block w-full rounded-full bg-primary text-primary-foreground text-center text-sm font-medium py-3 hover:opacity-90 transition-opacity"
      >
        로그인하고 카드 뽑기
      </a>
      <p className="text-xs text-body text-center">
        결과는 결제 후 발급되는 링크와 마이페이지에서 확인할 수 있어요.
      </p>
    </div>
  );
}
