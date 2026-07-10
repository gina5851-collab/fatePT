import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { confirmTossPayment } from "@/lib/toss/confirm";
import { generateSajuResult } from "@/lib/saju/generate-result";
import { runPaidReading } from "@/lib/readings/engine";

// Vercel function timeout 60초 (Pro 플랜 한도). Hobby 플랜이면 10초로 강제됨.
// generateSajuResult (LLM + 만세력 외부 호출) 이 기본 10초보다 길어 timeout 빈발 → 60초로 확장.
// 비즈니스 로직 변경 없음.
export const maxDuration = 60;

const bodySchema = z.object({
  paymentKey: z.string().min(1),
  orderId: z.string().min(1),
  amount: z.number().int().nonnegative(),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }
  const { paymentKey, orderId, amount } = parsed.data;

  const service = createServiceClient();

  // 1. DB의 주문과 amount 일치 검증 (위변조 차단)
  const { data: order, error: orderErr } = await service
    .from("orders")
    .select("id, amount, status, product_id, user_id, guest_email, service_type, public_token")
    .eq("order_id", orderId)
    .maybeSingle();

  if (orderErr || !order) {
    return NextResponse.json({ error: "주문을 찾을 수 없습니다" }, { status: 404 });
  }
  if (order.status === "paid") {
    // idempotent: 이미 결제된 주문 — 결과 페이지로 안내
    // 타로(및 그 외 리딩 서비스)는 publicToken 으로, 사주는 기존 resultId 로 안내.
    if (order.service_type === "tarot") {
      return NextResponse.json({ publicToken: order.public_token, service: order.service_type, alreadyPaid: true });
    }
    const { data: result } = await service
      .from("saju_results")
      .select("id")
      .eq("order_id", order.id)
      .maybeSingle();
    return NextResponse.json({ resultId: result?.id ?? null, alreadyPaid: true });
  }
  if (order.amount !== amount) {
    return NextResponse.json({ error: "금액이 일치하지 않습니다" }, { status: 400 });
  }

  // 2. 토스 confirm
  const toss = await confirmTossPayment({ paymentKey, orderId, amount });
  if (!toss.ok) {
    await service.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json({ error: toss.error.message, code: toss.error.code }, { status: 402 });
  }
  if (toss.data.totalAmount !== amount) {
    await service.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json({ error: "토스 응답 금액 불일치" }, { status: 400 });
  }

  await service
    .from("orders")
    .update({
      status: "paid",
      toss_payment_key: paymentKey,
      paid_at: toss.data.approvedAt,
    })
    .eq("id", order.id);

  // 3. 결과 생성 — 결제 승인 완료 후 service_type 으로만 분기.
  //    (Toss 승인/orderId/금액/중복방지 로직은 위에서 서비스 무관하게 공통 처리됨)

  // ── tarot(및 그 외 리딩 서비스): 공통 Reading 엔진 ──
  //    드로우 → (auto 상품)초안생성+발행 / (review 상품)드로우만.
  //    LLM 실패가 결제 흐름을 깨지 않도록, 실패해도 publicToken 을 반환한다.
  if (order.service_type === "tarot") {
    try {
      const { publicToken, status } = await runPaidReading(order.id);
      return NextResponse.json({ publicToken, service: order.service_type, readingStatus: status });
    } catch (err) {
      return NextResponse.json({
        publicToken: order.public_token,
        service: order.service_type,
        readingStatus: "failed",
        detail: err instanceof Error ? err.message : String(err),
        hint: "결제는 정상 승인되었습니다. /admin/readings 에서 재생성할 수 있습니다.",
      });
    }
  }

  // ── saju: 기존 경로 그대로 (동작·응답형식·결과 URL 변경 없음) ──
  try {
    const resultId = await generateSajuResult(order.id, order.product_id);
    return NextResponse.json({ resultId });
  } catch (err) {
    return NextResponse.json(
      {
        error: "사주 해석 생성 실패",
        detail: err instanceof Error ? err.message : String(err),
        hint: "결제는 정상 승인되었습니다. /admin/orders 에서 수동 재생성하거나 환불을 진행하세요.",
      },
      { status: 500 },
    );
  }
}
