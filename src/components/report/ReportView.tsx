"use client";

import { useEffect } from "react";
import { PersonaHero } from "./PersonaHero";
import { FortuneSourceCard } from "./FortuneSourceCard";
import { MbtiSajuMirrorCard } from "./MbtiSajuMirrorCard";
import { MetricCards } from "./MetricCards";
import { LockedItems } from "./LockedItems";
import { UnlockProgress } from "./UnlockProgress";
import { PremiumPreview } from "./PremiumPreview";
import { Paywall } from "./Paywall";
import { ReviewCards } from "./ReviewCards";
import { FlowTimeline } from "./FlowTimeline";
import { StickyUnlockCTA } from "./StickyUnlockCTA";
import { trackEvent } from "@/lib/analytics";
import type { DunmyeongReport } from "@/lib/saju/report/types";
import { getDisplayName } from "@/lib/saju/report/name";

// 무료/유료 결과 페이지 — 천기문式 텍스트 흐름:
// ① 정체성 몰입 → ② 타고난 기질 → 잠금카드1 → ③ 살아가는 방식 → 잠금카드2 →
// ④ 지금 반복되는 신호 → 프리미엄 미리보기(블러) → 진행률 → 페이월 → Sticky CTA
export function ReportView({
  name,
  report,
  unlocked = false,
}: {
  name?: string | null;
  report: DunmyeongReport;
  unlocked?: boolean;
}) {
  const displayName = getDisplayName(name);
  const totalLocked = report.items.filter((i) => !i.free).length;

  useEffect(() => {
    trackEvent(unlocked ? "full_report_view" : "free_result_view", {
      total: report.items.length,
      freeCount: report.freeCount,
      lockedCount: report.lockedCount,
    });
  }, [unlocked, report.items.length, report.freeCount, report.lockedCount]);

  return (
    <>
      <div className="mx-auto max-w-[440px] px-4 py-10 space-y-10">
        {/* ① 개인 타입명 히어로 */}
        <PersonaHero displayName={displayName} persona={report.persona} />

        {/* ② 사주 원본 구조 */}
        <FortuneSourceCard displayName={displayName} s={report.saju} />

        {/* ③ MBTI(가면) vs 사주(본성) */}
        <MbtiSajuMirrorCard
          displayName={displayName}
          mbti={report.mbti}
          reading={report.mbtiReading}
          sajuNature={report.persona.oneLiner}
        />

        {/* ④ 8지표 */}
        <MetricCards metrics={report.metrics} displayName={displayName} />

        {/* 본문 시작 앵커 — Hero CTA 가 여기로 스크롤 */}
        <div id="report-body" className="scroll-mt-4" />

        {/* ⑤ 4개 무료 본문 + 인라인 잠금 카드 (unlocked=true 이면 풀 콘텐츠) */}
        <LockedItems displayName={displayName} items={report.items} unlocked={unlocked} />

        {/* 흐름 타임라인 — 유료/무료 공통 */}
        <FlowTimeline displayName={displayName} />

        {/* ⑥ 프리미엄 미리보기 (블러) — 무료에서만 노출 */}
        {!unlocked && <PremiumPreview displayName={displayName} />}

        {/* ⑦ 해금 진행률 — 무료에서만 */}
        {!unlocked && <UnlockProgress displayName={displayName} items={report.items} />}

        {/* ⑧ 후기 */}
        <ReviewCards />

        {/* ⑨ 페이월 — 무료에서만 */}
        {!unlocked && (
          <Paywall displayName={displayName} cta={report.cta} totalLocked={totalLocked} />
        )}

        <p className="text-center text-[11px] leading-relaxed text-mute pt-4 pb-20 md:pb-4">
          운명PT 리포트는 자기이해와 의사결정 보조를 위한 콘텐츠입니다.
          의학·법률·투자·취업 결과를 보장하지 않습니다.
        </p>
      </div>

      {/* ⑩ Sticky CTA — 무료에서만 */}
      {!unlocked && <StickyUnlockCTA displayName={displayName} totalLocked={totalLocked} />}
    </>
  );
}
