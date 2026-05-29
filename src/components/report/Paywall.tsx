import Link from "next/link";
import { activeTiers } from "@/config/report-pricing";
import { formatKRW } from "@/lib/utils";
import type { CtaCopy } from "@/lib/saju/report/types";

export function Paywall({ displayName, cta }: { displayName: string; cta: CtaCopy }) {
  const tiers = activeTiers();
  return (
    <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
      <h3 className="text-center text-lg font-bold text-ink leading-snug">
        지금은 일부만 보셨습니다.
        <br />
        오래 버틴 {displayName}님의 흐름 전체를 확인해보세요.
      </h3>
      <p className="mt-2 text-center text-[13px] text-body">
        하지만 이 패턴을 모르면, 올해도 같은 문제를 반복할 수 있어요.
      </p>

      {/* 가격 티어 (변수화) */}
      <div className="mt-5 grid grid-cols-1 gap-2.5">
        {tiers.map((t) => (
          <Link
            key={t.id}
            href={`/products/${t.productSlug}`}
            className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
              t.highlight
                ? "border-amber-400 bg-amber-400/10"
                : "border-hairline bg-surface-soft hover:border-ink"
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[14px] font-semibold text-ink">{t.label}</p>
                {t.highlight && (
                  <span className="text-[10px] font-semibold rounded-full bg-amber-400 text-[#0c1322] px-1.5 py-0.5">BEST</span>
                )}
              </div>
              <p className="text-[11px] text-body">{t.sub}</p>
            </div>
            <span className="text-[15px] font-mono font-semibold text-ink">{formatKRW(t.price)}</span>
          </Link>
        ))}
      </div>

      {/* 메인 CTA = 추천 티어로 */}
      <Link
        href={`/products/${tiers.find((t) => t.highlight)?.productSlug ?? tiers[0]?.productSlug ?? "reunion-check"}`}
        className="mt-5 block w-full rounded-xl bg-amber-400 py-4 text-center text-[15px] font-bold text-[#0c1322] hover:opacity-90 transition-opacity"
      >
        {cta.primary} →
      </Link>

      {/* 보조 CTA */}
      <div className="mt-3 flex flex-col items-center gap-1.5 text-[12px]">
        <span className="text-mute">{cta.secondary} · {cta.tertiary} · 오래 버틴 나의 흐름 확인하기</span>
      </div>
    </section>
  );
}
