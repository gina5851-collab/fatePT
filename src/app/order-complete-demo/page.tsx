import { OrderCompleteDemoView } from "@/components/checkout/OrderCompleteDemoView";

export const metadata = { title: "주문완료 (데모)" };

// /order-complete-demo — BrandG 주문완료 데모.
// 기존 /checkout/success (운명PT 결제 완료) 무영향.
export default function OrderCompleteDemoPage() {
  return (
    <div className="brandg-shop">
      <div className="container py-8 max-w-xl">
        <OrderCompleteDemoView />
      </div>
    </div>
  );
}
