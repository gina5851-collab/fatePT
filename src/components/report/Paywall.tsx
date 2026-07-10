import Link from "next/link";
import { activeTiers } from "@/config/report-pricing";
import { formatKRW } from "@/lib/utils";
import type { CtaCopy } from "@/lib/saju/report/types";
import { CountdownPill } from "./CountdownPill";

export function Paywall({ displayName, cta }: { displayName: string; cta: CtaCopy }) {
  const tiers = activeTiers();
  const best = tiers.find((t) => t.highlight) ?? tiers[0];
  const bestSlug = best?.productSlug ?? "reunion-check";

  return (
    <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
      {/* 긴급성 */}
      <div className="text-center mb-4">
        <CountdownPill minutes={30} />
      </div>

      <h3 className="text-center text-lg font-bold text-ink leading-snug">
        지금은 일부만 보셨습니다.
        <br />
        하지만 이 패턴을 모르면,
        <br />
        올해도 같은 문제를 반복할 수 있습니다.
      </h3>
      <p className="mt-3 text-center text-[13px] leading-relaxed text-body">
        좋은 말만 듣고 끝나는 리포트가 아니에요.
        <br />
        {displayName}님이 왜 반복했는지, 어디서 운이 새고 있었는지,
        <br />
        이제 무엇을 바꿔야 하는지까지 확인해보세요.
      </p>

      {/* 잠긴 것 요약 (손실 강조) */}
      <ul className="mt-4 space-y-1.5 text-[12px] text-body">
        <li className="flex items-center gap-2"><span className="text-amber-300">🔓</span> 반복을 만드는 <b className="text-ink">출발점</b>과 끊는 법</li>
        <li className="flex items-center gap-2"><span className="text-amber-300">🔓</span> 돈·에너지가 <b className="text-ink">새는 지점</b>과 막는 법</li>
        <li className="flex items-center gap-2"><span className="text-amber-300">🔓</span> 2026년 <b className="text-ink">전환 타이밍</b>과 주의 시기</li>
      </ul>

      {/* 가격 티어 (변수화 + 앵커) */}
      <div className="mt-5 grid grid-cols-1 gap-2.5">
        {tiers.map((t) => {
          const off = t.originalPrice ? Math.round((1 - t.price / t.originalPrice) * 100) : 0;
          return (
            <Link
              key={t.id}
              href={`/products/${t.productSlug}`}
              className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
                t.highlight ? "border-amber-400 bg-amber-400/10" : "border-hairline bg-surface-soft hover:border-ink"
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
              <div className="text-right shrink-0">
                {t.originalPrice && (
                  <span className="block text-[11px] font-mono text-mute line-through">{formatKRW(t.originalPrice)}</span>
                )}
                <span className="text-[15px] font-mono font-semibold text-ink">{formatKRW(t.price)}</span>
                {off > 0 && <span className="ml-1 text-[11px] font-semibold text-amber-300">{off}%</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {/* 메인 CTA */}
      <Link
        href={`/products/${bestSlug}`}
        className="mt-5 block w-full rounded-xl bg-amber-400 py-4 text-center text-[15px] font-bold text-[#0c1322] hover:opacity-90 transition-opacity"
      >
        {cta.primary} →
      </Link>

      {/* 보조 CTA — 각각 버튼화 */}
      <div className="mt-3 grid grid-cols-1 gap-1.5">
        <Link href={`/products/${bestSlug}`} className="text-center text-[12px] text-body hover:text-ink underline underline-offset-4">
          {cta.secondary}
        </Link>
        <Link href="/products" className="text-center text-[12px] text-body hover:text-ink underline underline-offset-4">
          {cta.tertiary}
        </Link>
      </div>

      {/* 결제 안심 */}
      <p className="mt-4 text-center text-[11px] text-mute">
        토스페이먼츠 안전결제 · 결제 후 바로 확인 · 마음에 안 들면 환불 안내
      </p>
    </section>
  );
}
