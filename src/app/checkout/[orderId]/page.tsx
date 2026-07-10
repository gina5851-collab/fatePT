import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { TossWidget } from "@/components/checkout/TossWidget";
import { BankTransferInfo } from "@/components/checkout/BankTransferInfo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKRW } from "@/lib/utils";
import { bankTransfer } from "@/config/site";
import { getCatalogProduct } from "@/config/catalog";

export const metadata = { title: "결제" };

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const service = createServiceClient();

  const { data: order } = await service
    .from("orders")
    .select("id, order_id, amount, status, user_id, guest_email, product_id, payment_method, depositor_name")
    .eq("order_id", orderId)
    .maybeSingle();

  if (!order) notFound();
  if (order.status === "paid") {
    const { data: result } = await service
      .from("saju_results")
      .select("id")
      .eq("order_id", order.id)
      .maybeSingle();
    if (result) redirect(`/results/${result.id}`);
  }

  const { data: product } = await service
    .from("products")
    .select("name, slug")
    .eq("id", order.product_id)
    .single();

  const customerKey = order.user_id ?? `guest_${order.id}`;
  const email = order.guest_email;
  const isBankTransfer = order.payment_method === "bank_transfer";

  // 카탈로그 표시 정보 (제공 시간·발행 방식) — 표시 전용, 결제 로직과 무관
  const catalog = product?.slug ? getCatalogProduct(product.slug) : undefined;
  const displayName = catalog?.displayName ?? product?.name ?? "사주 상품";

  return (
    <div className="container py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{isBankTransfer ? "무통장입금" : "결제"}</CardTitle>
          <CardDescription>
            {displayName} · <span className="font-semibold text-foreground">{formatKRW(order.amount)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 주문 요약 — 결제 직전 고객이 확인하는 정보 */}
          <div className="mb-6 rounded-lg border border-hairline bg-surface-soft px-4 py-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-body">상품</span>
              <span className="font-medium text-ink">{displayName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-body">결제 금액</span>
              <span className="font-mono font-semibold text-ink">{formatKRW(order.amount)}</span>
            </div>
            {catalog ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-body">결과 제공</span>
                <span className="text-ink">
                  {catalog.delivery.mode === "auto" ? "⚡ " : "✍️ "}
                  {catalog.delivery.timeText}
                </span>
              </div>
            ) : null}
            {isBankTransfer ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-body">입금 확인</span>
                <span className="text-ink">확인 후 {bankTransfer.processingTime} 이내 발행</span>
              </div>
            ) : null}
          </div>

          {isBankTransfer ? (
            <BankTransferInfo
              bankName={bankTransfer.bankName}
              accountNumber={bankTransfer.accountNumber}
              accountHolder={bankTransfer.accountHolder}
              amount={order.amount}
              orderId={order.order_id}
              depositorName={order.depositor_name}
              processingTime={bankTransfer.processingTime}
            />
          ) : (
            <TossWidget
              orderId={order.order_id}
              amount={order.amount}
              customerKey={customerKey}
              productName={product?.name ?? "사주 상품"}
              customerEmail={email}
            />
          )}

          <p className="mt-5 text-center text-[11px] text-mute leading-relaxed">
            결제 진행 시{" "}
            <Link href="/legal/refund-policy" className="underline underline-offset-2 hover:text-ink">
              환불정책
            </Link>
            에 동의한 것으로 간주됩니다. 결과 발행 전에는 전액 환불이 가능합니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
