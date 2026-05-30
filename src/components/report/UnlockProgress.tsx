import type { ReportItem, ReportItemCategory } from "@/lib/saju/report/types";

// 해금 진행률 + 카테고리별 잠금 수. "이미 2개 봤고, 22개 남았다"는 결핍 강화.
export function UnlockProgress({
  displayName,
  items,
}: {
  displayName: string;
  items: ReportItem[];
}) {
  const free = items.filter((i) => i.free).length;
  const total = items.length;
  const pct = Math.round((free / total) * 100);

  // 카테고리별 (free / total)
  const cats: ReportItemCategory[] = ["나", "관계", "돈·일", "흐름", "회복"];
  const byCat = cats.map((cat) => {
    const all = items.filter((i) => i.category === cat);
    const opened = all.filter((i) => i.free).length;
    return { cat, opened, total: all.length };
  }).filter((x) => x.total > 0);

  return (
    <section className="rounded-2xl border border-hairline bg-surface-soft p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold text-ink">리포트 해금</p>
        <p className="text-[13px] font-mono text-ink tabular-nums">
          <span className="text-amber-300">{free}</span> / {total} 항목
        </p>
      </div>
      <div className="h-2 rounded-full bg-hairline overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[11px] text-mute mb-4">
        전체 리포트 해금 시 {total - free}개 패턴을 모두 확인할 수 있어요
      </p>

      <ul className="space-y-2">
        {byCat.map(({ cat, opened, total: t }) => (
          <li
            key={cat}
            className="flex items-center justify-between rounded-lg border border-hairline bg-canvas/40 px-3 py-2.5"
          >
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-mute text-[12px]">🔒</span>
              <span className="text-[13px] text-ink">{categoryLabel(cat)}</span>
            </div>
            <span className="text-[11px] font-mono text-mute tabular-nums">
              {opened}/{t}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center text-[11px] text-body">
        {displayName}님이 이미 본 항목은 <span className="font-semibold text-ink">{free}개</span>,
        아직 열어보지 않은 항목은 <span className="font-semibold text-ink">{total - free}개</span> 남아 있어요.
      </p>
    </section>
  );
}

function categoryLabel(cat: ReportItemCategory): string {
  switch (cat) {
    case "나": return "타고난 기질과 회복 기준";
    case "관계": return "관계의 기술";
    case "돈·일": return "재물과 일의 흐름";
    case "흐름": return "올해와 다음 시기";
    case "회복": return "실전 회복 처방";
  }
}
