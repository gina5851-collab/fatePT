import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { MyeongsikTable } from "@/components/saju/MyeongsikTable";
import { ResultBody } from "@/components/saju/ResultBody";
import { buttonVariants } from "@/components/ui/button";
import type { Myeongsik } from "@/lib/saju/manseryeok";
import { formatDate, formatKRW, cn } from "@/lib/utils";
import { PRODUCT_COPY } from "@/config/product-copy";
import { tarotCrossSellForSaju } from "@/config/cross-sell";
import { getDisplayName, resolveName } from "@/lib/saju/report/name";
import { isMbti, type MbtiType } from "@/lib/saju/report/mbti";
import { buildDunmyeongReport } from "@/lib/saju/report";
import { ReportView } from "@/components/report/ReportView";

export const metadata = { title: "결과지" };

// 무료 맛보기 → 고른 고민에 맞는 단 하나의 프로그램 추천 (가격은 여기서 처음 노출)
// 숨김 상품(love-session/life-master)은 추천하지 않는다 — 공개 상품으로만 연결.
const RECO_BY_CONCERN: Record<string, string> = {
  "짝사랑": "crush-kit",
  "연애·관계": "crush-kit",
  "재회": "reunion-check",
  "돈·일": "premium-saju",
  "인생 전체": "premium-saju",
};

// PAS 업셀 카피: 무료 결과의 신호(problem) → 이대로 두면(risk) → 프로그램으로 해결
const PAS_BY_CONCERN: Record<string, { signal: string; risk: string }> = {
  "짝사랑": {
    signal: "다가갈 타이밍에서 자꾸 망설이는 신호",
    risk: "이대로 두면 마음만 키우다 기회를 놓칠 수 있어요",
  },
  "연애·관계": {
    signal: "관계에서 같은 자세를 반복하는 신호",
    risk: "이대로 두면 비슷한 갈등이 또 반복될 수 있어요",
  },
  "재회": {
    signal: "지금이 다가갈 때인지 기다릴 때인지 헷갈리는 신호",
    risk: "타이밍을 잘못 잡으면 회복이 더 어려워질 수 있어요",
  },
  "돈·일": {
    signal: "버는데도 잘 안 모이는 패턴 신호",
    risk: "패턴을 모르면 같은 누수가 계속될 수 있어요",
  },
  "인생 전체": {
    signal: "방향이 흐릿해 제자리처럼 느껴지는 신호",
    risk: "큰 흐름을 모르면 중요한 시기를 놓칠 수 있어요",
  },
};
const PAS_DEFAULT = {
  signal: "지금 흐름에서 반복되는 패턴 신호",
  risk: "이대로 두면 같은 패턴이 또 반복될 수 있어요",
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const { resultId } = await params;
  const service = createServiceClient();

  const { data: result } = await service
    .from("saju_results")
    .select("id, myeongsik, interpretation_md, llm_provider, llm_model, created_at, order_id, analysis")
    .eq("id", resultId)
    .maybeSingle();

  if (!result) notFound();

  const { data: order } = await service
    .from("orders")
    .select("product_id, paid_at, user_id")
    .eq("id", result.order_id)
    .single();
  const { data: product } = order
    ? await service.from("products").select("name, slug").eq("id", order.product_id).single()
    : { data: null };

  // 개인화 이름 + MBTI — 우선순위: 사주 입력폼 → 회원 프로필 → "고객"
  const { data: nameInput } = await service
    .from("saju_inputs")
    .select("name, mbti")
    .eq("order_id", result.order_id)
    .maybeSingle();
  let profileName: string | null = null;
  if (order?.user_id) {
    const { data: profile } = await service
      .from("profiles")
      .select("display_name")
      .eq("id", order.user_id)
      .maybeSingle();
    profileName = profile?.display_name ?? null;
  }
  const rawName = resolveName(nameInput?.name, profileName);
  const displayName = getDisplayName(rawName);
  const mbti: MbtiType = isMbti(nameInput?.mbti) ? nameInput.mbti : "UNKNOWN";

  // 무료 맛보기(free-taste) + 분석 원본 존재 → 천기문式 전환 ReportView 렌더
  const slugForView = (product as { name: string; slug: string } | null)?.slug ?? "";
  if (slugForView === "free-taste" && result.analysis) {
    const report = buildDunmyeongReport(result.analysis as never, mbti);
    return <ReportView name={rawName} report={report} />;
  }

  const myeongsik = result.myeongsik as unknown as Myeongsik;
  const productSlug = (product as { name: string; slug: string } | null)?.slug ?? "";
  const copy = PRODUCT_COPY[productSlug];

  // 무료 맛보기 결과면 — 고른 고민에 맞는 1개 프로그램을 맥락 추천
  let reco:
    | { slug: string; name: string; price: number; positioning: string; signal: string; risk: string }
    | null = null;
  if (productSlug === "free-taste") {
    const { data: input } = await service
      .from("saju_inputs")
      .select("concerns")
      .eq("order_id", result.order_id)
      .maybeSingle();
    const concern = input?.concerns?.[0] ?? "";
    const recoSlug = RECO_BY_CONCERN[concern] ?? "inbody";
    const { data: recoProduct } = await service
      .from("products")
      .select("slug, name, price")
      .eq("slug", recoSlug)
      .eq("is_active", true)
      .maybeSingle();
    const recoCopy = PRODUCT_COPY[recoSlug];
    if (recoProduct && recoCopy) {
      const pas = PAS_BY_CONCERN[concern] ?? PAS_DEFAULT;
      reco = {
        slug: recoProduct.slug,
        name: recoProduct.name,
        price: recoProduct.price,
        positioning: recoCopy.positioning,
        signal: pas.signal,
        risk: pas.risk,
      };
    }
  }

  return (
    <div className="container py-12 max-w-2xl">
      <header className="mb-10">
        <p className="text-xs font-mono text-mute mb-2">{displayName}님의 리포트</p>
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

      {/* ── 맥락 추천 (무료 맛보기 → PAS 업셀, 가격 첫 노출) ── */}
      {reco && (
        <section className="mt-16 pt-10 border-t border-hairline">
          <p className="text-xs font-mono text-mute mb-3">NEXT STEP</p>
          <div className="rounded-lg border border-ink p-6">
            <p className="text-sm text-ink leading-relaxed">
              무료 진단에서 <span className="font-semibold">{reco.signal}</span>가 보여요.
            </p>
            <p className="mt-1 text-sm text-body leading-relaxed">{reco.risk}.</p>
            <p className="mt-3 text-sm text-ink leading-relaxed">
              <span className="font-semibold text-ink">{reco.name}</span>로 그 신호를 제대로 진단하고 바로잡아 보실래요?
            </p>
            <p className="mt-1 text-xs text-mute">{reco.positioning}</p>
            <p className="mt-4 text-xl font-mono font-medium text-ink">{formatKRW(reco.price)}</p>
            <Link href={`/products/${reco.slug}`} className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full")}>
              네, 해볼게요 →
            </Link>
            <p className="mt-2 text-center text-[11px] text-mute">단정적 예언이 아니라, 패턴을 바로잡는 트레이닝이에요</p>
          </div>
        </section>
      )}

      {/* ── 업셀 섹션 (유료 결과: copy.upsell 있을 때만) ── */}
      {!reco && copy && copy.upsell.length > 0 && (
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

      {/* ── 관련 타로 추천 (교차추천: 사주 결과 → 타로) ── */}
      {productSlug && productSlug !== "free-taste" && (
        <section className="mt-14 pt-10 border-t border-hairline">
          <p className="text-xs font-mono mb-3" style={{ color: "#c9a24b" }}>
            TAROT
          </p>
          <div className="space-y-3">
            {tarotCrossSellForSaju(productSlug).map((item) => (
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
