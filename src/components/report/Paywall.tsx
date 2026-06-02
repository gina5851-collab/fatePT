"use client";

import Link from "next/link";
import { activeTiers } from "@/config/report-pricing";
import { formatKRW } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import type { CtaCopy } from "@/lib/saju/report/types";
import { CountdownPill } from "./CountdownPill";

export function Paywall({
  displayName,
  cta,
  totalLocked,
  sourceResultId,
}: {
  displayName: string;
  cta: CtaCopy;
  totalLocked: number;
  /** 무료 결과(/results/[id])에서 넘어온 경우 그 resultId. 결제 흐름에 carry. */
  sourceResultId?: string;
}) {
  const tiers = activeTiers();
  const best = tiers.find((t) => t.highlight) ?? tiers[0];
  // 본상품 폴백: activeTiers 가 비어있는 비정상 케이스에서도 premium-saju 로 이동.
  const bestSlug = best?.productSlug ?? "premium-saju";
  // 결제 페이지로 무료 결과 id 를 carry — 다음 작업(unlock 매핑)에서 사용.
  const qs = sourceResultId ? `?source=${encodeURIComponent(sourceResultId)}` : "";
  const withSource = (slug: string) => `/products/${slug}${qs}`;

  return (
    <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
      {/* 긴급성 */}
      <div className="text-center mb-4">
        <CountdownPill minutes={30} />
      </div>

      <h3 className="text-center text-lg font-bold text-ink leading-snug">
        놓치지 마
        <br />
        {displayName}님의 이어지는 해석을
        <br />
        차분히 받아보세요.
      </h3>
      <p className="mt-3 text-center text-[13px] leading-relaxed text-body">
        지금 보이는 고민은
        <br />
        결과가 아니라 반복되는 흐름의 일부일 수 있어요.
        <br />
        조금 더 깊은 흐름을 이어서 볼 수 있어요.
      </p>

      {/* 이어보기 — 종용형 X, 탐색형 톤 */}
      <ul className="mt-4 space-y-1.5 text-[12px] text-body">
        <li className="flex items-center gap-2">
          <span className="text-amber-300">↗</span> 반복되는 <b className="text-ink">패턴의 출발점</b>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-amber-300">↗</span> 돈과 일이 <b className="text-ink">흐르는 결</b>
        </li>
        <li className="flex items-center gap-2">
          <span className="text-amber-300">↗</span> 지금 시기에 <b className="text-ink">의식할 선택</b>
        </li>
      </ul>

      {/* 가격 티어 */}
      <div className="mt-5 grid grid-cols-1 gap-2.5">
        {tiers.map((t) => {
          const off = t.originalPrice ? Math.round((1 - t.price / t.originalPrice) * 100) : 0;
          return (
            <Link
              key={t.id}
              href={withSource(t.productSlug)}
              onClick={() =>
                trackEvent("unlock_tier_click", {
                  tier: t.id,
                  product: t.productSlug,
                  price: t.price,
                  source: sourceResultId,
                })
              }
              className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
                t.highlight ? "border-amber-400 bg-amber-400/10" : "border-hairline bg-surface-soft hover:border-ink"
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-semibold text-ink">{t.label}</p>
                  {t.highlight && (
                    <span className="text-[10px] font-semibold rounded-full bg-amber-400 text-[#0c1322] px-1.5 py-0.5">
                      BEST
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-body">{t.sub}</p>
              </div>
              <div className="text-right shrink-0">
                {t.originalPrice && (
                  <span className="block text-[11px] font-mono text-mute line-through">
                    {formatKRW(t.originalPrice)}
                  </span>
                )}
                <span className="text-[15px] font-mono font-semibold text-ink">{formatKRW(t.price)}</span>
                {off > 0 && <span className="ml-1 text-[11px] font-semibold text-amber-300">{off}%</span>}
              </div>
            </Link>
          );
        })}
      </div>

      {/* 메인 CTA — "해금/열기" 톤 */}
      <Link
        href={withSource(bestSlug)}
        onClick={() =>
          trackEvent("unlock_cta_click", {
            page: "free_result",
            position: "paywall_primary",
            product: bestSlug,
            totalLocked,
            source: sourceResultId,
          })
        }
        className="mt-5 block w-full rounded-xl bg-amber-400 py-4 text-center text-[15px] font-bold text-[#0c1322] hover:opacity-90 transition-opacity"
      >
        {displayName}님 전체 리포트 열기 →
      </Link>

      {/* 보조 CTA */}
      <div className="mt-3 grid grid-cols-1 gap-1.5">
        <Link
          href={withSource(bestSlug)}
          onClick={() =>
            trackEvent("unlock_cta_click", {
              page: "free_result",
              position: "paywall_secondary",
              source: sourceResultId,
            })
          }
          className="text-center text-[12px] text-body hover:text-ink underline underline-offset-4"
        >
          이어지는 해석 보기 · 내 흐름의 다음 장
        </Link>
        <Link
          href={withSource("life-master")}
          onClick={() =>
            trackEvent("unlock_cta_click", {
              page: "free_result",
              position: "paywall_tertiary",
              source: sourceResultId,
            })
          }
          className="text-center text-[12px] text-body hover:text-ink underline underline-offset-4"
        >
          {cta.tertiary}
        </Link>
      </div>

      {/* 결제 안내 — 카카오톡 오픈채팅 결과 전달 구조 */}
      <p className="mt-4 text-center text-[11px] text-mute leading-relaxed">
        토스페이먼츠 안전결제
        <br />
        결제 완료 후 카카오톡 오픈채팅으로 결과지 안내가 전달됩니다.
      </p>
    </section>
  );
}
