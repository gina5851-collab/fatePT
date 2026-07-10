import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPassword } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { publicEnv } from "@/lib/env";
import { getCard } from "@/lib/readings/services/tarot/cards";
import { formatDate, formatKRW } from "@/lib/utils";
import type { DrawRecord, ReadingResult } from "@/lib/readings/types";
import { generateDraftAction, saveFinalAction, publishAction, unpublishAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "관리자 - 리딩 상세" };

export default async function AdminReadingDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  await requireAdminPassword("/admin/readings");
  const { orderId } = await params;
  const db = createServiceClient();

  const { data: order } = await db
    .from("orders")
    .select("id, order_id, amount, status, reading_status, created_at, user_id, product_id, public_token, service_type")
    .eq("id", orderId)
    .maybeSingle();
  if (!order) notFound();

  const { data: product } = await db.from("products").select("name, slug").eq("id", order.product_id).maybeSingle();
  const { data: input } = await db.from("reading_inputs").select("payload").eq("order_id", order.id).maybeSingle();
  const { data: reading } = await db
    .from("readings")
    .select("draw_record, raw_response, draft_result, final_result, status, model, prompt_version, error_log, published_at")
    .eq("order_id", order.id)
    .maybeSingle();

  const question = (input?.payload as { question?: string | null } | null)?.question ?? null;
  const draw = reading?.draw_record as unknown as DrawRecord | null;
  const finalOrDraft = (reading?.final_result ?? reading?.draft_result) as unknown as ReadingResult | null;
  const resultUrl = order.public_token
    ? `${publicEnv.NEXT_PUBLIC_SITE_URL || ""}/tarot/result/${order.public_token}`
    : null;

  const isPaid = order.status === "paid";

  return (
    <div className="container py-12 max-w-3xl">
      <Link href="/admin/readings?service=tarot" className="text-xs text-body hover:text-ink">
        ← 목록으로
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{product?.name ?? "타로 리딩"}</h1>
        <p className="mt-2 text-xs font-mono text-mute">
          {order.order_id} · {formatKRW(order.amount)} · {formatDate(order.created_at)} · 결제:{order.status} · 생성:
          {reading?.status ?? "대기"}
        </p>
      </header>

      {/* 질문 */}
      <section className="mb-6">
        <p className="text-xs font-semibold text-mute mb-1">고객 질문</p>
        <p className="text-sm text-ink">{question || "— (질문 없음)"}</p>
      </section>

      {/* 뽑힌 카드 */}
      <section className="mb-6">
        <p className="text-xs font-semibold text-mute mb-2">뽑힌 카드</p>
        {draw ? (
          <ul className="space-y-1.5">
            {draw.cards.map((c, i) => {
              const card = getCard(c.cardId);
              return (
                <li key={i} className="text-sm">
                  <span className="font-mono text-xs text-mute mr-2">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-body">{c.position}:</span>{" "}
                  <span className="text-ink font-medium">{card ? `${card.nameKo} (${card.nameEn})` : c.cardId}</span>{" "}
                  <span className={c.orientation === "reversed" ? "text-[#e0a0a0]" : "text-ink"}>
                    · {c.orientation === "reversed" ? "역방향" : "정방향"}
                  </span>
                </li>
              );
            })}
            <li className="text-[11px] font-mono text-mute mt-1">seed: {draw.seed}</li>
          </ul>
        ) : (
          <p className="text-sm text-mute">아직 드로우되지 않았습니다.</p>
        )}
      </section>

      {/* 오류 로그 */}
      {reading?.error_log && (
        <section className="mb-6 rounded-lg border border-destructive/40 p-4">
          <p className="text-xs font-semibold text-destructive mb-1">생성 오류</p>
          <p className="text-xs text-body font-mono whitespace-pre-wrap">{reading.error_log}</p>
        </section>
      )}

      {/* AI 초안/최종 편집 */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-mute">
            결과 JSON {reading?.model ? `· ${reading.model} · ${reading.prompt_version ?? ""}` : ""}
          </p>
          <form action={generateDraftAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              disabled={!isPaid}
              className="px-3 h-7 inline-flex items-center rounded-full text-xs border border-ink bg-ink text-canvas hover:opacity-90 disabled:opacity-40"
            >
              {reading?.draft_result || reading?.final_result ? "AI 재생성" : "AI 초안 생성"}
            </button>
          </form>
        </div>

        <form action={saveFinalAction} className="space-y-2">
          <input type="hidden" name="orderId" value={order.id} />
          <textarea
            name="finalJson"
            rows={16}
            defaultValue={finalOrDraft ? JSON.stringify(finalOrDraft, null, 2) : ""}
            placeholder='AI 초안을 생성하면 여기에 JSON 이 채워집니다. 직접 수정 후 "수정본 저장" 하세요.'
            className="w-full rounded-lg border border-hairline bg-canvas p-3 text-xs font-mono text-ink leading-relaxed"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 h-8 inline-flex items-center rounded-full text-xs border border-hairline-strong text-ink hover:bg-surface-soft"
            >
              수정본 저장
            </button>
          </div>
        </form>
      </section>

      {/* 발행 제어 */}
      <section className="mb-6 flex flex-wrap items-center gap-2">
        <form action={publishAction}>
          <input type="hidden" name="orderId" value={order.id} />
          <button
            type="submit"
            disabled={!isPaid || !finalOrDraft}
            className="px-4 h-9 inline-flex items-center rounded-full text-sm border border-ink bg-ink text-canvas hover:opacity-90 disabled:opacity-40"
          >
            {reading?.status === "published" ? "재발행" : "검수 완료 · 발행"}
          </button>
        </form>
        {reading?.status === "published" && (
          <form action={unpublishAction}>
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              className="px-4 h-9 inline-flex items-center rounded-full text-sm border border-hairline-strong text-ink hover:bg-surface-soft"
            >
              발행 취소
            </button>
          </form>
        )}
        {reading?.published_at && (
          <span className="text-xs text-mute">발행일: {formatDate(reading.published_at)}</span>
        )}
      </section>

      {/* 고객 결과 링크 */}
      {resultUrl && (
        <section className="mb-6">
          <p className="text-xs font-semibold text-mute mb-1">고객 결과 링크</p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={resultUrl}
              className="flex-1 rounded-lg border border-hairline bg-canvas p-2 text-xs font-mono text-body"
            />
            <Link
              href={`/tarot/result/${order.public_token}`}
              target="_blank"
              className="px-3 h-8 inline-flex items-center rounded-full text-xs border border-hairline-strong text-ink hover:bg-surface-soft whitespace-nowrap"
            >
              열기 →
            </Link>
          </div>
          {reading?.status !== "published" && (
            <p className="mt-1 text-[11px] text-mute">※ 발행 전에는 고객에게 &apos;준비 중&apos;으로 표시됩니다.</p>
          )}
        </section>
      )}
    </div>
  );
}
