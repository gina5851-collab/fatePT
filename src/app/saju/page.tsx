import type { Metadata } from "next";
import Link from "next/link";
import { productsByService } from "@/config/catalog";
import { fetchDbProducts, resolvePrice } from "@/lib/catalog-db";
import { ProductCard } from "@/components/storefront/ProductCard";

export const metadata: Metadata = {
  title: "사주풀이",
  description: "운명PT 사주 — 예언이 아니라 반복되는 패턴을 읽습니다. 무료 진단부터 전체 사주 리포트까지.",
  alternates: { canonical: "/saju" },
};

// 사주 카테고리 — 측정 → 집중 → 심화 코스맵 + 사주 상품 진열
export default async function SajuPage() {
  const products = productsByService("saju");
  const dbMap = await fetchDbProducts(products.map((p) => p.slug));
  const visible = products.filter((p) => {
    const row = dbMap.get(p.slug);
    return !row || row.is_active;
  });

  return (
    <div className="bg-sf-bg min-h-screen">
      <div className="container py-10 md:py-14">
        <header className="mb-10 max-w-xl">
          <p className="text-xs font-mono text-sf-amber-deep mb-2">SAJU</p>
          <h1 className="text-[26px] md:text-[32px] font-extrabold tracking-tight text-sf-ink leading-snug">
            사주는 예언이 아니라,
            <br />내 패턴의 측정입니다
          </h1>
          <p className="mt-3 text-sm text-sf-body leading-relaxed">
            생년월일로 계산한 명식에서 관계·돈·일·감정의 반복 패턴을 읽고, 오늘 할 수 있는
            선택으로 정리해 드립니다. 가볍게 재고, 필요한 만큼 깊게 들어가세요.
          </p>
        </header>

        {/* 코스맵 — 저가 → 고가 사다리 */}
        <section className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { step: "STEP 1 · 측정", name: "무료 맛보기 → 운명 인바디", desc: "내 기질과 패턴의 큰 그림부터", href: "/products/inbody" },
              { step: "STEP 2 · 집중", name: "짝사랑 · 재회 리포트", desc: "지금 걸리는 고민 하나를 깊게", href: "/products?tab=love" },
              { step: "STEP 3 · 전체", name: "전체 사주 리포트", desc: "잠긴 패턴 전부를 한 번에", href: "/products/premium-saju" },
            ].map((c) => (
              <Link
                key={c.step}
                href={c.href}
                className="rounded-xl border border-sf-line bg-sf-panel p-5 hover:border-sf-amber transition-colors"
              >
                <p className="text-[11px] font-mono text-sf-amber-deep mb-2">{c.step}</p>
                <p className="text-[15px] font-semibold text-sf-ink">{c.name}</p>
                <p className="mt-1 text-[13px] text-sf-body">{c.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((p) => (
            <ProductCard key={p.slug} product={p} price={resolvePrice(dbMap.get(p.slug), p.priceHint)} />
          ))}
        </div>

        {/* 타로 교차 진입 */}
        <div className="mt-14 rounded-2xl border border-sf-line bg-sf-panel p-7 text-center">
          <p className="text-[15px] font-semibold text-sf-ink mb-1">지금 당장의 마음이 급하다면</p>
          <p className="text-[13px] text-sf-body mb-5">
            깊은 분석 전에, 카드 한 장으로 오늘의 방향부터 잡아볼 수도 있어요.
          </p>
          <Link
            href="/tarot"
            className="inline-block rounded-xl bg-sf-navy px-8 py-3 text-[14px] font-bold text-sf-amber hover:opacity-90 transition-opacity"
          >
            타로 보러 가기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
