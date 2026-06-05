import { CheckoutDemoView } from "@/components/checkout/CheckoutDemoView";

export const metadata = { title: "주문서 (데모)" };

// /checkout-demo — BrandG 주문서 데모.
// 실제 결제/Toss/API 호출 0. 기존 /checkout/[orderId] (운명PT 결제 흐름) 무영향.
export default function CheckoutDemoPage() {
  return (
    <div className="brandg-shop">
      <div className="container py-8 max-w-[1080px]">
        <header className="mb-6">
          <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">CHECKOUT (DEMO)</p>
          <h1 className="text-2xl font-bold text-ink">주문서</h1>
          <p className="mt-1 text-[12px] text-mute">결제 기능은 추후 연결 예정입니다. 흐름 데모용 화면입니다.</p>
        </header>
        <CheckoutDemoView />
      </div>
    </div>
  );
}
