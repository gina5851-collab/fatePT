// FAQ 아코디언 — 네이티브 <details> 기반 (클라이언트 JS 불필요)
type Item = { q: string; a: string };

export function Faq({ items, tone = "light" }: { items: Item[]; tone?: "light" | "dark" }) {
  if (items.length === 0) return null;
  const light = tone === "light";
  return (
    <div className={`divide-y rounded-xl border ${light ? "divide-sf-line border-sf-line bg-sf-panel" : "divide-hairline border-hairline bg-surface-soft"}`}>
      {items.map((item, i) => (
        <details key={i} className="group px-5 py-4">
          <summary className={`flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-medium ${light ? "text-sf-ink" : "text-ink"}`}>
            {item.q}
            <span className={`shrink-0 transition-transform group-open:rotate-45 ${light ? "text-sf-amber-deep" : "text-body"}`}>＋</span>
          </summary>
          <p className={`mt-3 text-[13px] leading-relaxed ${light ? "text-sf-body" : "text-body"}`}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
