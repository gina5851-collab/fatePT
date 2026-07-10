import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { getCard } from "@/lib/readings/services/tarot/cards";
import { TarotCard } from "@/components/tarot/TarotCard";
import { sajuCrossSellForTarot } from "@/config/cross-sell";
import type { DrawRecord, ReadingResult } from "@/lib/readings/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "타로 결과", robots: { index: false } };

const GOLD = "#c9a24b";

export default async function TarotResultPage({ params }: { params: Promise<{ publicToken: string }> }) {
  const { publicToken } = await params;
  const service = createServiceClient();

  // 안전 토큰으로만 조회 (내부 UUID 비노출)
  const { data: order } = await service
    .from("orders")
    .select("id, status, product_id, service_type")
    .eq("public_token", publicToken)
    .maybeSingle();
  if (!order || order.service_type !== "tarot") notFound();

  const { data: product } = await service
    .from("products")
    .select("name, slug")
    .eq("id", order.product_id)
    .maybeSingle();
  const { data: input } = await service
    .from("reading_inputs")
    .select("payload")
    .eq("order_id", order.id)
    .maybeSingle();
  const { data: reading } = await service
    .from("readings")
    .select("draw_record, final_result, status")
    .eq("order_id", order.id)
    .maybeSingle();

  const question = (input?.payload as { question?: string | null } | null)?.question ?? null;

  // 미결제 → 결과 비노출
  if (order.status !== "paid") {
    return (
      <StatusScreen
        title="결제 확인 중"
        message="결제가 아직 확인되지 않았습니다. 결제를 완료하시면 결과를 확인할 수 있어요."
      />
    );
  }

  // 미발행(검수 대기/생성 중/실패) → 준비 중 안내 (고객에게 결과 노출 안 함)
  if (!reading || reading.status !== "published" || !reading.final_result) {
    return (
      <StatusScreen
        title="결과 준비 중"
        message="카드를 뽑아두었어요. 리더가 정성껏 검수해 곧 결과를 발행해 드립니다. 발행되면 이 링크에서 바로 확인할 수 있어요. (보통 24시간 이내)"
      />
    );
  }

  const draw = reading.draw_record as unknown as DrawRecord;
  const result = reading.final_result as unknown as ReadingResult;
  const crossSell = product ? sajuCrossSellForTarot(product.slug) : [];

  return (
    <div className="container py-12 max-w-2xl">
      <header className="mb-8 text-center">
        <p className="text-xs font-mono mb-2" style={{ color: GOLD }}>
          {product?.name ?? "타로 리딩"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{result.title}</h1>
        {question && <p className="mt-3 text-sm text-body italic">“{question}”</p>}
      </header>

      {/* 뽑힌 카드 */}
      <section className="mb-10">
        <div className="flex flex-wrap justify-center gap-4">
          {draw.cards.map((c, i) => {
            const card = getCard(c.cardId);
            return (
              <TarotCard
                key={`${c.cardId}-${i}`}
                nameKo={card?.nameKo ?? c.cardId}
                nameEn={card?.nameEn ?? ""}
                orientation={c.orientation}
                position={c.position}
                index={i}
              />
            );
          })}
        </div>
      </section>

      {/* 요약 */}
      <section className="mb-8 rounded-lg border p-5" style={{ borderColor: GOLD, background: "#0c1730" }}>
        <p className="text-sm text-ink leading-relaxed">{result.summary}</p>
      </section>

      {/* 포지션별 해석 */}
      <section className="space-y-6">
        {result.sections.map((s, i) => (
          <div key={i} className="border-b border-hairline pb-6 last:border-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono" style={{ color: GOLD }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="text-sm font-semibold text-ink">{s.position}</h2>
              {s.cardName && <span className="text-xs text-mute">· {s.cardName}</span>}
            </div>
            <p className="text-sm text-body leading-relaxed whitespace-pre-line">{s.interpretation}</p>
          </div>
        ))}
      </section>

      {/* 조언 + 마무리 */}
      <section className="mt-8 space-y-4">
        <div className="rounded-lg border border-hairline p-5">
          <p className="text-xs font-semibold mb-2" style={{ color: GOLD }}>
            조언
          </p>
          <p className="text-sm text-body leading-relaxed">{result.advice}</p>
        </div>
        <p className="text-sm text-ink leading-relaxed text-center px-4">{result.closing}</p>
      </section>

      {/* 관련 사주 상품 추천 (교차추천) */}
      {crossSell.length > 0 && (
        <section className="mt-14 pt-10 border-t border-hairline">
          <p className="text-xs font-mono text-mute mb-3">NEXT STEP</p>
          <div className="space-y-3">
            {crossSell.map((item) => (
              <Link
                key={item.slug}
                href={`${item.href}?source=${encodeURIComponent(item.source)}`}
                className="block rounded-lg border border-hairline p-5 hover:border-ink transition-colors"
              >
                <p className="text-sm font-semibold text-ink">{item.label} →</p>
                <p className="mt-1 text-sm text-body leading-relaxed">{item.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 pt-8 border-t border-hairline text-center">
        <Link href="/tarot" className="text-xs text-body underline underline-offset-4 hover:text-ink">
          다른 타로 보기 →
        </Link>
      </section>

      <p className="mt-6 text-center text-[11px] text-mute">
        타로는 단정적 예언이 아니라, 지금 흐름을 비추고 선택을 돕는 도구입니다.
      </p>
    </div>
  );
}

function StatusScreen({ title, message }: { title: string; message: string }) {
  return (
    <div className="container py-20 max-w-md text-center">
      <span className="text-4xl" style={{ color: GOLD }}>
        ✦
      </span>
      <h1 className="mt-4 text-xl font-semibold text-ink">{title}</h1>
      <p className="mt-3 text-sm text-body leading-relaxed">{message}</p>
      <Link href="/mypage/orders" className="mt-6 inline-block text-xs text-body underline underline-offset-4 hover:text-ink">
        주문내역 보기 →
      </Link>
    </div>
  );
}
