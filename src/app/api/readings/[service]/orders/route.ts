import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isReadingService } from "@/lib/readings/registry";
import { generatePublicToken } from "@/lib/readings/status";
import { getTarotProduct, allowedSpreads } from "@/lib/readings/services/tarot/config";

const bodySchema = z.object({
  productSlug: z.string().min(1),
  question: z.string().max(300).optional(),
  // 3 카드 타로의 구성 선택(과거/현재/미래 등). 서버가 상품 설정의 허용 목록으로 검증한다.
  spreadKind: z.string().max(40).optional(),
  paymentMethod: z.enum(["toss", "bank_transfer"]).default("toss"),
  depositorName: z.string().max(50).optional(),
  source: z.string().max(200).optional(), // UTM/광고 유입
});

// 주문 임시 생성 — 결제 전. 서버가 가격/스프레드를 결정(클라 변조 방지).
export async function POST(request: NextRequest, { params }: { params: Promise<{ service: string }> }) {
  const { service: serviceType } = await params;
  if (!isReadingService(serviceType)) {
    return NextResponse.json({ error: "지원하지 않는 서비스입니다" }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다", details: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;

  // 로그인 필수 — 결과는 마이페이지/결과 링크에서 수령
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
  }

  const service = createServiceClient();

  // 상품 — service_type 일치 + 활성만. 가격은 DB 기준.
  const { data: product, error: productErr } = await service
    .from("products")
    .select("id, slug, price, is_active, service_type")
    .eq("slug", body.productSlug)
    .maybeSingle();
  if (productErr || !product || !product.is_active || product.service_type !== serviceType) {
    return NextResponse.json({ error: "상품을 찾을 수 없습니다" }, { status: 404 });
  }

  // 스프레드는 서버가 상품 설정에서 결정(타로).
  // 고객 선택(spreadKind)은 해당 상품의 허용 목록 안에서만 반영 — 그 외에는 기본값.
  let spread: string | null = null;
  if (serviceType === "tarot") {
    const tp = getTarotProduct(product.slug);
    if (!tp) return NextResponse.json({ error: "상품 설정을 찾을 수 없습니다" }, { status: 404 });
    const allowed = allowedSpreads(tp);
    spread =
      body.spreadKind && (allowed as string[]).includes(body.spreadKind) ? body.spreadKind : tp.spread;
  }

  const orderId = `ord_${nanoid(20)}`;
  const publicToken = generatePublicToken();

  const { data: order, error: orderErr } = await service
    .from("orders")
    .insert({
      order_id: orderId,
      user_id: user.id,
      product_id: product.id,
      amount: product.price,
      status: "pending",
      payment_method: body.paymentMethod,
      depositor_name: body.paymentMethod === "bank_transfer" ? body.depositorName ?? null : null,
      service_type: serviceType as "tarot",
      public_token: publicToken,
      source: body.source ?? null,
      // 결제 전에는 리딩 미시작 → reading_status 는 confirm 이후 설정
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ error: "주문 생성 실패", detail: orderErr?.message }, { status: 500 });
  }

  const { error: inputErr } = await service.from("reading_inputs").insert({
    order_id: order.id,
    service_type: serviceType as "tarot",
    payload: { question: body.question?.trim() || null, spread },
  });
  if (inputErr) {
    await service.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "리딩 입력 저장 실패", detail: inputErr.message }, { status: 500 });
  }

  return NextResponse.json({ orderId, amount: product.price, paymentMethod: body.paymentMethod });
}
