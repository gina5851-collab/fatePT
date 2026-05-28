"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { generateSajuResult } from "@/lib/saju/generate-result";

// 무통장입금 입금확인 → paid 처리 + 결과지 생성.
// paid 인데 결과가 없는 주문(토스/무통장 공통)의 결과 재생성에도 사용.
export async function confirmBankTransferAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("관리자 인증이 필요합니다");
  }

  const orderInternalId = String(formData.get("orderId") ?? "");
  if (!orderInternalId) throw new Error("주문 id 가 누락되었습니다");

  const service = createServiceClient();
  const { data: order } = await service
    .from("orders")
    .select("id, status, payment_method, product_id")
    .eq("id", orderInternalId)
    .maybeSingle();

  if (!order) throw new Error("주문을 찾을 수 없습니다");

  // pending 은 무통장입금 주문만 수동 결제 처리 (토스 주문은 confirm 라우트로만 paid 됨)
  if (order.status === "pending") {
    if (order.payment_method !== "bank_transfer") {
      throw new Error("무통장입금 주문만 수동 입금확인이 가능합니다");
    }
    await service
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", order.id);
  }

  // 결과지 생성 (이미 있으면 재사용 — idempotent)
  await generateSajuResult(order.id, order.product_id);

  revalidatePath("/admin/orders");
}
