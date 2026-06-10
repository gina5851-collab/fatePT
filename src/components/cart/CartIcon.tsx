"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/useCart";
import { cartCount } from "@/lib/cart/storage";

// 헤더 우측 장바구니 아이콘 + 수량 뱃지 (localStorage 구독).
export function CartIcon({ className = "" }: { className?: string }) {
  const { items, mounted } = useCart();
  const count = mounted ? cartCount(items) : 0;

  return (
    <Link
      href="/cart"
      aria-label={`장바구니${count > 0 ? ` (${count}개)` : ""}`}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-md hover:bg-black/5 transition-colors ${className}`}
      style={{ color: "#2A2A24" }}
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 8H6" />
        <circle cx="10" cy="20" r="1.2" />
        <circle cx="17" cy="20" r="1.2" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-[10px] font-bold text-[#0c1322] flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
