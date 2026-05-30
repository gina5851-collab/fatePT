import Link from "next/link";

// 운명PT 대문(랜딩) 히어로 — 압도감 강화. 다크 네이비.
// 주의: 실시간 숫자/명단/"분석 중" 금지(과장광고). 정적 "패턴 예시"로만 표현.
const PATTERNS = [
  "관계에서 늘 지치는 사람",
  "돈이 들어와도 남지 않는 사람",
  "버티다가 한 번에 무너지는 사람",
  "좋은 기회를 앞두고 멈추는 사람",
];

export function Hero() {
  return (
    <section className="container pt-20 pb-12 md:pt-28 text-center">
      {/* 후킹 메인 — 크고 강하게 */}
      <h1 className="text-[34px] md:text-[52px] font-extrabold leading-[1.18] tracking-tight text-ink px-1">
        왜 나는 늘
        <br />
        <span className="text-amber-300">같은 문제</span>에서
        <br />
        막힐까요?
      </h1>

      {/* 서브 — 강조 줄바꿈 */}
      <p className="mt-7 text-[15px] md:text-[17px] leading-[1.7] text-body max-w-md mx-auto px-2">
        당신이 부족해서가 아닙니다.
        <br />
        오래 버틴 사람에게는
        <br />
        <span className="text-ink font-medium">반복되는 패턴</span>이 남습니다.
      </p>

      {/* 보조 */}
      <p className="mt-5 text-[13px] text-mute max-w-sm mx-auto px-2">
        생년월일만 입력하면, 관계·돈·일·감정에서
        <br />
        어디서 같은 흐름이 반복되는지 읽어드려요.
      </p>

      {/* CTA */}
      <div className="mt-9 flex flex-col items-center gap-2.5 max-w-[340px] mx-auto px-4">
        <Link
          href="/start"
          className="block w-full rounded-xl bg-amber-400 py-4 text-[16px] font-bold text-[#0c1322] hover:opacity-90 transition-opacity"
        >
          내 반복 패턴 확인하기 →
        </Link>
        <Link href="/start" className="text-[13px] text-mute hover:text-ink underline underline-offset-4">
          무료로 먼저 보기
        </Link>
      </div>

      {/* 패턴 예시 — 패턴명이 먼저, 실시간 표현 없음 */}
      <div className="mt-14 max-w-[400px] mx-auto px-2">
        <p className="text-[12px] text-mute mb-3">운명PT에서 자주 확인하는 패턴</p>
        <ul className="space-y-2 text-left">
          {PATTERNS.map((p) => (
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

