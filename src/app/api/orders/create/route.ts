import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { createClient, createServiceClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  productId: z.string().uuid(),
  name: z.string().max(50).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  timeUnknown: z.boolean(),
  gender: z.enum(["male", "female"]),
  calendar: z.enum(["solar", "lunar"]),
  concerns: z.array(z.string().max(20)).max(20),
  mbti: z.string().max(8).optional(),
  paymentMethod: z.enum(["toss", "bank_transfer"]).default("toss"),
  depositorName: z.string().max(50).optional(),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다", details: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;

  // 로그인 필수 — 결과는 마이페이지에서 수령
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  // 가격은 서버에서만 (클라 변조 방지)
  const service = createServiceClient();
  const { data: product, error: productErr } = await service
    .from("products")
    .select("id, price, is_active, service_type")
    .eq("id", body.productId)
    .maybeSingle();

  if (productErr || !product || !product.is_active) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다" }, { status: 404 });
  }
  // 서버측 방어 — 이 라우트는 사주 상품만 처리(URL/요청 조작으로 타로 상품이
  // 사주 주문·SajuForm 플로우로 넘어오는 것을 차단). 타로는 /api/readings/tarot/orders 사용.
  if (product.service_type !== "saju") {
    return NextResponse.json({ error: "이 상품은 여기서 주문할 수 없습니다" }, { status: 400 });
  }

  const orderId = `ord_${nanoid(20)}`;

  const { data: order, error: orderErr } = await service
    .from("orders")
    .insert({
      order_id: orderId,
      user_id: user.id,
      guest_email: null,
      product_id: product.id,
      amount: product.price,
      status: "pending",
      payment_method: body.paymentMethod,
      depositor_name: body.paymentMethod === "bank_transfer" ? body.depositorName ?? null : null,
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: "주문 생성 실패", detail: orderErr?.message }, { status: 500 });
  }

  const { error: inputErr } = await service.from("saju_inputs").insert({
    order_id: order.id,
    name: body.name ?? null,
    birth_date: body.birthDate,
    birth_time: body.birthTime,
    time_unknown: body.timeUnknown,
    gender: body.gender,
    calendar: body.calendar,
    concerns: body.concerns,
    mbti: body.mbti ?? null,
  });

  if (inputErr) {
    await service.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "사주 정보 저장 실패", detail: inputErr.message }, { status: 500 });
  }

  return NextResponse.json({ orderId, amount: product.price, paymentMethod: body.paymentMethod });
}
