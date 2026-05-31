"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { activeTiers } from "@/config/report-pricing";
import { formatKRW } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

// 모바일 하단 고정 CTA — 무료 결과 첫 섹션을 지나면 등장.
// "결제" 아닌 "열기/해금" 톤. 페이월 카드 근처에선 중복 회피로 숨김.
export function StickyUnlockCTA({
  displayName,
  totalLocked,
  sourceResultId,
}: {
  displayName: string;
  totalLocked: number;
  /** 무료 결과 → 결제 흐름에 source 로 carry. */
  sourceResultId?: string;
}) {
  const [show, setShow] = useState(false);
  const tiers = activeTiers();
  const best = tiers.find((t) => t.highlight) ?? tiers[0];
  if (!best) return null;
  const qs = sourceResultId ? `?source=${encodeURIComponent(sourceResultId)}` : "";

  useEffect(() => {
    const onScroll = () => {
      // 화면 1.5배 스크롤 후 등장
      const triggered = window.scrollY > window.innerHeight * 1.2;
      // 페이지 끝에서 200px 안쪽이면 페이월 카드와 겹치므로 숨김
      const docH = document.documentElement.scrollHeight;
      const nearBottom = window.scrollY + window.innerHeight > docH - 280;
      setShow(triggered && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-transform duration-200 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-[440px] px-3 pb-3">
        <Link
          href={`/products/${best.productSlug}${qs}`}
          onClick={() =>
            trackEvent("sticky_unlock_click", {
              page: "free_result",
              product: best.productSlug,
              price: best.price,
              source: sourceResultId,
            })
          }
          className="flex items-center justify-between rounded-2xl bg-amber-400 text-[#0c1322] px-5 py-3.5 shadow-lg hover:opacity-90 active:scale-[0.99] transition"
        >
          <div className="text-left">
            <p className="text-[11px] font-medium opacity-70">{formatKRW(best.price)}</p>
            <p className="text-[14px] font-bold leading-tight">
              잠긴 {totalLocked}개 항목 전체 열기
            </p>
          </div>
          <span className="text-xl font-bold ml-3" aria-hidden>→</span>
        </Link>
        <p className="mt-1.5 text-center text-[10px] text-mute">
          {displayName}님 전체 리포트를 이어서 확인하세요
        </p>
      </div>
    </div>
  );
}
