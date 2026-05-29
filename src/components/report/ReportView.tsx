import { MyeongsikTable } from "@/components/saju/MyeongsikTable";
import { MetricCards } from "./MetricCards";
import { LockedItems, ProgressBar } from "./LockedItems";
import { Paywall } from "./Paywall";
import { ReviewCards } from "./ReviewCards";
import { FlowTimeline } from "./FlowTimeline";
import type { DunmyeongReport } from "@/lib/saju/report/types";
import type { Myeongsik } from "@/lib/saju/manseryeok";
import { getDisplayName } from "@/lib/saju/report/name";

// 무료 결과 페이지 — 전환 중심 구성.
// name: 상위(결과 라우트/데모)에서 우선순위로 해석된 원본 이름. 빈 값이면 "고객".
export function ReportView({ name, report }: { name?: string | null; report: DunmyeongReport }) {
  const displayName = getDisplayName(name); // "민지" / "고객"
  const s = report.saju;
  const endurance = report.metrics.find((m) => m.key === "endurance");
  const partCount = new Set(report.items.map((i) => i.category)).size;

  // 명식표용 변환 (NormalizedPillar → Myeongsik)
  const get = (pos: string) => s.pillars.find((p) => p.position === pos);
  const toPillar = (pos: string) => {
    const p = get(pos);
    return p ? { cheongan: p.gan, jiji: p.ji } : null;
  };
  const myeongsik: Myeongsik = {
    year: toPillar("year") ?? { cheongan: "—", jiji: "—" },
    month: toPillar("month") ?? { cheongan: "—", jiji: "—" },
    day: toPillar("day") ?? { cheongan: "—", jiji: "—" },
    hour: toPillar("hour"),
  };

  return (
    <div className="mx-auto max-w-[440px] px-4 py-10 space-y-12">
      {/* 1. 개인화 히어로 */}
      <header className="text-center">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-3">{displayName}님의 반복 패턴 리포트</p>
        <h1 className="text-[26px] font-bold leading-snug text-ink">
          {displayName}님은
          <br />
          <span className="text-amber-300">오래 버틴 사람</span>입니다.
        </h1>
        <p className="mt-4 text-[14px] leading-relaxed text-body">
          {displayName}님이 부족해서 반복한 게 아니에요.
          <br />
          오래 버틴 방식이 어느 순간 패턴이 되었을 뿐이에요.
        </p>
        {endurance && (
          <p className="mt-3 text-[12px] text-mute">{endurance.oneLiner}</p>
        )}
      </header>

      {/* 명식표 */}
      <MyeongsikTable myeongsik={myeongsik} />

      {/* 2. 8지표 */}
      <MetricCards metrics={report.metrics} />

      {/* 5. 진행률 */}
      <ProgressBar displayName={displayName} free={report.freeCount} total={report.items.length} parts={partCount} />

      {/* 3·4. 무료 2 + 잠금 21 */}
      <LockedItems displayName={displayName} items={report.items} />

      {/* 9. 흐름 타임라인 */}
      <FlowTimeline displayName={displayName} />

      {/* 6·7. 페이월 + CTA */}
      <Paywall displayName={displayName} cta={report.cta} />

      {/* 8. 후기 */}
      <ReviewCards />

      <p className="text-center text-[11px] text-mute pt-4">
        운명PT는 단정적 예언이 아니라, 반복 패턴을 읽어 오늘의 선택을 돕는 자기이해 리포트입니다.
      </p>
    </div>
  );
}
