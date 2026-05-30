import { PersonaHero } from "./PersonaHero";
import { FortuneSourceCard } from "./FortuneSourceCard";
import { MbtiSajuMirrorCard } from "./MbtiSajuMirrorCard";
import { MetricCards } from "./MetricCards";
import { LockedItems, ProgressBar } from "./LockedItems";
import { Paywall } from "./Paywall";
import { ReviewCards } from "./ReviewCards";
import { FlowTimeline } from "./FlowTimeline";
import type { DunmyeongReport } from "@/lib/saju/report/types";
import { getDisplayName } from "@/lib/saju/report/name";

// 무료 결과 페이지 — 천기문式 개인화 퍼널 구성.
export function ReportView({ name, report }: { name?: string | null; report: DunmyeongReport }) {
  const displayName = getDisplayName(name);
  const partCount = new Set(report.items.map((i) => i.category)).size;

  return (
    <div className="mx-auto max-w-[440px] px-4 py-10 space-y-12">
      {/* 1. 개인 타입명 히어로 */}
      <PersonaHero displayName={displayName} persona={report.persona} />

      {/* 2. 사주 원본 구조 카드 */}
      <FortuneSourceCard displayName={displayName} s={report.saju} />

      {/* 3. MBTI(가면) vs 사주(본성) 거울 */}
      <MbtiSajuMirrorCard
        displayName={displayName}
        mbti={report.mbti}
        reading={report.mbtiReading}
        sajuNature={report.persona.oneLiner}
      />

      {/* 4. 8지표 */}
      <MetricCards metrics={report.metrics} displayName={displayName} />

      {/* 5. 진행률 */}
      <ProgressBar displayName={displayName} free={report.freeCount} total={report.items.length} parts={partCount} />

      {/* 6·7. 무료 2 + 잠금 21 */}
      <LockedItems displayName={displayName} items={report.items} />

      {/* 8. 흐름 타임라인 */}
      <FlowTimeline displayName={displayName} />

      {/* 9. 후기 (페이월 바로 위) */}
      <ReviewCards />

      {/* 10. 페이월 */}
      <Paywall displayName={displayName} cta={report.cta} />

      <p className="text-center text-[11px] leading-relaxed text-mute pt-4">
        운명PT 리포트는 자기이해와 의사결정 보조를 위한 콘텐츠입니다.
        의학·법률·투자·취업 결과를 보장하지 않습니다.
      </p>
    </div>
  );
}
