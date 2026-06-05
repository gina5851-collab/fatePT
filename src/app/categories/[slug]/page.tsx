import Link from "next/link";
import { notFound } from "next/navigation";
import { G_CATEGORIES, findGCategory } from "@/config/categories";
import { getMockProductsByCategory } from "@/config/products.mock";
import { MockProductCard } from "@/components/products/MockProductCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return G_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = findGCategory(slug);
  return { title: c ? `${c.korean} (${c.english})` : "G 카테고리" };
}

// BrandG 카테고리별 상세 (Phase 2a).
// 상품 노출은 Phase 2c (products.category_slug 마이그레이션 + 25개 시드) 후 활성화.
// 그 전까지는 카테고리 소개 + 다른 G 카테고리 둘러보기 + 진단 진입.
export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = findGCategory(slug);
  if (!category) notFound();

  const otherCategories = G_CATEGORIES.filter((c) => c.slug !== category.slug);
  const products = getMockProductsByCategory(category.slug);

  return (
    <div className="brandg-shop">
    <div className="container py-12 max-w-2xl">
      {/* 카테고리 헤더 */}
      <header className="text-center mb-10">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">CATEGORY</p>
        <div className="text-5xl mb-4" aria-hidden>{category.emoji}</div>
        <h1 className="text-3xl font-bold text-ink">
          {category.korean}
          <span className="block mt-1 text-[15px] font-mono text-mute font-normal">{category.english}</span>
        </h1>
        <p className="mt-4 text-[14px] text-body leading-relaxed max-w-md mx-auto">
          {category.tagline}
        </p>
      </header>

      {/* 서브 카테고리 */}
      <section className="mb-12">
        <p className="text-[12px] font-semibold text-ink mb-3">이 G 안에는</p>
        <div className="flex flex-wrap gap-2">
          {category.subCategories.map((s) => (
            <span
              key={s}
              className="rounded-full border border-hairline bg-surface-soft px-3 py-1.5 text-[12px] text-body"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* 상품 노출 — mock 데이터 (데모용) */}
      {products.length > 0 ? (
        <section className="mb-12">
          <div className="flex items-end justify-between mb-4">
            <p className="text-[12px] font-semibold text-ink">{category.korean} 상품</p>
            <Link
              href={`/products?cat=${category.slug}`}
              className="text-[11px] text-mute hover:text-ink underline underline-offset-4"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-7">
            {products.map((p) => (
              <MockProductCard key={p.slug} product={p} variant="grid" />
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-12 rounded-2xl border border-hairline bg-surface-soft p-6 text-center">
          <p className="text-[12px] font-mono tracking-[0.2em] text-mute mb-2">COMING SOON</p>
          <p className="text-[14px] text-body leading-relaxed">
            {category.korean} 상품 라인업이 곧 열립니다.
          </p>
        </section>
      )}

      {/* 진단 안내 */}
      <section className="mb-12 rounded-2xl border border-hairline bg-surface-soft p-6 text-center">
        <p className="text-[12px] text-body leading-relaxed">
          내 G가 헷갈리면 — 진단부터 받아보세요. 맞춤 추천이 더 정확해져요.
        </p>
        <Link
          href="/start"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-[#0c1322] px-5 py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          내 G 찾기 시작 →
        </Link>
      </section>

      {/* 다른 G 둘러보기 */}
      <section>
        <p className="text-[12px] font-semibold text-ink mb-3">다른 G도 둘러보기</p>
        <div className="grid grid-cols-1 gap-2">
          {otherCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="flex items-center gap-3 rounded-xl border border-hairline bg-canvas px-4 py-3 hover:border-ink transition-colors"
            >
              <span className="text-xl shrink-0" aria-hidden>
                {c.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-[14px] font-semibold text-ink">{c.korean}</p>
                  <p className="text-[10px] font-mono text-mute">{c.english}</p>
                </div>
              </div>
              <span className="text-mute shrink-0 text-[13px]" aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10 text-center text-[12px] text-mute">
        <Link href="/categories" className="text-ink underline underline-offset-4 hover:text-body">
          ← 카테고리 전체로 돌아가기
        </Link>
      </p>
    </div>
    </div>
  );
}
