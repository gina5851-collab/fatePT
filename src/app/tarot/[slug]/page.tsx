import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTarotProduct } from "@/lib/readings/services/tarot/config";
import { getSpread } from "@/lib/readings/services/tarot/spreads";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatKRW } from "@/lib/utils";
import { TarotOrderForm } from "@/components/tarot/TarotOrderForm";

const GOLD = "#c9a24b";

type Params = Promise<{ slug: string }>;
type Search = Promise<{ utm_source?: string; source?: string; utm_medium?: string; utm_campaign?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getTarotProduct(slug);
  if (!p) return { title: "타로" };
  const desc = `${p.intro}`;
  return {
    title: p.name,
    description: desc,
    alternates: { canonical: `/tarot/${slug}` },
    openGraph: {
      title: `${p.name} — FatePT 타로`,
      description: desc,
      type: "website",
      locale: "ko_KR",
    },
  };
}

export default async function TarotProductPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const { slug } = await params;
  const sp = await searchParams;
  const product = getTarotProduct(slug);
  if (!product) notFound();

  const positions = getSpread(product.spread);
  const source = sp.utm_source ?? sp.source ?? null;

  const isLoggedIn = isSupabaseConfigured() ? !!(await getCurrentUser()) : false;

  return (
    <div className="container py-12 max-w-2xl">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-mono" style={{ color: GOLD }}>
            TAROT / {product.slug}
          </p>
          <span
            className="text-[10px] font-mono rounded-full px-2 py-0.5"
            style={{ color: GOLD, border: `1px solid ${GOLD}` }}
          >
            {product.cardCount}장 스프레드
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight leading-snug">{product.headline}</h1>
        <p className="mt-3 text-sm text-body leading-relaxed">{product.intro}</p>

        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-2xl font-mono font-medium" style={{ color: GOLD }}>
            {formatKRW(product.price)}
          </span>
          <span className="text-xs text-mute">
            {product.publish === "auto" ? "· 결제 후 바로 확인" : "· 검수 후 발행 (보통 24시간 이내)"}
          </span>
        </div>
      </header>

      {/* 스프레드 안내 */}
      <section className="mb-8 rounded-lg border border-hairline p-5" style={{ background: "#0c1730" }}>
        <p className="text-xs font-semibold mb-3" style={{ color: GOLD }}>
          🔮 이 리딩의 카드 자리
        </p>
        <ol className="space-y-1.5">
          {positions.map((pos) => (
            <li key={pos.index} className="flex items-baseline gap-2 text-sm text-body">
              <span className="font-mono text-xs" style={{ color: GOLD }}>
                {String(pos.index + 1).padStart(2, "0")}
              </span>
              <span className="text-ink">{pos.label}</span>
              <span className="text-xs text-mute">— {pos.hint}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 질문 입력 + 결제 */}
      <section>
        <h2 className="text-sm font-semibold text-ink mb-3">질문을 떠올려 주세요</h2>
        <p className="text-xs text-body mb-4">
          구체적인 질문일수록 카드가 또렷하게 답합니다. (선택 — 비워두면 지금 흐름 전반을 봅니다)
        </p>
        {isLoggedIn ? (
          <TarotOrderForm productSlug={product.slug} source={source} />
        ) : (
          <div className="space-y-2">
            <Link
              href={`/login?redirect=${encodeURIComponent(`/tarot/${slug}`)}`}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              로그인하고 카드 뽑기
            </Link>
            <p className="text-xs text-body text-center">
              결과는 로그인 후 결과 링크와 <span className="text-ink">마이페이지</span>에서 확인할 수 있어요.
            </p>
          </div>
        )}
      </section>

      <p className="mt-6 text-center text-[11px] text-mute leading-relaxed">
        타로는 단정적 예언이 아니라, 지금 흐름을 비추고 선택을 돕는 도구입니다.
      </p>
    </div>
  );
}
