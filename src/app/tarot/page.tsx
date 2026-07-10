import type { Metadata } from "next";
import Link from "next/link";
import { productsByService } from "@/config/catalog";
import { fetchDbProducts, resolvePrice } from "@/lib/catalog-db";
import { ProductCard } from "@/components/storefront/ProductCard";

export const metadata: Metadata = {
  title: "타로",
  description: "운명PT 타로 — 카드가 짚어주는 지금의 흐름. 오늘의 타로, 그 사람의 속마음, 우리 관계의 흐름.",
  alternates: { canonical: "/tarot" },
  openGraph: {
    title: "운명PT 타로",
    description: "카드가 짚어주는 지금의 흐름 — 오늘의 타로 · 그 사람의 속마음 · 우리 관계의 흐름",
    type: "website",
    locale: "ko_KR",
  },
};

// 타로 카테고리 — "언제 사주, 언제 타로" 교육 + 타로 상품 진열
export default async function TarotPage() {
  const products = productsByService("tarot");
  const dbMap = await fetchDbProducts(products.map((p) => p.slug));
  const visible = products.filter((p) => {
    const row = dbMap.get(p.slug);
    return !row || row.is_active;
  });

  return (
    <div className="bg-sf-bg min-h-screen">
      <div className="container py-10 md:py-14">
        <header className="mb-10 max-w-xl">
          <p className="text-xs font-mono text-sf-amber-deep mb-2">TAROT</p>
          <h1 className="text-[26px] md:text-[32px] font-extrabold tracking-tight text-sf-ink leading-snug">
            카드가 짚어주는
            <br />
            지금의 흐름
          </h1>
          <p className="mt-3 text-sm text-sf-body leading-relaxed">
            질문을 떠올리고 카드를 뽑아보세요. 지금 상황을 비추고, 다음 행동을 잡아주는
            메시지를 정성껏 읽어드립니다.
          </p>
        </header>

        {/* 언제 사주, 언제 타로 — 선택 피로 제거 */}
        <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-sf-line bg-sf-panel p-5">
            <p className="text-[13px] font-semibold text-sf-ink mb-1.5">🃏 타로가 맞을 때</p>
            <p className="text-[13px] text-sf-body leading-relaxed">
              &ldquo;지금 이 상황, 어떻게 움직여야 하지?&rdquo; — 눈앞의 고민, 오늘의 선택,
              상대의 지금 마음처럼 <b className="text-sf-ink">현재의 흐름</b>이 궁금할 때.
            </p>
          </div>
          <div className="rounded-xl border border-sf-line bg-sf-panel p-5">
            <p className="text-[13px] font-semibold text-sf-ink mb-1.5">📜 사주가 맞을 때</p>
            <p className="text-[13px] text-sf-body leading-relaxed">
              &ldquo;왜 나는 매번 이럴까?&rdquo; — 반복되는 패턴, 타고난 기질, 올해의 큰 흐름처럼{" "}
              <b className="text-sf-ink">구조와 리듬</b>이 궁금할 때.{" "}
              <Link href="/saju" className="underline underline-offset-2">사주 보러 가기 →</Link>
            </p>
          </div>
        </section>

        {/* 타로 상품 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((p) => (
            <ProductCard key={p.slug} product={p} price={resolvePrice(dbMap.get(p.slug), p.priceHint)} />
          ))}
        </div>

        <p className="mt-10 text-center text-[11px] text-sf-mute leading-relaxed">
          타로는 단정적 예언이 아니라, 지금 흐름을 비추고 선택을 돕는 도구입니다.
        </p>
      </div>
    </div>
  );
}
