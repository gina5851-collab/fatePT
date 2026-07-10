import Link from "next/link";
import { formatKRW } from "@/lib/utils";
import type { CatalogProduct } from "@/config/catalog";

type Props = {
  product: CatalogProduct;
  price: number; // DB 우선으로 해석된 표시 가격
  compact?: boolean;
};

// 라이트(아이보리) 테마 상품 카드 — 카드 전체 클릭.
export function ProductCard({ product: p, price, compact = false }: Props) {
  const isTarot = p.serviceType === "tarot";
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group flex flex-col rounded-xl border border-sf-line bg-sf-panel p-5 transition-all hover:border-sf-amber hover:shadow-[0_2px_16px_rgba(20,35,63,0.08)]"
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${
            isTarot ? "bg-sf-navy text-sf-amber" : "bg-sf-panel-soft text-sf-ink"
          }`}
        >
          {isTarot ? "타로" : "사주"}
        </span>
        {p.badge ? (
          <span className="text-[11px] font-semibold rounded-full bg-sf-amber text-sf-navy px-2 py-0.5">
            {p.badge}
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-[16px] font-semibold text-sf-ink leading-snug">{p.displayName}</p>
      <p className="mt-1 text-[13px] text-sf-body leading-relaxed">{p.shortDescription}</p>

      <div className={`flex items-baseline gap-2 ${compact ? "mt-3" : "mt-4"}`}>
        <span className="text-[17px] font-mono font-semibold text-sf-ink">
          {price === 0 ? "무료" : formatKRW(price)}
        </span>
        {p.originalPrice && p.originalPrice > price ? (
          <span className="text-xs font-mono text-sf-mute line-through">{formatKRW(p.originalPrice)}</span>
        ) : null}
      </div>
      <p className="mt-1 text-[11px] text-sf-mute">
        {p.delivery.mode === "auto" ? "⚡ " : "✍️ "}
        {p.delivery.timeText}
      </p>

      <span className="mt-3 text-[12px] font-medium text-sf-amber-deep group-hover:underline underline-offset-4">
        자세히 보기 →
      </span>
    </Link>
  );
}
