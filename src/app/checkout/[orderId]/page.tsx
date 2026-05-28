import { notFound, redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { TossWidget } from "@/components/checkout/TossWidget";
import { BankTransferInfo } from "@/components/checkout/BankTransferInfo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatKRW } from "@/lib/utils";
import { bankTransfer } from "@/config/site";

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
    .select("name")
    .eq("id", order.product_id)
    .single();

  const customerKey = order.user_id ?? `guest_${order.id}`;
  const email = order.guest_email;
  const isBankTransfer = order.payment_method === "bank_transfer";

  return (
    <div className="container py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{isBankTransfer ? "무통장입금" : "결제"}</CardTitle>
          <CardDescription>
            {product?.name ?? "사주 상품"} · <span className="font-semibold text-foreground">{formatKRW(order.amount)}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
