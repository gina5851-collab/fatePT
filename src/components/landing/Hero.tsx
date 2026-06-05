import Link from "next/link";

// BrandG Hero — 컴팩트 (Phase 3 에서 70%→40% 축소).
// 큰 카피 + CTA 두 갈래 + 한 줄 서브카피만. 5G 힌트 리스트는 LifeIssueChips/GCategoryCards 에서 처리.
export function Hero() {
  return (
    <section className="container pt-10 pb-7 md:pt-12 md:pb-9 text-center">
      <h1 className="text-[28px] md:text-[40px] font-extrabold leading-[1.15] tracking-tight text-ink">
        뭐가 필요하<span className="text-amber-300">G</span>?
      </h1>

      <p className="mt-3 text-[13px] md:text-[15px] text-body max-w-md mx-auto">
        Good Life를 위한 <span className="text-ink font-medium">40+ 자기관리 편집샵</span>
      </p>

      <div className="mt-6 flex items-center justify-center gap-2 max-w-[340px] mx-auto px-2">
        <Link
          href="/start"
          className="flex-1 rounded-xl bg-amber-400 py-3 text-[14px] font-bold text-[#0c1322] hover:opacity-90 transition-opacity"
        >
          내 G 찾기
        </Link>
        <Link
          href="/products"
          className="flex-1 rounded-xl border border-hairline bg-canvas py-3 text-[13px] font-medium text-ink hover:border-ink transition-colors"
        >
          그냥 쇼핑하기
        </Link>
      </div>
    </section>
  );
}
