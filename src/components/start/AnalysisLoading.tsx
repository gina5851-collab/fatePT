"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "생년월일로 명식 구조를 계산하고 있어요",
  "일간과 오행의 균형을 확인하고 있어요",
  "MBTI와 사주가 충돌하는 지점을 찾고 있어요",
  "관계·돈·일·감정의 반복 패턴을 추출하고 있어요",
  "2026년 흐름을 정리하고 있어요",
];

export function AnalysisLoading() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => Math.min(i + 1, STEPS.length - 1)), 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto max-w-[420px] px-4 py-20 text-center">
      <div className="mb-8 flex justify-center">
        <span className="inline-block h-10 w-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
      <ul className="space-y-3">
        {STEPS.map((s, i) => (
          <li key={i} className={`text-[14px] transition-all duration-300 ${i <= idx ? "text-ink" : "text-mute/40"}`}>
            {i < idx ? "✓ " : i === idx ? "· " : ""}{s}
          </li>
        ))}
      </ul>
      <p className="mt-10 text-[12px] leading-relaxed text-mute">
        좋은 말만 모으는 리포트가 아니에요.
        <br />
        반복되는 이유와 바꿀 지점을 함께 찾고 있어요.
      </p>
    </div>
  );
}
