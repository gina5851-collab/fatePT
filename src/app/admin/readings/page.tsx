import Link from "next/link";
import { requireAdminPassword } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { activeReadingServiceTypes } from "@/lib/readings/registry";
import { Badge } from "@/components/ui/badge";
import { formatKRW, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "관리자 - 리딩 주문" };

type SearchParams = Promise<{ service?: string; status?: string }>;

const PAY_LABEL: Record<string, string> = { paid: "결제완료", pending: "결제대기", failed: "실패" };
const READ_LABEL: Record<string, string> = {
  drawn: "드로우됨",
  generating: "생성중",
  draft: "초안",
  published: "발행됨",
  failed: "생성실패",
};

export default async function AdminReadingsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminPassword("/admin/readings");
  const { service = "tarot" } = await searchParams;
  const services = activeReadingServiceTypes();
  const demoMode = !isSupabaseConfigured();

  type Row = {
    id: string;
    order_id: string;
    amount: number;
    status: string;
    reading_status: string | null;
    created_at: string;
    user_id: string | null;
    product_id: string;
    public_token: string | null;
  };
  let orders: Row[] = [];
  const productMap = new Map<string, string>();
  const questionMap = new Map<string, string | null>();
  const cardCountMap = new Map<string, number>();

  if (!demoMode) {
    const db = createServiceClient();
    const { data } = await db
      .from("orders")
      .select("id, order_id, amount, status, reading_status, created_at, user_id, product_id, public_token")
      .eq("service_type", service as "tarot")
      .order("created_at", { ascending: false })
      .limit(200);
    orders = (data ?? []) as Row[];

    const productIds = Array.from(new Set(orders.map((o) => o.product_id)));
    if (productIds.length) {
      const { data: products } = await db.from("products").select("id, name").in("id", productIds);
      (products ?? []).forEach((p) => productMap.set(p.id, p.name));
    }
    const orderIds = orders.map((o) => o.id);
    if (orderIds.length) {
      const { data: inputs } = await db.from("reading_inputs").select("order_id, payload").in("order_id", orderIds);
      (inputs ?? []).forEach((r) => {
        const q = (r.payload as { question?: string | null } | null)?.question ?? null;
        questionMap.set(r.order_id, q);
      });
      const { data: readings } = await db.from("readings").select("order_id, draw_record").in("order_id", orderIds);
      (readings ?? []).forEach((r) => {
        const cards = (r.draw_record as { cards?: unknown[] } | null)?.cards;
        cardCountMap.set(r.order_id, Array.isArray(cards) ? cards.length : 0);
      });
    }
  }

  return (
    <div className="container py-12">
      <header className="mb-6">
        <p className="text-xs font-mono text-mute mb-2">ADMIN / READINGS</p>
        <h1 className="text-2xl font-semibold tracking-tight">리딩 주문 · 검수</h1>
      </header>

      {/* 서비스 탭 (현재 tarot만 활성) */}
      <div className="flex gap-2 mb-6">
        {services.map((s) => (
          <Link
            key={s}
            href={`/admin/readings?service=${s}`}
            className={`px-4 h-8 inline-flex items-center rounded-full text-sm border transition-colors ${
              service === s ? "bg-ink text-canvas border-ink" : "border-hairline text-ink hover:border-ink"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {demoMode && (
        <div className="mb-6 rounded-lg border border-hairline p-4 text-xs text-body">
          데모 모드 — DB 미연결. 실제 주문을 보려면 Supabase 를 연결하세요.
        </div>
      )}

      <p className="text-xs text-mute font-mono mb-3">{orders.length} ROWS</p>

      <div className="border border-hairline rounded-lg overflow-x-auto">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-mute">주문이 없습니다.</div>
        ) : (
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-hairline text-left text-[11px] font-mono uppercase tracking-wider text-mute">
                <th className="px-3 py-3">주문일</th>
                <th className="px-3 py-3">주문번호</th>
                <th className="px-3 py-3">상품</th>
                <th className="px-3 py-3">고객</th>
                <th className="px-3 py-3">질문</th>
                <th className="px-3 py-3 text-right">금액</th>
                <th className="px-3 py-3">결제</th>
                <th className="px-3 py-3">카드</th>
                <th className="px-3 py-3">생성상태</th>
                <th className="px-3 py-3">관리</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-hairline last:border-0">
                  <td className="px-3 py-3 text-xs text-body whitespace-nowrap">{formatDate(o.created_at)}</td>
                  <td className="px-3 py-3 font-mono text-xs">{o.order_id.slice(0, 12)}…</td>
                  <td className="px-3 py-3 whitespace-nowrap">{productMap.get(o.product_id) ?? "-"}</td>
                  <td className="px-3 py-3 text-xs">{o.user_id ? "회원" : "-"}</td>
                  <td className="px-3 py-3 text-xs max-w-[180px] truncate">{questionMap.get(o.id) || "—"}</td>
                  <td className="px-3 py-3 text-right font-mono">{formatKRW(o.amount)}</td>
                  <td className="px-3 py-3">
                    <Badge variant={o.status === "paid" ? "success" : o.status === "failed" ? "destructive" : "secondary"}>
                      {PAY_LABEL[o.status] ?? o.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-xs font-mono">{cardCountMap.get(o.id) ?? 0}장</td>
                  <td className="px-3 py-3">
                    <Badge variant={o.reading_status === "published" ? "success" : o.reading_status === "failed" ? "destructive" : "secondary"}>
                      {o.reading_status ? READ_LABEL[o.reading_status] ?? o.reading_status : "대기"}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/admin/readings/${o.id}`}
                      className="text-xs underline underline-offset-2 whitespace-nowrap"
                    >
                      상세/검수
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
