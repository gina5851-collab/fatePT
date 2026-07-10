import Link from "next/link";
import { formatKRW } from "@/lib/utils";
import type { CatalogProduct } from "@/config/catalog";
import { productTheme, type ArtKind } from "@/config/product-themes";
import {
  SajuWheel,
  TarotFan,
  ReunionLines,
  CrushOrbit,
  MeasureGrid,
  GateArch,
} from "@/components/storefront/graphics";

type Variant = "featured" | "standard" | "compact";

type Props = {
  product: CatalogProduct;
  price: number; // DB 우선으로 해석된 표시 가격
  variant?: Variant;
};

function Art({ kind, className }: { kind: ArtKind; className: string }) {
  switch (kind) {
    case "wheel":
      return <SajuWheel className={className} />;
    case "tarot-1":
      return <TarotFan count={1} className={className} />;
    case "tarot-3":
      return <TarotFan count={3} className={className} />;
    case "tarot-10":
      return <TarotFan count={10} className={className} />;
    case "reunion":
      return <ReunionLines className={className} />;
    case "crush":
      return <CrushOrbit className={className} />;
    case "measure":
      return <MeasureGrid className={className} />;
    case "gate":
      return <GateArch className={className} />;
  }
}

function DeliveryPill({ product: p, dark = true }: { product: CatalogProduct; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        dark ? "bg-white/10 text-[#dfe6f5] border border-white/15" : "bg-sf-panel-soft text-sf-body border border-sf-line"
      }`}
    >
      {p.delivery.mode === "auto" ? "⚡" : "✍️"} {p.delivery.timeText}
    </span>
  );
}

// 상품 카드 시스템 — 전부 흰 박스가 되지 않도록 상품별 테마 배경 + 자체 그래픽 사용.
export function ProductCard({ product: p, price, variant = "standard" }: Props) {
  if (variant === "featured") return <FeaturedCard product={p} price={price} />;
  if (variant === "compact") return <CompactCard product={p} price={price} />;
  return <StandardCard product={p} price={price} />;
}

/** 대표 상품 — 세로형 대형 비주얼 카드 (4:5) */
function FeaturedCard({ product: p, price }: { product: CatalogProduct; price: number }) {
  const t = productTheme(p.slug);
  return (
    <Link
      href={`/products/${p.slug}`}
      className={`group relative flex flex-col justify-end overflow-hidden rounded-3xl ${t.bg} aspect-[4/5] p-7 md:p-8 border border-white/10 transition-all duration-300 hover:border-sf-amber/60 hover:sf-glow hover:-translate-y-1`}
    >
      {/* 배경 그래픽 */}
      <div className="absolute inset-x-0 top-0 h-[62%] flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.06]">
        <Art
          kind={t.art}
          className={t.art.startsWith("tarot") ? "w-[70%] max-w-[280px]" : "w-[92%] max-w-[360px] h-auto opacity-90"}
        />
      </div>
      {/* 하단 가독성 그라데이션 */}
      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[11px] font-bold tracking-wide ${t.accentText}`}>{t.categoryLabel}</span>
          {p.badge ? (
            <span className="text-[11px] font-bold rounded-full bg-sf-amber text-sf-navy px-2 py-0.5">{p.badge}</span>
          ) : null}
        </div>
        <p className="text-[24px] md:text-[26px] font-extrabold text-white leading-tight">{p.displayName}</p>
        <p className="mt-2 text-[14px] text-[#c6cfe2] leading-relaxed">{p.shortDescription}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-mono font-bold text-white">{price === 0 ? "무료" : formatKRW(price)}</span>
            {p.originalPrice && p.originalPrice > price ? (
              <span className="text-[12px] font-mono text-white/40 line-through">{formatKRW(p.originalPrice)}</span>
            ) : null}
          </div>
          <DeliveryPill product={p} />
        </div>
        <span className="mt-5 block w-full rounded-xl bg-sf-amber py-3 text-center text-[14px] font-bold text-sf-navy group-hover:opacity-95 transition-opacity">
          자세히 보기 →
        </span>
      </div>
    </Link>
  );
}

/** 카테고리 상품 카드 — 상단 비주얼 + 하단 정보 */
function StandardCard({ product: p, price }: { product: CatalogProduct; price: number }) {
  const t = productTheme(p.slug);
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sf-line bg-sf-panel transition-all duration-300 hover:border-sf-amber hover:shadow-[0_10px_36px_rgba(20,35,63,0.14)] hover:-translate-y-0.5"
    >
      {/* 비주얼 헤더 */}
      <div className={`relative h-40 md:h-44 ${t.bg} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.07]">
          <Art
            kind={t.art}
            className={t.art.startsWith("tarot") ? "w-[46%] max-w-[150px] translate-y-3" : "w-[86%] h-auto opacity-90"}
          />
        </div>
        <div className="absolute left-4 top-3.5 flex items-center gap-1.5">
          <span className={`text-[11px] font-bold tracking-wide ${t.accentText}`}>{t.categoryLabel}</span>
          {p.badge ? (
            <span className="text-[10px] font-bold rounded-full bg-sf-amber text-sf-navy px-2 py-0.5">{p.badge}</span>
          ) : null}
        </div>
      </div>

      {/* 정보 */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[19px] md:text-[21px] font-extrabold text-sf-ink leading-snug">{p.displayName}</p>
        <p className="mt-1.5 text-[13.5px] text-sf-body leading-relaxed">{p.shortDescription}</p>
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[19px] font-mono font-bold text-sf-ink">{price === 0 ? "무료" : formatKRW(price)}</span>
            {p.originalPrice && p.originalPrice > price ? (
              <span className="text-[11px] font-mono text-sf-mute line-through">{formatKRW(p.originalPrice)}</span>
            ) : null}
          </div>
          <DeliveryPill product={p} dark={false} />
        </div>
        <span className="mt-3 text-[13px] font-bold text-sf-amber-deep group-hover:underline underline-offset-4">
          자세히 보기 →
        </span>
      </div>
    </Link>
  );
}

/** 연관·추천 소형 카드 */
function CompactCard({ product: p, price }: { product: CatalogProduct; price: number }) {
  const t = productTheme(p.slug);
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-sf-line bg-sf-panel p-4 transition-colors hover:border-sf-amber"
    >
      <div className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ${t.bg} flex items-center justify-center`}>
        <Art kind={t.art} className={t.art.startsWith("tarot") ? "w-9 translate-y-1" : "w-14 h-auto"} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold text-sf-ink truncate">{p.displayName}</p>
        <p className="text-[12px] text-sf-mute truncate">{p.shortDescription}</p>
        <p className="mt-1 text-[14px] font-mono font-bold text-sf-ink">
          {price === 0 ? "무료" : formatKRW(price)}
          <span className="ml-2 text-[11px] font-sans font-medium text-sf-mute">{p.delivery.timeText}</span>
        </p>
      </div>
      <span className="text-sf-amber-deep">→</span>
    </Link>
  );
}
