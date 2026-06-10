// 데모용 "마지막 주문" 스냅샷 — sessionStorage 에 저장.
// 결제 데모(checkout-demo) → 주문완료(order-complete-demo) 사이 데이터 캐리.
// 실제 DB/결제 무관.

import type { CartItem } from "./storage";

export type LastOrder = {
  orderId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  customerName: string;
};

const KEY = "brandg.lastOrder";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BG-${ts}-${rand}`;
}

export function saveLastOrder(order: LastOrder): void {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(KEY, JSON.stringify(order));
}

export function getLastOrder(): LastOrder | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.orderId || !Array.isArray(parsed.items)) return null;
    return parsed as LastOrder;
  } catch {
    return null;
  }
}

export function clearLastOrder(): void {
  if (!isBrowser()) return;
  window.sessionStorage.removeItem(KEY);
}
