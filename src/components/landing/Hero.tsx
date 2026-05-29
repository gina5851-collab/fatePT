import Link from "next/link";

// 운명PT 대문(랜딩) 히어로 — 천기문式 구조(메인문장+CTA+열람느낌), 다크 네이비.
// 주의: 실시간 숫자/명단/"분석 중" 금지(과장광고). 정적 "유형 예시"로만 표현.
// 실데이터 쌓이면 C안(실제 카운트)으로 전환.
const VIEWER_TYPES = [
  { name: "서연", type: "관계에서 늘 지치는 패턴" },
  { name: "하윤", type: "돈이 들어와도 남지 않는 흐름" },
  { name: "민서", type: "오래 버틴 시간이 풀리기 시작한 구간" },
  { name: "지우", type: "같은 선택을 반복하는 구조" },
];

export function Hero() {
  return (
    <section className="container pt-16 pb-12 md:pt-24 text-center">
      {/* 후킹 메인 */}
      <h1 className="text-[28px] md:text-[40px] font-bold leading-[1.25] tracking-tight text-ink px-2">
        왜 나는 늘
        <br />
        <span className="text-amber-300">같은 문제</span>에서 막힐까요?
      </h1>

      {/* 서브 */}
      <p className="mt-6 text-[14px] md:text-[15px] leading-relaxed text-body max-w-md mx-auto px-2">
        당신이 부족해서가 아닙니다.
        <br />
        오래 버틴 사람에게는, 자신을 지키기 위해 만든
        <br className="hidden sm:block" />
        <span className="text-ink"> 반복 패턴</span>이 남습니다.
      </p>

      {/* 보조 */}
      <p className="mt-4 text-[13px] text-mute max-w-sm mx-auto px-2">
        생년월일만 입력하면, 관계·돈·일·감정에서
        <br />
        어디서 같은 흐름이 반복되는지 읽어드려요.
      </p>

      {/* CTA */}
      <div className="mt-8 flex flex-col items-center gap-2.5 max-w-[320px] mx-auto px-4">
        <Link
          href="/start"
          className="block w-full rounded-xl bg-amber-400 py-4 text-[15px] font-bold text-[#0c1322] hover:opacity-90 transition-opacity"
        >
          내 반복 패턴 확인하기 →
        </Link>
        <Link href="/start" className="text-[13px] text-mute hover:text-ink underline underline-offset-4">
          무료로 먼저 보기
        </Link>
      </div>

      {/* 열람 느낌 — 가짜 수치/실시간 표현 없이 정적 유형 예시 */}
      <div className="mt-12 max-w-[400px] mx-auto px-2">
        <p className="text-[12px] text-mute mb-3">운명PT에서 자주 확인하는 반복 패턴</p>
        <ul className="space-y-2 text-left">
          {VIEWER_TYPES.map((v) => (
            <li key={v.name} className="flex items-center gap-2.5 rounded-lg border border-hairline bg-surface-soft px-3.5 py-2.5">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hairline text-[11px] text-body">
                {v.name[0]}
              </span>
              <span className="text-[12px] text-body">
                <span className="text-ink">{v.name}님</span> · {v.type}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
