// FAQ 아코디언 — 네이티브 <details> 기반 (클라이언트 JS 불필요), 열림 애니메이션 포함
type Item = { q: string; a: string };

export function Faq({ items, tone = "light" }: { items: Item[]; tone?: "light" | "dark" }) {
  if (items.length === 0) return null;
  const light = tone === "light";
  return (
    <div
      className={`divide-y rounded-2xl border ${
        light ? "divide-sf-line border-sf-line bg-sf-panel" : "divide-white/10 border-white/10 bg-white/[0.04]"
      }`}
    >
      {items.map((item, i) => (
        <details key={i} className="group px-6 md:px-7 py-5">
          <summary
            className={`flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] md:text-[17px] font-bold ${
              light ? "text-sf-ink" : "text-white"
            }`}
          >
            {item.q}
            <span
              className={`shrink-0 text-[18px] transition-transform duration-200 group-open:rotate-45 ${
                light ? "text-sf-amber-deep" : "text-sf-gold"
              }`}
            >
              ＋
            </span>
          </summary>
          <p className={`sf-faq-body mt-3.5 text-[14px] md:text-[15px] leading-[1.8] ${light ? "text-sf-body" : "text-[#b9c3d9]"}`}>
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
