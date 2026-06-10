import Link from "next/link";
import { formatKRW } from "@/lib/utils";
import type { MockProduct } from "@/config/products.mock";
import { findGCategory } from "@/config/categories";
import { ProductMockBackdrop } from "@/components/products/ProductMockBackdrop";
import { ProductFAQ } from "@/components/products/ProductFAQ";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { ExternalPurchaseLinks } from "@/components/products/ExternalPurchaseLinks";
import { DetailImageList } from "@/components/products/DetailImageList";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

// BrandG mock 상품 상세 — DB/결제 무관, 데모 전용.
// purchaseType 분기:
//   - internal: 기존 장바구니 흐름
//   - groupbuy: 장바구니 + 공구 상세 이미지 영역
//   - external: 장바구니 숨김, 외부 링크만
export function MockProductDetail({ product }: { product: MockProduct }) {
  const category = findGCategory(product.category_slug);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const purchaseType = product.purchaseType ?? "internal";
  const showCart = purchaseType !== "external";
  const showGroupbuyImages = purchaseType === "groupbuy" && (product.detailImages?.length ?? 0) > 0;
  const showExternalLinks = purchaseType === "external" && (product.externalPurchaseLinks?.length ?? 0) > 0;

  return (
    <div className="brandg-shop">
    <div className="container py-10 max-w-2xl">
      <section className="mb-8 -mx-4 sm:mx-0">
        <div className="relative w-full sm:max-w-[460px] sm:mx-auto aspect-[4/5] sm:rounded-2xl overflow-hidden">
          <ProductMockBackdrop product={product} size="lg" />
        </div>
      </section>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {category ? (
            <Link
              href={`/categories/${category.slug}`}
              className="text-[11px] font-mono text-mute hover:text-ink underline underline-offset-2"
            >
              {category.emoji} {category.korean}
            </Link>
          ) : null}
          {product.isBest ? (
            <span className="rounded bg-ink text-canvas text-[10px] font-bold px-2 py-0.5">BEST</span>
          ) : null}
          {product.isNew ? (
            <span className="rounded bg-amber-400 text-[#0c1322] text-[10px] font-bold px-2 py-0.5">NEW</span>
          ) : null}
          {product.isSale ? (
            <span className="rounded bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5">특가</span>
          ) : null}
          {purchaseType === "groupbuy" ? (
            <span className="rounded bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5">공구</span>
          ) : null}
          {purchaseType === "external" ? (
            <span className="rounded border border-hairline bg-canvas text-mute text-[10px] font-bold px-2 py-0.5">
              외부 판매처
            </span>
          ) : null}
        </div>

        <p className="text-[12px] text-mute mb-1">{product.brand}</p>
        <h1 className="text-[22px] md:text-[26px] font-bold text-ink leading-snug">
          {product.name}
        </h1>
        <p className="mt-3 text-[14px] text-body leading-relaxed">{product.shortDescription}</p>

        <div className="mt-5 flex items-baseline gap-2.5">
          {product.originalPrice ? (
            <span className="text-base font-mono text-mute line-through">{formatKRW(product.originalPrice)}</span>
          ) : null}
          <span className="text-[26px] font-mono font-bold text-ink">{formatKRW(product.price)}</span>
          {discount > 0 ? (
            <span className="text-[14px] font-bold text-rose-500">{discount}%</span>
          ) : null}
        </div>

        {typeof product.rating === "number" && typeof product.reviewCount === "number" ? (
          <p className="mt-2 text-[12px] text-mute">
            <span className="text-amber-500">★ {product.rating.toFixed(1)}</span>{" "}
            ({product.reviewCount.toLocaleString()}개 후기)
          </p>
        ) : null}
      </header>

      {/* 핵심 포인트 */}
      {product.highlights && product.highlights.length > 0 ? (
        <section className="mb-8 rounded-2xl border border-hairline bg-surface-soft p-5">
          <p className="text-[12px] font-semibold text-ink mb-3">한눈에 핵심</p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-[13px] text-body">
                <span className="mt-1 w-1 h-1 rounded-full bg-amber-400 shrink-0" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 본문 */}
      <section className="mb-8">
        <p className="text-[12px] font-semibold text-ink mb-3">PRODUCT</p>
        <p className="text-[14px] text-body leading-relaxed whitespace-pre-line">
          {product.longDescription}
        </p>
      </section>

      {/* 지나스 코멘트 */}
      {product.jinaComment ? (
        <section className="mb-8 rounded-2xl border-l-4 border-l-amber-400 border border-hairline bg-amber-50/40 p-5">
          <p className="text-[11px] font-mono tracking-[0.3em] text-amber-700 mb-1.5">JINA&apos;S NOTE</p>
          <p className="text-[14px] text-ink leading-relaxed whitespace-pre-line">{product.jinaComment}</p>
        </section>
      ) : null}

      {/* 이런 분께 추천 */}
      {product.recommendedFor && product.recommendedFor.length > 0 ? (
        <section className="mb-8">
          <p className="text-[12px] font-semibold text-ink mb-3">이런 분께 추천</p>
          <ul className="space-y-1.5">
            {product.recommendedFor.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-body">
                <span className="mt-1 text-amber-500 shrink-0" aria-hidden>✓</span>
                {r}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 공구 상세 이미지 (groupbuy 전용) */}
      {showGroupbuyImages ? (
        <DetailImageList images={product.detailImages!} alt={product.name} />
      ) : null}

      {/* 외부 구매처 (external 전용) */}
      {showExternalLinks ? (
        <ExternalPurchaseLinks links={product.externalPurchaseLinks!} productName={product.name} />
      ) : null}

      {/* 주의사항 */}
      {product.cautionNote ? (
        <section className="mb-8 rounded-2xl border border-rose-200 bg-rose-50/40 p-5">
          <p className="text-[12px] font-semibold text-rose-700 mb-1.5">⚠ 주의사항</p>
          <p className="text-[12px] text-body leading-relaxed whitespace-pre-line">{product.cautionNote}</p>
        </section>
      ) : null}

      {/* CTA — internal/groupbuy 만 노출, external 은 외부 링크가 대체 */}
      {showCart ? (
        <section className="sticky bottom-0 -mx-4 px-4 py-3 bg-canvas/95 backdrop-blur-sm border-t border-hairline sm:static sm:bg-transparent sm:backdrop-blur-0 sm:border-0 sm:px-0 sm:py-0">
          <div className="flex gap-2">
            <AddToCartButton
              item={{
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                price: product.price,
                originalPrice: product.originalPrice,
                gradient: product.gradient,
              }}
              size="lg"
              className="flex-1"
            />
            <Link
              href="/cart"
              className="rounded-xl bg-amber-500 px-5 py-3.5 text-[13px] font-bold text-white hover:bg-amber-600 transition-colors shadow-sm"
            >
              장바구니 보기
            </Link>
          </div>
          <p className="mt-2 text-center text-[11px] text-mute sm:text-left">
            담아두면 주문서(데모)까지 흐름을 미리 보실 수 있어요.
          </p>
        </section>
      ) : null}

      {/* 안내 (배송/교환/안전) */}
      <ProductFAQ />

      {/* 같은 G 추천 3개 */}
      <RelatedProducts product={product} />

      {/* 같은 G 더보기 */}
      {category ? (
        <p className="mt-12 text-center text-[12px] text-mute">
          <Link href={`/categories/${category.slug}`} className="text-ink underline underline-offset-4 hover:text-body">
            {category.korean} 다른 G 더 보기 →
          </Link>
        </p>
      ) : null}
    </div>
    </div>
  );
}
