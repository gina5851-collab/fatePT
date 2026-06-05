import Link from "next/link";
import { formatKRW } from "@/lib/utils";
import type { MockProduct } from "@/config/products.mock";
import { ProductMockBackdrop } from "./ProductMockBackdrop";

type Variant = "grid" | "compact" | "hero" | "large";

// BrandG mock 상품 카드 — 그리드 / 가로 스크롤 슬라이드용.
// 백드롭은 ProductMockBackdrop (파스텔 + 패키지 실루엣). 외부 이미지 의존성 0.
export function MockProductCard({ product, variant = "grid" }: { product: MockProduct; variant?: Variant }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  if (variant === "hero") {
    return (
      <Link href={`/products/${product.slug}`} className="group relative block overflow-hidden rounded-2xl aspect-[3/4]">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
          <ProductMockBackdrop product={product} size="lg" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <Badges product={product} />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white drop-shadow">
          <p className="text-[10px] font-medium opacity-80">{product.brand}</p>
          <p className="text-[14px] font-semibold leading-snug line-clamp-2">{product.name}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            {product.originalPrice ? (
              <span className="text-[10px] font-mono opacity-60 line-through">{formatKRW(product.originalPrice)}</span>
            ) : null}
            <span className="text-[14px] font-mono font-semibold">{formatKRW(product.price)}</span>
            {discount > 0 ? <span className="text-[11px] font-bold text-amber-200">{discount}%</span> : null}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "large") {
    return (
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-square rounded-2xl overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
            <ProductMockBackdrop product={product} size="lg" />
          </div>
          <Badges product={product} />
        </div>
        <p className="mt-3 text-[11px] text-mute">{product.brand}</p>
        <p className="text-[14px] font-semibold text-ink leading-snug line-clamp-2 min-h-[2.6em]">{product.name}</p>
        {product.shortDescription ? (
          <p className="text-[11px] text-body mt-1 line-clamp-1">{product.shortDescription}</p>
        ) : null}
        <div className="mt-2 flex items-baseline gap-1.5">
          {product.originalPrice ? (
            <span className="text-[11px] font-mono text-mute line-through">{formatKRW(product.originalPrice)}</span>
          ) : null}
          <span className="text-[16px] font-mono font-bold text-ink">{formatKRW(product.price)}</span>
          {discount > 0 ? <span className="text-[12px] font-bold text-rose-500">{discount}%</span> : null}
        </div>
        {typeof product.rating === "number" && typeof product.reviewCount === "number" ? (
          <p className="mt-1 text-[10px] text-mute">
            ★ {product.rating.toFixed(1)} <span className="text-mute/70">({product.reviewCount.toLocaleString()})</span>
          </p>
        ) : null}
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group block w-[160px] shrink-0"
      >
        <div className="relative aspect-square rounded-xl overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
            <ProductMockBackdrop product={product} size="sm" showName={false} />
          </div>
          <Badges product={product} size="sm" />
        </div>
        <p className="mt-2.5 text-[10px] text-mute">{product.brand}</p>
        <p className="text-[12px] font-medium text-ink leading-snug line-clamp-2 min-h-[2.4em]">{product.name}</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          {product.originalPrice ? (
            <span className="text-[10px] font-mono text-mute line-through">{formatKRW(product.originalPrice)}</span>
          ) : null}
          <span className="text-[12px] font-mono font-semibold text-ink">{formatKRW(product.price)}</span>
          {discount > 0 ? <span className="text-[10px] font-bold text-rose-500">{discount}%</span> : null}
        </div>
      </Link>
    );
  }

  // grid (default)
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square rounded-2xl overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
          <ProductMockBackdrop product={product} />
        </div>
        <Badges product={product} />
      </div>
      <p className="mt-3 text-[11px] text-mute">{product.brand}</p>
      <p className="text-[13px] font-medium text-ink leading-snug line-clamp-2 min-h-[2.6em]">{product.name}</p>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        {product.originalPrice ? (
          <span className="text-[11px] font-mono text-mute line-through">{formatKRW(product.originalPrice)}</span>
        ) : null}
        <span className="text-[14px] font-mono font-semibold text-ink">{formatKRW(product.price)}</span>
        {discount > 0 ? <span className="text-[11px] font-bold text-rose-500">{discount}%</span> : null}
      </div>
      {typeof product.rating === "number" && typeof product.reviewCount === "number" ? (
        <p className="mt-1 text-[10px] text-mute">
          ★ {product.rating.toFixed(1)} <span className="text-mute/70">({product.reviewCount.toLocaleString()})</span>
        </p>
      ) : null}
    </Link>
  );
}

function Badges({ product, size = "md" }: { product: MockProduct; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5";
  return (
    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
      {product.isBest ? (
        <span className={`rounded bg-ink text-canvas font-bold ${cls}`}>BEST</span>
      ) : null}
      {product.isNew ? (
        <span className={`rounded bg-amber-400 text-[#0c1322] font-bold ${cls}`}>NEW</span>
      ) : null}
      {product.isSale ? (
        <span className={`rounded bg-rose-500 text-white font-bold ${cls}`}>특가</span>
      ) : null}
    </div>
  );
}
