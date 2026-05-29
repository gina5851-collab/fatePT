// 2026 반복 패턴 흐름 — 월별 주의/회복/확장 구간 1차 버전 (간단 막대 타임라인)
type Phase = "회복" | "확장" | "주의";

const MONTHS: { m: number; phase: Phase }[] = [
  { m: 1, phase: "회복" }, { m: 2, phase: "회복" }, { m: 3, phase: "확장" },
  { m: 4, phase: "확장" }, { m: 5, phase: "확장" }, { m: 6, phase: "확장" },
  { m: 7, phase: "주의" }, { m: 8, phase: "주의" }, { m: 9, phase: "주의" },
  { m: 10, phase: "회복" }, { m: 11, phase: "확장" }, { m: 12, phase: "주의" },
];

const PHASE_STYLE: Record<Phase, string> = {
  회복: "bg-blue-400/70",
  확장: "bg-emerald-400/70",
  주의: "bg-amber-400/70",
};

export function FlowTimeline() {
  return (
    <section className="rounded-2xl border border-hairline bg-surface-soft p-5">
      <p className="text-center text-[11px] font-mono tracking-[0.3em] text-mute mb-1">2026 FLOW</p>
      <h3 className="text-center text-[15px] font-semibold text-ink mb-1">2026년 반복 패턴 흐름</h3>
      <p className="text-center text-[11px] text-mute mb-4">월별 주의 · 회복 · 확장 구간 (개요)</p>

      <div className="flex items-end gap-1 h-20">
        {MONTHS.map(({ m, phase }) => (
          <div key={m} className="flex-1 flex flex-col items-center justify-end gap-1">
            <div
              className={`w-full rounded-sm ${PHASE_STYLE[phase]}`}
              style={{ height: phase === "확장" ? "100%" : phase === "회복" ? "60%" : "75%" }}
            />
            <span className="text-[9px] text-mute">{m}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-3 text-[11px]">
        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-blue-400 inline-block" />회복</span>
        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />확장</span>
        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-amber-400 inline-block" />주의</span>
      </div>

      <div className="mt-4 space-y-1.5 text-[12px] text-body blur-[4px] select-none" aria-hidden>
        <p>· 대운 전환 타이밍: 2026년 X월 — 큰 흐름이 바뀌는 길목</p>
        <p>· 운의 누수 지점: X월·X월 — 돈과 에너지가 빠지기 쉬운 구간</p>
        <p>· 확장 추천 구간: X월 — 결정·시작이 잘 풀리는 창</p>
      </div>
      <p className="mt-2 text-center text-[11px] text-mute">정확한 시기·누수 지점은 전체 리포트에서 공개돼요.</p>
    </section>
  );
}
