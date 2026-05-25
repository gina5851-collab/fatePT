import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { MyeongsikTable } from "@/components/saju/MyeongsikTable";
import { ResultBody } from "@/components/saju/ResultBody";
import type { Myeongsik } from "@/lib/saju/manseryeok";
import { formatDate } from "@/lib/utils";
import { PRODUCT_COPY } from "@/config/product-copy";

export const metadata = { title: "결과지" };

export default async function ResultPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const { resultId } = await params;
  const service = createServiceClient();

  const { data: result } = await service
    .from("saju_results")
    .select("id, myeongsik, interpretation_md, llm_provider, llm_model, created_at, order_id")
    .eq("id", resultId)
    .maybeSingle();

  if (!result) notFound();

  const { data: order } = await service
    .from("orders")
    .select("product_id, paid_at")
    .eq("id", result.order_id)
    .single();
  const { data: product } = order
    ? await service.from("products").select("name, slug").eq("id", order.product_id).single()
    : { data: null };

  const myeongsik = result.myeongsik as unknown as Myeongsik;
  const productSlug = (product as { name: string; slug: string } | null)?.slug ?? "";
  const copy = PRODUCT_COPY[productSlug];

  return (
    <div className="container py-12 max-w-2xl">
      <header className="mb-10">
        <p className="text-xs font-mono text-mute mb-2">RESULT</p>
        <h1 className="text-3xl font-semibold tracking-tight">{product?.name ?? "사주 풀이"}</h1>
        <p className="mt-2 text-xs font-mono text-mute">
          {result.llm_provider} · {result.llm_model} · {formatDate(result.created_at)}
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-semibold mb-3 text-ink">사주 명식</h2>
        <MyeongsikTable myeongsik={myeongsik} />
      </section>

      <article>
        <ResultBody markdown={result.interpretation_md} />
      </article>

      {/* ── 업셀 섹션 (copy 있고 upsell 항목이 있을 때만 표시) ── */}
      {copy && copy.upsell.length > 0 && (
        <section className="mt-16 pt-10 border-t border-hairline space-y-5">
          <p className="text-xs font-mono text-mute">NEXT STEP</p>
          <p className="text-sm font-semibold text-ink">리포트를 보고 더 궁금한 게 생겼다면</p>
          {copy.upsell.map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-hairline p-5 flex flex-col gap-2"
            >
              <p className="text-xs text-mute">{item.trigger}</p>
              <p className="text-sm text-body leading-relaxed">{item.suggestion}</p>
              <Link
                href={`/products/${item.slug}`}
                className="mt-1 self-start text-xs font-medium text-ink underline underline-offset-4 hover:text-body"
              >
                {item.label} →
              </Link>
            </div>
          ))}
        </section>
      )}

      {/* ── 하단 CTA ── */}
      <section className="mt-10 pt-8 border-t border-hairline text-center">
        <p className="text-xs text-mute mb-3">이 리포트가 도움이 됐다면 후기를 남겨주세요</p>
        <Link
          href="/products"
          className="text-xs text-body underline underline-offset-4 hover:text-ink"
        >
          다른 리포트 보기 →
        </Link>
      </section>
    </div>
  );
}
