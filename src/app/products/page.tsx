import Link from "next/link";
import {
  publishedProducts,
  CONCERN_LABEL,
  type CatalogProduct,
  type ConcernTag,
} from "@/config/catalog";
import { fetchDbProducts, resolvePrice } from "@/lib/catalog-db";
import { ProductCard } from "@/components/storefront/ProductCard";

export const metadata = { title: "전체 상품" };

type TabKey = "all" | "saju" | "tarot" | ConcernTag;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "saju", label: "사주" },
  { key: "tarot", label: "타로" },
  { key: "love", label: CONCERN_LABEL.love },
  { key: "reunion", label: CONCERN_LABEL.reunion },
  { key: "money", label: CONCERN_LABEL.money },
  { key: "self", label: CONCERN_LABEL.self },
  { key: "daily", label: CONCERN_LABEL.daily },
];

function filterByTab(products: CatalogProduct[], tab: TabKey): CatalogProduct[] {
  if (tab === "all") return products;
  if (tab === "saju" || tab === "tarot") return products.filter((p) => p.serviceType === tab);
  return products.filter((p) => p.concerns.includes(tab));
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab: TabKey = TABS.some((t) => t.key === rawTab) ? (rawTab as TabKey) : "all";

  const products = publishedProducts();
  const dbMap = await fetchDbProducts(products.map((p) => p.slug));
  // 운영 DB 에서 내려간 상품은 목록에서도 제외
  const visible = filterByTab(
    products.filter((p) => {
      const row = dbMap.get(p.slug);
      return !row || row.is_active;
    }),
    tab,
  );

  return (
    <div className="bg-sf-bg min-h-screen">
      {/* 헤더 밴드 */}
      <div className="bg-sf-navy border-b border-white/5">
        <div className="container py-12 md:py-16">
          <p className="text-[12px] font-bold tracking-[0.25em] text-sf-gold mb-2.5">ALL PRODUCTS</p>
          <h1 className="text-[30px] md:text-[40px] font-extrabold tracking-tight text-white">전체 상품</h1>
          <p className="mt-3 text-[15px] md:text-[16px] text-[#aab6cf]">
            가볍게는 1,000원 타로 한 장부터, 깊게는 전체 사주 리포트까지. 지금 고민에 맞게 고르세요.
          </p>
        </div>
      </div>

      <div className="container py-10 md:py-14">
        {/* 고민별 탭 */}
        <nav className="flex flex-wrap gap-2 mb-10" aria-label="상품 분류">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <Link
                key={t.key}
                href={t.key === "all" ? "/products" : `/products?tab=${t.key}`}
                className={`px-5 h-11 inline-flex items-center rounded-full text-[14px] font-bold border transition-colors ${
                  active
                    ? "bg-sf-navy text-sf-gold border-sf-navy"
                    : "bg-sf-panel text-sf-ink border-sf-line hover:border-sf-navy"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        {visible.length === 0 ? (
          <p className="py-20 text-center text-[15px] text-sf-body">이 분류의 상품을 준비 중이에요.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((p) => (
              <ProductCard key={p.slug} product={p} price={resolvePrice(dbMap.get(p.slug), p.priceHint)} />
            ))}
          </div>
        )}

        {/* 하단 무료 진입 */}
        <div className="mt-16 md:mt-24 rounded-3xl bg-sf-navy p-9 md:p-12 text-center">
          <p className="text-[19px] md:text-[24px] font-extrabold text-white mb-2">뭘 골라야 할지 모르겠다면</p>
          <p className="text-[14px] md:text-[15px] text-[#aab6cf] mb-7">
            1분 무료 진단으로 내 패턴의 큰 그림부터 확인해 보세요.
          </p>
          <Link
            href="/start"
            className="inline-block rounded-2xl bg-sf-amber px-10 py-4 text-[15px] font-extrabold text-sf-navy hover:opacity-90 transition-opacity"
          >
            무료로 먼저 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
