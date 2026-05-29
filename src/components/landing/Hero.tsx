import Link from "next/link";

// 천기문式 히어로: 희소성/등급 후크 + 큰 단일 CTA.
export function Hero() {
  return (
    <section className="container py-16 md:py-28 text-center">
      {/* 후크 — 희소성/등급 */}
      <p className="text-sm text-body mb-2">당신의 운명은</p>
      <h1 className="text-[30px] md:text-[44px] font-bold tracking-tight leading-[1.2] text-ink px-2">
        얼마나 <span className="text-amber-400">희소</span>할까요?
      </h1>
      <p className="mt-4 text-[14px] md:text-[15px] text-body max-w-md mx-auto leading-relaxed px-4">
        같은 생년월일이라도 사주 조합의 희소성은 전혀 다릅니다.
        <br className="hidden sm:block" />
        내 운명 등급과 타고난 패턴을 1분 만에 진단받으세요.
      </p>

      {/* 천기문式 큰 단일 CTA */}
      <div className="mt-8 px-4 max-w-[420px] mx-auto">
        <Link
          href="/start"
          className="block w-full rounded-xl bg-surface-dark border border-hairline-strong py-4 text-[15px] font-semibold text-amber-300 hover:opacity-90 transition-opacity"
        >
          내 운명 등급 확인하기 →
        </Link>
        <Link
          href="/contents"
          className="mt-3 inline-block text-xs text-mute hover:text-ink underline underline-offset-4"
        >
          고민별 콘텐츠 먼저 보기
        </Link>
      </div>

      <p className="mt-6 text-xs text-mute px-4">
        단정적인 운세가 아니라, 오늘부터 단련하는 자기이해 트레이닝입니다
      </p>
    </section>
  );
}
