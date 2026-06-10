"use client";

import Link from "next/link";
import { formatKRW } from "@/lib/utils";
import { setCartItemQty, removeFromCart, type CartItem } from "@/lib/cart/storage";

export function CartItemRow({ item }: { item: CartItem }) {
  return (
    <div className="flex gap-3 py-4 border-b border-hairline last:border-b-0">
      <Link
        href={`/products/${item.slug}`}
        className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-b ${item.gradient}`}
        aria-label={item.name}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-mute">{item.brand}</p>
        <Link href={`/products/${item.slug}`} className="block text-[13px] font-medium text-ink leading-snug hover:underline">
          {item.name}
        </Link>
        <div className="mt-1.5 flex items-baseline gap-2">
          {item.originalPrice ? (
            <span className="text-[11px] font-mono text-mute line-through">{formatKRW(item.originalPrice)}</span>
          ) : null}
          <span className="text-[13px] font-mono font-semibold text-ink">{formatKRW(item.price)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="inline-flex items-center rounded-lg border border-hairline">
            <button
              type="button"
              onClick={() => setCartItemQty(item.slug, item.qty - 1)}
              className="w-7 h-7 text-mute hover:text-ink"
              aria-label="수량 감소"
            >
              −
            </button>
            <span className="w-8 text-center text-[13px] font-mono text-ink">{item.qty}</span>
            <button
              type="button"
              onClick={() => setCartItemQty(item.slug, item.qty + 1)}
              className="w-7 h-7 text-mute hover:text-ink"
              aria-label="수량 증가"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeFromCart(item.slug)}
            className="text-[11px] text-mute hover:text-ink underline underline-offset-2"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
