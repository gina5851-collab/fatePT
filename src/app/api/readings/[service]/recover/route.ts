import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isReadingService } from "@/lib/readings/registry";
import { runPaidReading, publishReading } from "@/lib/readings/engine";

// LLM 해석 생성이 포함될 수 있어 confirm 과 동일하게 60초로 확장.
export const maxDuration = 60;

// 결제 완료된 본인 주문의 결과를 복구한다 — 결제·주문·드로우는 절대 새로 만들지 않는다.
// 마이페이지(내부 id)와 결과 대기 페이지(public_token) 양쪽에서 호출된다.
const bodySchema = z
  .object({
    orderId: z.string().uuid().optional(),
    publicToken: z.string().min(10).max(200).optional(),
  })
  .refine((b) => b.orderId || b.publicToken, { message: "orderId 또는 publicToken 이 필요합니다" });

export async function POST(request: NextRequest, { params }: { params: Promise<{ service: string }> }) {
  const { service: serviceType } = await params;
  if (!isReadingService(serviceType)) {
    return NextResponse.json({ error: "지원하지 않는 서비스입니다" }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }

  const service = createServiceClient();
  const query = service.from("orders").select("id, user_id, status, service_type, public_token");
  const { data: order } = parsed.data.orderId
    ? await query.eq("id", parsed.data.orderId).maybeSingle()
    : await query.eq("public_token", parsed.data.publicToken!).maybeSingle();

  if (!order || order.service_type !== serviceType) {
    return NextResponse.json({ error: "주문을 찾을 수 없습니다" }, { status: 404 });
  }
  // 내부 orderId 경로(마이페이지) — 로그인 + 본인 주문 확인 필수.
  // publicToken 경로는 결제자 본인에게만 전달되는 비밀 URL 자체가 인증 수단이다:
  // 결과 페이지가 이미 같은 토큰만으로 전체 결과를 노출하므로 추가 권한 상승이 없고,
  // 관리자·사용자 로그인 없이도 결제 완료 주문의 결과를 복구할 수 있어야 한다.
  if (parsed.data.orderId) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 });
    }
    // 본인 주문만 — 다른 사용자의 주문은 존재 여부와 무관하게 거부
    if (order.user_id !== user.id) {
      return NextResponse.json({ error: "본인 주문만 복구할 수 있습니다" }, { status: 403 });
    }
  }
  // 결제 미완료 주문은 복구 대상이 아니다 (임의 paid 처리 금지)
  if (order.status !== "paid") {
    return NextResponse.json({ error: "결제가 완료된 주문만 복구할 수 있습니다" }, { status: 409 });
  }

  const resultUrl = order.public_token ? `/tarot/result/${order.public_token}` : null;

  const { data: reading } = await service
    .from("readings")
    .select("status, final_result")
    .eq("order_id", order.id)
    .maybeSingle();

  // 이미 발행됨 — 아무것도 새로 만들지 않고 기존 결과로 안내
  if (reading?.status === "published" && reading.final_result) {
    return NextResponse.json({ resultUrl, readingStatus: "published", recovered: false });
  }

  try {
    // 초안까지 있으면 발행만 (LLM 재호출 없음)
    if (reading?.status === "draft") {
      await publishReading(order.id);
      return NextResponse.json({ resultUrl, readingStatus: "published", recovered: true });
    }
    // 없음/드로우만/실패/generating — 엔진이 idempotent 처리:
    // ensureDrawn 은 기존 드로우를 재사용하고(재드로우 없음), readings 는
    // order_id unique + 원자적 claim 이라 정확히 1행·1생성만 존재한다.
    // 신선한 generating 은 엔진이 가로채지 않고 'generating' 을 반환하며,
    // 고착된 generating(함수 사망)만 claim 해 이어서 생성한다. 결제 로직은 호출하지 않는다.
    const { status } = await runPaidReading(order.id);
    if (status === "published") {
      return NextResponse.json({ resultUrl, readingStatus: status, recovered: true });
    }
    if (status === "generating") {
      // 다른 요청이 생성 진행 중 — 중복 생성 없이 진행 상태만 반환
      return NextResponse.json({ resultUrl, readingStatus: "generating", recovered: false });
    }
    return NextResponse.json(
      { error: "결과 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.", resultUrl, readingStatus: status },
      { status: 502 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: "결과 복구 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        detail: err instanceof Error ? err.message : String(err),
        resultUrl,
      },
      { status: 500 },
    );
  }
}
