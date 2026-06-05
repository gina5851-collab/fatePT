"use client";

import { useState } from "react";
import { toast } from "sonner";
import { addToCart, type CartItem } from "@/lib/cart/storage";

type Props = {
  item: Omit<CartItem, "qty">;
  qty?: number;
  variant?: "primary" | "secondary";
  size?: "default" | "lg";
  className?: string;
};

export function AddToCartButton({ item, qty = 1, variant = "primary", size = "default", className = "" }: Props) {
  const [adding, setAdding] = useState(false);

  function handleClick() {
    setAdding(true);
    addToCart(item, qty);
    toast.success("장바구니에 담았어요", { description: item.name });
    setTimeout(() => setAdding(false), 600);
  }

  const base = "rounded-xl font-bold transition-colors disabled:opacity-50";
  const sizing = size === "lg" ? "px-6 py-3.5 text-[15px]" : "px-4 py-2.5 text-[13px]";
  const tone =
    variant === "primary"
      ? "bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
      : "border border-hairline bg-canvas text-ink hover:border-ink";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={adding}
      className={`${base} ${sizing} ${tone} ${className}`}
    >
      {adding ? "담는 중..." : "장바구니 담기"}
    </button>
  );
}
