"use client";

import { useEffect, useState } from "react";

type Props = {
  label: string; // 예: "34,900원 · 결제 후 바로 확인"
  targetId: string; // 스크롤 이동할 섹션 id (입력 폼)
};

// 모바일 하단 고정 CTA — 일정 스크롤 후 표시, 입력 폼이 보이면 숨김.
export function StickyCta({ label, targetId }: Props) {
  const [show, setShow] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);

  if (!show || formVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-gradient-to-t from-black/25 to-transparent pointer-events-none">
      <button
        type="button"
        onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" })}
        className="pointer-events-auto block w-full rounded-xl bg-sf-amber py-3.5 text-[15px] font-bold text-sf-navy shadow-lg active:opacity-90"
      >
        {label}
      </button>
    </div>
  );
}
