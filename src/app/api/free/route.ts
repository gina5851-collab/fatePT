import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { generateSajuResult } from "@/lib/saju/generate-result";

const FREE_SLUG = "free-taste";
const DAY_MS = 24 * 60 * 60 * 1000;

const bodySchema = z.object({
  name: z.string().max(50).optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birthTime: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  timeUnknown: z.boolean(),
  gender: z.enum(["male", "female"]),
  calendar: z.enum(["solar", "lunar"]),
  concerns: z.array(z.string().max(20)).max(20),
  // MBTI: 현재 saju_inputs에 컬럼 없음 → DB 연결 단계에서 영속화. 지금은 수신만(무시 OK).
  mbti: z.string().max(8).optional(),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    const fieldErrors = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" | ");
    return NextResponse.json({ error: "잘못된 요청입니다", detail: fieldErrors }, { status: 400 });
  }
  const body = parsed.data;

  // 게스트 허용 — 무료 진단은 마찰 없이 결과부터. 로그인했으면 user_id 연결로 마이페이지 회수.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  const service = createServiceClient();

  // 무료 상품 확인 (서버에서만 — price 0 인 free-taste 만 허용)
  const { data: product } = await service
    .from("products")
    .select("id, price, is_active")
    .eq("slug", FREE_SLUG)
    .maybeSingle();
  if (!product || !product.is_active || product.price !== 0) {
    return NextResponse.json({ error: "무료 진단을 사용할 수 없습니다" }, { status: 404 });
  }

  // 하루 1회 제한 — 로그인 사용자만 적용. 게스트는 비활성(어뷰징 시 IP 기반 추가 예정).
  if (userId) {
    const since = new Date(Date.now() - DAY_MS).toISOString();
    const { count } = await service
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("payment_method", "free")
      .gte("created_at", since);
    if ((count ?? 0) >= 1) {
      return NextResponse.json(
        { error: "오늘 무료 진단은 이미 받으셨어요. 내일 다시 받아볼 수 있어요." },
        { status: 429 },
      );
    }
  }

  // 무료 주문 생성 (0원, 즉시 paid) — 게스트는 user_id=null
  const orderId = `free_${nanoid(20)}`;
  const { data: order, error: orderErr } = await service
    .from("orders")
    .insert({
      order_id: orderId,
      user_id: userId,
      guest_email: null,
      product_id: product.id,
      amount: 0,
      status: "paid",
      payment_method: "free",
      paid_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (orderErr || !order) {
    return NextResponse.json({ error: "무료 진단 생성 실패", detail: orderErr?.message }, { status: 500 });
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

  try {
    const resultId = await generateSajuResult(order.id, product.id);
    return NextResponse.json({ resultId });
  } catch (err) {
    return NextResponse.json(
      { error: "무료 진단 생성 실패", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
