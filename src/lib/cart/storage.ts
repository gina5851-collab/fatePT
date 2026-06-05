// =====================================================
// BrandG 장바구니 (localStorage 데모용)
// =====================================================
// DB 무관, 클라이언트 전용. 결제/주문/checkout 으로 이어지지 않음 (Phase F 별도).
// 변경 감지: 'brandg-cart-change' 커스텀 이벤트 + 'storage' (탭 간 동기).

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  gradient: string;
  qty: number;
};

const KEY = "brandg.cart.v1";
const EVT = "brandg-cart-change";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(): CartItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is CartItem =>
      x && typeof x.slug === "string" && typeof x.qty === "number" && x.qty > 0
    );
  } catch {
    return [];
  }
}

function write(items: CartItem[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
}

export function getCart(): CartItem[] {
  return read();
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1): CartItem[] {
  const items = read();
  const idx = items.findIndex((it) => it.slug === item.slug);
  if (idx >= 0) {
    items[idx] = { ...items[idx], qty: items[idx].qty + qty };
  } else {
    items.push({ ...item, qty });
  }
  write(items);
  return items;
}

export function removeFromCart(slug: string): CartItem[] {
  const items = read().filter((it) => it.slug !== slug);
  write(items);
  return items;
}

export function setCartItemQty(slug: string, qty: number): CartItem[] {
  if (qty <= 0) return removeFromCart(slug);
  const items = read().map((it) => (it.slug === slug ? { ...it, qty } : it));
  write(items);
  return items;
}

export function clearCart(): CartItem[] {
  write([]);
  return [];
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, it) => sum + it.qty, 0);
}

export const CART_CHANGE_EVENT = EVT;
