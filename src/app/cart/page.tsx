import { CartView } from "@/components/cart/CartView";

export const metadata = { title: "장바구니" };

// BrandG 장바구니 (localStorage 데모용).
// DB/결제 무관 — 결제 연결은 별도 phase.
export default function CartPage() {
  return (
    <div className="container py-10 max-w-xl">
      <header className="mb-6">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">CART</p>
        <h1 className="text-2xl font-bold text-ink">장바구니</h1>
      </header>
      <CartView />
    </div>
  );
}
