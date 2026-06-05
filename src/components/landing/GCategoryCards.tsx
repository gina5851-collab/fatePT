import Link from "next/link";
import { G_CATEGORIES } from "@/config/categories";

// BrandG 5G 카테고리 카드 — 홈 hero 직후 노출.
// 카테고리 데이터는 src/config/categories.ts 단일 소스.
export function GCategoryCards() {
  return (
    <section className="container py-12 border-t border-hairline">
      <div className="text-center mb-8">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">CATEGORY</p>
        <h2 className="text-[20px] md:text-[24px] font-bold text-ink leading-snug">
          내 일상에 필요한 G를 골라보세요
        </h2>
        <p className="mt-2 text-[13px] text-body">
          5가지 G로 만나는 40+ 자기관리 루틴
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 max-w-[420px] mx-auto">
        {G_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="flex items-center gap-4 rounded-xl border border-hairline bg-surface-soft p-4 hover:border-ink transition-colors"
          >
            <span className="text-2xl shrink-0" aria-hidden>
              {c.emoji}
            </span>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-baseline gap-2">
                <p className="text-[15px] font-semibold text-ink">{c.korean}</p>
                <p className="text-[11px] font-mono text-mute">{c.english}</p>
              </div>
              <p className="text-[12px] text-body mt-0.5">{c.subCategories.slice(0, 3).join("·")}</p>
            </div>
            <span className="text-mute shrink-0" aria-hidden>→</span>
          </Link>
        ))}
      </div>

      <div className="text-center mt-6">
        <Link
          href="/categories"
          className="text-[12px] text-mute hover:text-ink underline underline-offset-4"
        >
          카테고리 전체 보기 →
        </Link>
      </div>
    </section>
  );
}
