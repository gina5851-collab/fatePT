"use client";

import { useEffect, useState } from "react";

// 세션 기준 카운트다운 — "이 가격은 지금만" 긴급성.
// 거짓 재고/가짜 인원이 아니라, 첫 진입 시점부터의 한정 타이머(과장광고 회피).
export function CountdownPill({ minutes = 30 }: { minutes?: number }) {
  const [left, setLeft] = useState(minutes * 60);
  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-[12px] font-medium text-amber-300">
      ⏳ 이 할인가 {mm}:{ss} 남음
    </span>
  );
}
