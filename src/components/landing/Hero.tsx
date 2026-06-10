import Link from "next/link";

// BrandG Hero — Phase 3.5 추가 압축. Hero + 생활문제 + 5G 까지 첫 화면.
export function Hero() {
  return (
    <section className="container pt-6 pb-4 md:pt-8 text-center">
      <h1 className="text-[24px] md:text-[32px] font-extrabold leading-[1.15] tracking-tight text-ink">
        뭐가 필요하<span className="text-amber-300">G</span>?
      </h1>
      <p className="mt-1.5 text-[12px] md:text-[14px] text-body">
        Good Life를 위한 40+ 자기관리 편집샵
      </p>
      <div className="mt-3 flex items-center justify-center gap-1.5 max-w-[320px] mx-auto">
        <Link
          href="/start"
          className="flex-1 rounded-lg bg-amber-400 py-2.5 text-[13px] font-bold text-[#0c1322] hover:opacity-90 transition-opacity"
        >
          내 G 찾기
        </Link>
        <Link
          href="/products"
          className="flex-1 rounded-lg border border-hairline bg-canvas py-2.5 text-[12px] font-medium text-ink hover:border-ink transition-colors"
        >
          그냥 쇼핑하기
        </Link>
      </div>
    </section>
  );
}
