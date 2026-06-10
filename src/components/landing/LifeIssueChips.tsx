import Link from "next/link";
import { LIFE_ISSUES } from "@/config/life-issues";

// Hero 직후 "지금 무슨 일이 있나요?" 빠른 진입 chip 8개.
// 클릭 시 해당 G 카테고리로 이동.
export function LifeIssueChips() {
  return (
    <section className="container pb-2 pt-1">
      <p className="text-center text-[12px] text-mute mb-3">지금 가장 답답한 거 하나만 골라봐요</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {LIFE_ISSUES.map((it) => (
          <Link
            key={it.id}
            href={`/categories/${it.category_slug}`}
            className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-soft px-3 py-2.5 hover:border-ink transition-colors"
          >
            <span className="text-base shrink-0" aria-hidden>{it.emoji}</span>
            <span className="text-[12px] text-ink leading-tight line-clamp-2">{it.issue}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
