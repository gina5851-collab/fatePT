import Link from "next/link";
import { BRANDG_MOCK_PRODUCTS, getMockProductsByCategory } from "@/config/products.mock";
import { G_CATEGORIES, findGCategory } from "@/config/categories";
import { MockProductCard } from "@/components/products/MockProductCard";

export const metadata = { title: "상품" };

// BrandG 데모 상품 그리드 — mock 25개 + 카테고리 필터 (?cat=slug).
// DB/결제 무관 — 실제 INSERT 는 Phase 2c (별도 사전 승인).
export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ cat?: string }>;
}) {
  const { cat } = (await searchParams) ?? {};
  const active = cat && findGCategory(cat) ? cat : null;
  const items = active ? getMockProductsByCategory(active) : BRANDG_MOCK_PRODUCTS;
  const activeCat = active ? findGCategory(active) : null;

  return (
    <div className="container py-10 max-w-[1080px]">
      <header className="mb-7 text-center">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">SHOP</p>
        <h1 className="text-[26px] md:text-[30px] font-bold text-ink leading-snug">
          {activeCat ? activeCat.korean : "오늘의 나에게 필요한 G"}
        </h1>
        <p className="mt-3 text-[13px] text-body">
          {activeCat ? activeCat.tagline : "40+ 자기관리 루틴, 한 줄씩 검수해서 골라 담았어요."}
        </p>
      </header>

      {/* 카테고리 chip 필터 */}
      <div className="-mx-4 px-4 overflow-x-auto mb-8">
        <div className="flex gap-2 pb-2 whitespace-nowrap">
          <FilterChip href="/products" label="전체" active={!active} />
          {G_CATEGORIES.map((c) => (
            <FilterChip
              key={c.slug}
              href={`/products?cat=${c.slug}`}
              label={`${c.emoji} ${c.korean}`}
              active={active === c.slug}
            />
          ))}
        </div>
      </div>

      {/* 상품 그리드 */}
      {items.length === 0 ? (
        <p className="text-center py-12 text-sm text-body">이 G의 상품은 곧 열려요.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8">
          {items.map((p) => (
            <MockProductCard key={p.slug} product={p} variant="grid" />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-[12px] text-mute mb-3">내 G가 헷갈리면 —</p>
        <Link
          href="/start"
          className="inline-flex rounded-full bg-amber-400 text-[#0c1322] px-5 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          내 G 찾기 진단 시작 →
        </Link>
      </div>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-medium border transition-colors ${
        active
          ? "bg-ink text-canvas border-ink"
          : "bg-canvas text-body border-hairline hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}
