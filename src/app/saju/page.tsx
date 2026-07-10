import type { Metadata } from "next";
import Link from "next/link";
import { productsByService } from "@/config/catalog";
import { fetchDbProducts, resolvePrice } from "@/lib/catalog-db";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SajuWheel, StarField } from "@/components/storefront/graphics";

export const metadata: Metadata = {
  title: "사주풀이",
  description: "운명PT 사주 — 예언이 아니라 반복되는 패턴을 읽습니다. 무료 진단부터 전체 사주 리포트까지.",
  alternates: { canonical: "/saju" },
};

// 사주 카테고리 — 측정 → 집중 → 전체 코스맵 + 사주 상품 진열
export default async function SajuPage() {
  const products = productsByService("saju");
  const dbMap = await fetchDbProducts(products.map((p) => p.slug));
  const visible = products.filter((p) => {
    const row = dbMap.get(p.slug);
    return !row || row.is_active;
  });

  return (
    <div className="bg-sf-bg min-h-screen">
      {/* 히어로 밴드 — 네이비 + 명식 차트 */}
      <div className="relative overflow-hidden sf-night-sky">
        <StarField className="absolute inset-0 w-full h-full opacity-50" />
        <SajuWheel className="absolute -right-20 top-1/2 -translate-y-1/2 w-[250px] md:w-[480px] opacity-40 md:opacity-60 animate-sf-spin-slow" />
        <div className="container relative py-14 md:py-20">
          <p className="text-[12px] font-bold tracking-[0.25em] text-sf-gold mb-3">SAJU</p>
          <h1 className="text-[30px] md:text-[44px] font-extrabold tracking-tight text-white leading-[1.25] max-w-xl">
            사주는 예언이 아니라,
            <br />내 패턴의 <span className="sf-gold-text">측정</span>입니다
          </h1>
          <p className="mt-4 text-[15px] md:text-[16px] text-[#b9c3d9] leading-[1.8] max-w-xl">
            생년월일로 계산한 명식에서 관계·돈·일·감정의 반복 패턴을 읽고, 오늘 할 수 있는
            선택으로 정리해 드립니다.
          </p>
        </div>
      </div>

      {/* 코스맵 — 종이 질감 */}
      <div className="sf-paper border-b border-sf-line">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
            <div className="hidden sm:block absolute top-1/2 inset-x-[16%] h-[2px] bg-gradient-to-r from-sf-amber/70 via-sf-amber/50 to-sf-line -z-0" />
            {[
              { step: "STEP 1 · 측정", name: "무료 맛보기 → 운명 인바디", desc: "내 기질과 패턴의 큰 그림부터", href: "/products/inbody" },
              { step: "STEP 2 · 집중", name: "짝사랑 · 재회 리포트", desc: "지금 걸리는 고민 하나를 깊게", href: "/products?tab=love" },
              { step: "STEP 3 · 전체", name: "전체 사주 리포트", desc: "잠긴 패턴 전부를 한 번에", href: "/products/premium-saju" },
            ].map((c) => (
              <Link
                key={c.step}
                href={c.href}
                className="relative z-10 rounded-2xl border border-sf-line bg-sf-panel p-6 md:p-7 hover:border-sf-amber transition-colors hover:shadow-[0_10px_36px_rgba(20,35,63,0.12)]"
              >
                <p className="text-[12px] font-mono font-bold text-sf-amber-deep mb-2">{c.step}</p>
                <p className="text-[17px] md:text-[19px] font-extrabold text-sf-ink">{c.name}</p>
                <p className="mt-1.5 text-[13.5px] text-sf-body">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="container py-12 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((p) => (
            <ProductCard key={p.slug} product={p} price={resolvePrice(dbMap.get(p.slug), p.priceHint)} />
          ))}
        </div>

        {/* 타로 교차 진입 */}
        <div className="mt-16 rounded-3xl bg-sf-navy p-9 md:p-12 text-center">
          <p className="text-[19px] md:text-[22px] font-extrabold text-white mb-2">지금 당장의 마음이 급하다면</p>
          <p className="text-[14px] text-[#aab6cf] mb-7">
            깊은 분석 전에, 카드 한 장으로 오늘의 방향부터 잡아볼 수도 있어요.
          </p>
          <Link
            href="/tarot"
            className="inline-block rounded-2xl border border-sf-gold/60 px-10 py-4 text-[15px] font-extrabold text-sf-gold hover:bg-sf-gold/10 transition-colors"
          >
            타로 보러 가기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
