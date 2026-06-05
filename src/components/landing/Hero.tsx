import Link from "next/link";

// BrandG 메인 Hero — 40+ 자기관리 편집샵 진입.
// "사주" 단어 노출 X. 카테고리/세계관 중심.
const G_HINTS = [
  "동안이G — 피부·헤어·바디·홈뷰티",
  "건강이G — 영양제·이너뷰티·차",
  "힐링이G — 입욕·홈스파·향기",
  "가벼워지G — 붓기·순환·스트레칭",
  "편안하G — 갱년기·여성청결·이너케어",
];

export function Hero() {
  return (
    <section className="container pt-20 pb-12 md:pt-28 text-center">
      {/* 메인 후킹 */}
      <h1 className="text-[34px] md:text-[52px] font-extrabold leading-[1.18] tracking-tight text-ink px-1">
        뭐가 필요하
        <span className="text-amber-300">G</span>?
      </h1>

      {/* 서브 */}
      <p className="mt-7 text-[15px] md:text-[17px] leading-[1.7] text-body max-w-md mx-auto px-2">
        Good Life를 위한
        <br />
        <span className="text-ink font-medium">40+ 자기관리 편집샵</span>
      </p>

      {/* 보조 */}
      <p className="mt-5 text-[13px] text-mute max-w-sm mx-auto px-2">
        내게 맞는 G를 진단받거나
        <br />
        지금 바로 둘러볼 수 있어요.
      </p>

      {/* CTA */}
      <div className="mt-9 flex flex-col items-center gap-2.5 max-w-[340px] mx-auto px-4">
        <Link
          href="/start"
          className="block w-full rounded-xl bg-amber-400 py-4 text-[16px] font-bold text-[#0c1322] hover:opacity-90 transition-opacity"
        >
          내 G 찾기
        </Link>
        <Link
          href="/products"
          className="block w-full rounded-xl border border-hairline bg-canvas py-4 text-[14px] font-medium text-ink hover:border-ink transition-colors"
        >
          그냥 쇼핑하기
        </Link>
      </div>

      {/* 카테고리 힌트 */}
      <div className="mt-14 max-w-[400px] mx-auto px-2">
        <p className="text-[12px] text-mute mb-3">5가지 G로 만나는 자기관리</p>
        <ul className="space-y-2 text-left">
          {G_HINTS.map((p) => (
            <li key={p} className="flex items-center gap-2.5 rounded-lg border border-hairline bg-surface-soft px-4 py-3">
              <span className="text-amber-300 text-[13px]" aria-hidden>›</span>
              <span className="text-[14px] text-ink">{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
