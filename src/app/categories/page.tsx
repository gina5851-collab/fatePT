import Link from "next/link";
import { G_CATEGORIES } from "@/config/categories";

export const metadata = { title: "G 카테고리" };

// BrandG 5G 카테고리 전체 목록 (정적 데이터, DB 의존 0).
// 카테고리별 상품 노출은 Phase 2c (products.category_slug 마이그레이션) 후 활성화.
export default function CategoriesPage() {
  return (
    <div className="brandg-shop">
    <div className="container py-12 max-w-2xl">
      <header className="text-center mb-10">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">CATEGORY</p>
        <h1 className="text-3xl font-bold text-ink leading-snug">
          5가지 G로 만나는
          <br />
          40+ 자기관리
        </h1>
        <p className="mt-4 text-sm text-body">
          내 일상에 필요한 G를 골라서 둘러보세요.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {G_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="block rounded-2xl border border-hairline bg-surface-soft p-6 hover:border-ink transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0" aria-hidden>
                {c.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <p className="text-[17px] font-bold text-ink">{c.korean}</p>
                  <p className="text-[11px] font-mono text-mute">{c.english}</p>
                </div>
                <p className="text-[13px] text-body mt-1.5 leading-relaxed">{c.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.subCategories.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-hairline px-2.5 py-0.5 text-[11px] text-mute"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-mute shrink-0" aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-[12px] text-mute">
        내 G가 어떤 건지 헷갈리면 — {" "}
        <Link href="/start" className="text-ink underline underline-offset-4 hover:text-body">
          내 G 찾기
        </Link>
        {" "} 진단으로 시작해보세요.
      </p>
    </div>
    </div>
  );
}
