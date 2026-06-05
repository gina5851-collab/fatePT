"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/useCart";
import { cartTotal, cartCount, clearCart } from "@/lib/cart/storage";
import { formatKRW } from "@/lib/utils";
import { CartItemRow } from "./CartItemRow";

// /cart 페이지 본문 — localStorage 구독, SSR 빈 상태 → mount 후 동기.
export function CartView() {
  const { items, mounted } = useCart();

  if (!mounted) {
    return (
      <div className="py-20 text-center text-mute text-sm">장바구니 불러오는 중...</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-[14px] text-body mb-1">아직 담은 G가 없어요.</p>
        <p className="text-[12px] text-mute mb-6">먼저 둘러보고 마음에 드는 걸 담아보세요.</p>
        <Link
          href="/products"
          className="inline-flex rounded-xl bg-ink text-canvas px-5 py-3 text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          상품 둘러보기 →
        </Link>
      </div>
    );
  }

  const total = cartTotal(items);
  const count = cartCount(items);

  return (
    <div>
      <div className="rounded-2xl border border-hairline bg-canvas">
        {items.map((it) => (
          <CartItemRow key={it.slug} item={it} />
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-hairline bg-surface-soft p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-mute">담은 상품 ({count}개)</span>
          <span className="text-[13px] font-mono text-ink">{formatKRW(total)}</span>
        </div>
        <div className="flex items-center justify-between mb-4 pt-2 border-t border-hairline">
          <span className="text-[14px] font-semibold text-ink">예상 결제 금액</span>
          <span className="text-[18px] font-mono font-bold text-ink">{formatKRW(total)}</span>
        </div>
        <button
          type="button"
          disabled
          className="w-full rounded-xl bg-ink/50 text-canvas py-3.5 text-[14px] font-semibold cursor-not-allowed"
          aria-disabled
        >
          결제하기 — 데모 준비 중
        </button>
        <p className="mt-2 text-center text-[11px] text-mute">
          결제 연결은 다음 단계에 열립니다. 지금은 담아만 볼 수 있어요.
        </p>
        <button
          type="button"
          onClick={() => clearCart()}
          className="mt-4 w-full text-[12px] text-mute hover:text-ink underline underline-offset-2"
        >
          장바구니 비우기
        </button>
      </div>
    </div>
  );
}
