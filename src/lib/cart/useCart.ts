"use client";

import { useEffect, useState } from "react";
import { CART_CHANGE_EVENT, getCart, type CartItem } from "./storage";

// localStorage 장바구니 구독 훅. SSR-safe (초기 [] → mount 후 동기).
export function useCart(): { items: CartItem[]; mounted: boolean } {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(getCart());
    setMounted(true);
    const sync = () => setItems(getCart());
    window.addEventListener(CART_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { items, mounted };
}
