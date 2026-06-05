import Link from "next/link";
import { getJinasPicks } from "@/config/products.mock";
import { formatKRW } from "@/lib/utils";
import { ProductMockBackdrop } from "@/components/products/ProductMockBackdrop";

// "지나스 장바구니" — 매거진 레이아웃.
// 대표상품 1 (크게) + "왜 추천?" 카피 + 관련상품 3~4 (작게).
const FEATURE_REASON =
  "‘예민한 날, 5분 진정 마스크 대용.’ — 매일 아침 토너 단계를 패드 하나로 끝내고 싶은 분들에게.\n10번 넘게 재구매한 진심픽입니다.";

export function JinasCart() {
  const items = getJinasPicks(5);
  if (items.length === 0) return null;
  const [feature, ...rest] = items;
  const related = rest.slice(0, 4);

  return (
    <section className="container py-10 border-t border-hairline">
      <div className="mb-4">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1">JINA&apos;S CART</p>
        <h2 className="text-[20px] md:text-[24px] font-bold text-ink">지나스 장바구니 공개</h2>
        <p className="mt-1 text-[12px] text-body">큐레이터 사장님이 직접 담은 G — 마진보다 마음.</p>
      </div>

      <div className="grid md:grid-cols-[1.05fr_1fr] gap-5 items-start">
        {/* 대표상품 큰 카드 */}
        <Link href={`/products/${feature.slug}`} className="group block">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]">
              <ProductMockBackdrop product={feature} size="lg" showName={false} />
            </div>
            <div className="absolute top-3 left-3 z-10">
              <span className="rounded-full bg-amber-400 text-[#0c1322] text-[10px] font-extrabold px-2.5 py-1">지나 PICK · TOP</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-[11px] text-mute">{feature.brand}</p>
            <p className="text-[16px] font-bold text-ink leading-snug">{feature.name}</p>
            <div className="mt-1.5 flex items-baseline gap-2">
              {feature.originalPrice ? (
                <span className="text-[11px] font-mono text-mute line-through">{formatKRW(feature.originalPrice)}</span>
              ) : null}
              <span className="text-[16px] font-mono font-bold text-ink">{formatKRW(feature.price)}</span>
              {feature.originalPrice ? (
                <span className="text-[12px] font-bold text-rose-500">
                  {Math.round((1 - feature.price / feature.originalPrice) * 100)}%
                </span>
              ) : null}
            </div>
          </div>
        </Link>

        {/* 우측: 추천 이유 + 관련 4개 */}
        <div>
          <div className="rounded-2xl border border-hairline bg-surface-soft p-5">
            <p className="text-[10px] font-mono tracking-[0.3em] text-mute mb-2">WHY JINA PICKED</p>
            <p className="text-[13px] text-ink leading-relaxed whitespace-pre-line">{FEATURE_REASON}</p>
            <Link
              href={`/products/${feature.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink text-canvas text-[12px] font-semibold px-4 py-2 hover:opacity-90 transition-opacity"
            >
              대표 상품 보러가기 →
            </Link>
          </div>

          <p className="mt-5 mb-2.5 text-[12px] font-semibold text-ink">함께 담은 지나의 픽</p>
          <div className="grid grid-cols-2 gap-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group block">
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                    <ProductMockBackdrop product={p} size="sm" showName={false} />
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-mute">{p.brand}</p>
                <p className="text-[11px] font-medium text-ink leading-snug line-clamp-2 min-h-[2.2em]">{p.name}</p>
                <p className="mt-0.5 text-[11px] font-mono font-bold text-ink">{formatKRW(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
