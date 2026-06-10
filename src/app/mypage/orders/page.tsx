import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatKRW, formatDate } from "@/lib/utils";

export const metadata = { title: "결제 내역" };

const STATUS_LABEL: Record<string, string> = {
  paid: "결제완료",
  pending: "결제대기",
  failed: "실패",
};

export default async function MyOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/mypage/orders");

  // 본인 user_id + guest_email 매칭 둘 다 조회 (게스트 결제 후 가입한 케이스)
  const service = createServiceClient();
  const { data: orders } = await service
    .from("orders")
    .select("id, order_id, amount, status, created_at, product_id, user_id")
    .or(`user_id.eq.${user.id},guest_email.eq.${user.email}`)
    .order("created_at", { ascending: false });

  const productIds = Array.from(new Set((orders ?? []).map((o) => o.product_id)));
  const { data: products } = productIds.length
    ? await service.from("products").select("id, name").in("id", productIds)
    : { data: [] };
  const productMap = new Map((products ?? []).map((p) => [p.id, p.name]));

  const orderIds = (orders ?? []).map((o) => o.id);
  const { data: results } = orderIds.length
    ? await service.from("saju_results").select("id, order_id").in("order_id", orderIds)
    : { data: [] };
  const resultMap = new Map((results ?? []).map((r) => [r.order_id, r.id]));
  const { data: reviews } = orderIds.length
    ? await service.from("reviews").select("order_id").in("order_id", orderIds)
    : { data: [] };
  const reviewedSet = new Set((reviews ?? []).map((r) => r.order_id));

  return (
    <div className="brandg-shop">
    <div className="container py-12 max-w-3xl">
      <header className="mb-8">
        <p className="text-xs font-mono text-mute mb-2">ORDERS</p>
        <h1 className="text-2xl font-semibold tracking-tight">주문 내역</h1>
        <p className="mt-1 text-[12px] text-mute">결제 완료된 주문과 결과지·후기 작성을 모았어요.</p>
      </header>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-body mb-1">아직 주문 내역이 없어요.</p>
          <p className="text-[12px] text-mute mb-6">담아둔 G가 있으면 바로 주문해보세요.</p>
          <Link
            href="/products"
            className="inline-flex rounded-xl bg-amber-500 text-white px-5 py-3 text-[13px] font-bold hover:bg-amber-600 transition-colors shadow-sm"
          >
            상품 둘러보기 →
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {orders.map((o) => {
            const resultId = resultMap.get(o.id);
            const canReview = o.status === "paid" && o.user_id === user.id && !reviewedSet.has(o.id);
            return (
              <li key={o.id} className="py-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink truncate">
                    {productMap.get(o.product_id) ?? "-"}
                  </p>
                  <p className="text-xs text-body mt-1">
                    {formatDate(o.created_at)} · <span className="font-mono">{formatKRW(o.amount)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    variant={
                      o.status === "paid" ? "success" : o.status === "failed" ? "destructive" : "secondary"
                    }
                  >
                    {STATUS_LABEL[o.status] ?? o.status}
                  </Badge>
                  {resultId && (
                    <Link href={`/results/${resultId}`} className="text-sm font-medium underline underline-offset-4 text-ink">
                      결과 보기
                    </Link>
                  )}
                  {canReview && (
                    <Link
                      href={`/mypage/orders/${o.id}/review`}
                      className="text-sm font-medium underline underline-offset-4 text-ink"
                    >
                      후기 쓰기
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
    </div>
  );
}
