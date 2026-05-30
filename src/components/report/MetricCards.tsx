import type { Metric } from "@/lib/saju/report/types";

// 8지표 — 평가/등급이 아니라 "패턴 지표" 톤. 0~100 막대.
export function MetricCards({ metrics, displayName }: { metrics: Metric[]; displayName: string }) {
  return (
    <section>
      <p className="text-center text-[11px] font-mono tracking-[0.3em] text-mute mb-1">PATTERN INDEX</p>
      <h2 className="text-center text-lg font-semibold text-ink mb-1.5">{displayName}님의 패턴 지표 8가지</h2>
      <p className="text-center text-[12px] text-mute mb-5">
        이 점수는 우열이 아니라, {displayName}님 안에서 강하게 반복되는 패턴의 세기예요.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.key} className="rounded-xl border border-hairline bg-surface-soft p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-[13px] font-semibold text-ink">{m.display}</p>
              <span className={`text-[11px] ${m.positive ? "text-blue-300" : "text-amber-300"}`}>{m.band}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-hairline overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.positive ? "bg-blue-400" : "bg-amber-400"}`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
              <span className="text-[12px] font-mono text-body tabular-nums">{m.score}</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-body">{m.oneLiner}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
