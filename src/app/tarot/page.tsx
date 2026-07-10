import type { Metadata } from "next";
import Link from "next/link";
import { productsByService } from "@/config/catalog";
import { fetchDbProducts, resolvePrice } from "@/lib/catalog-db";
import { formatKRW } from "@/lib/utils";
import { StarField, TarotFan } from "@/components/storefront/graphics";

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

// 타로 카테고리 — 섹션 전체를 밤하늘 다크로 전환, 골드 카드 비주얼
export default async function TarotPage() {
  const products = productsByService("tarot");
  const dbMap = await fetchDbProducts(products.map((p) => p.slug));
  const visible = products.filter((p) => {
    const row = dbMap.get(p.slug);
    return !row || row.is_active;
  });

  return (
    <div className="relative sf-night-sky min-h-screen overflow-hidden">
      <StarField className="absolute inset-x-0 top-0 w-full h-[60%] opacity-70" />

      <div className="container relative py-14 md:py-20">
        <p className="text-[12px] font-bold tracking-[0.25em] text-sf-gold mb-3">TAROT</p>
        <h1 className="text-[30px] md:text-[44px] font-extrabold tracking-tight text-white leading-[1.25]">
          카드가 짚어주는
          <br />
          <span className="sf-gold-text">지금의 흐름</span>
        </h1>
        <p className="mt-4 text-[15px] md:text-[16px] text-[#b9c3d9] leading-[1.8] max-w-xl">
          질문을 떠올리고 카드를 뽑아보세요. 지금 상황을 비추고, 다음 행동을 잡아주는
          메시지를 정성껏 읽어드립니다.
        </p>

        {/* 언제 사주, 언제 타로 — 선택 피로 제거 */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          <div className="rounded-2xl border border-sf-gold/25 bg-white/[0.05] p-6">
            <p className="text-[15px] font-extrabold text-sf-gold mb-2">🃏 타로가 맞을 때</p>
            <p className="text-[14px] text-[#b9c3d9] leading-[1.8]">
              &ldquo;지금 이 상황, 어떻게 움직여야 하지?&rdquo; — 눈앞의 고민, 오늘의 선택,
              상대의 지금 마음처럼 <b className="text-white">현재의 흐름</b>이 궁금할 때.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[15px] font-extrabold text-white mb-2">📜 사주가 맞을 때</p>
            <p className="text-[14px] text-[#b9c3d9] leading-[1.8]">
              &ldquo;왜 나는 매번 이럴까?&rdquo; — 반복되는 패턴, 타고난 기질, 올해의 큰 흐름처럼{" "}
              <b className="text-white">구조와 리듬</b>이 궁금할 때.{" "}
              <Link href="/saju" className="underline underline-offset-2 text-sf-gold">사주 보러 가기 →</Link>
            </p>
          </div>
        </div>

        {/* 타로 상품 — 골드 카드 비주얼, 1/3/5장 차이 강조 */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((p) => {
            const n = p.slug === "tarot-daily" ? 1 : p.slug === "tarot-inner-mind" ? 3 : 5;
            const priceV = resolvePrice(dbMap.get(p.slug), p.priceHint);
            return (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-sf-gold/25 bg-white/[0.04] p-7 md:p-8 text-center transition-all duration-300 hover:border-sf-gold/70 hover:bg-white/[0.07] hover:-translate-y-1"
              >
                <TarotFan
                  count={n as 1 | 3 | 5}
                  className="mx-auto h-[160px] w-full max-w-[270px] transition-transform duration-500 group-hover:scale-[1.06]"
                />
                <p className="mt-5 text-[13px] font-bold tracking-widest text-sf-gold">{n}장 리딩</p>
                <p className="mt-1.5 text-[22px] md:text-[24px] font-extrabold text-white">{p.displayName}</p>
                <p className="mt-2 text-[14px] text-[#aab6cf] leading-relaxed">{p.shortDescription}</p>
                <p className="mt-5 text-[28px] font-mono font-extrabold text-sf-gold">{formatKRW(priceV)}</p>
                <p className="mt-1 text-[13px] text-[#93a1c0]">
                  {p.delivery.mode === "auto" ? "⚡ 결제 후 바로 확인" : "✍️ 검수 후 24시간 내 발행"}
                </p>
                <span className="mt-6 block rounded-xl bg-sf-amber py-3.5 text-[14.5px] font-extrabold text-sf-navy group-hover:opacity-95">
                  카드 뽑으러 가기 →
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-12 text-center text-[12px] text-[#7d8aa8] leading-relaxed">
          타로는 단정적 예언이 아니라, 지금 흐름을 비추고 선택을 돕는 도구입니다.
        </p>
      </div>
    </div>
  );
}
