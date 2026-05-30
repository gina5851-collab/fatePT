// 2026 반복 패턴 흐름 — 4구간 1차 버전
const QUARTERS = [
  { range: "1~3월", title: "반복 감지 구간", desc: "익숙한 패턴이 다시 고개를 드는 시기", color: "bg-amber-400/70", dot: "bg-amber-400" },
  { range: "4~6월", title: "관계·감정 정리 구간", desc: "사람과 마음을 다시 줄 세우는 시기", color: "bg-blue-400/70", dot: "bg-blue-400" },
  { range: "7~9월", title: "일·돈 회복 구간", desc: "새던 자리를 막고 흐름을 되돌리는 시기", color: "bg-emerald-400/70", dot: "bg-emerald-400" },
  { range: "10~12월", title: "전환 시도 구간", desc: "버틴 시간을 결과로 바꿔보는 시기", color: "bg-violet-400/70", dot: "bg-violet-400" },
];

export function FlowTimeline({ displayName }: { displayName: string }) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface-soft p-5">
      <p className="text-center text-[11px] font-mono tracking-[0.3em] text-mute mb-1">2026 FLOW</p>
      <h3 className="text-center text-[15px] font-semibold text-ink mb-4">{displayName}님의 2026년 흐름 4구간</h3>

      <div className="space-y-2.5">
        {QUARTERS.map((q) => (
          <div key={q.range} className="flex items-center gap-3 rounded-xl border border-hairline bg-canvas/30 p-3">
            <span className={`shrink-0 w-1.5 h-9 rounded-full ${q.color}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-mono text-mute">{q.range}</span>
                <span className="text-[13px] font-semibold text-ink">{q.title}</span>
              </div>
              <p className="text-[11px] text-body">{q.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1.5 text-[12px] text-body blur-[4px] select-none" aria-hidden>
        <p>· 대운 전환 타이밍: 2026년 X월 — 큰 흐름이 바뀌는 길목</p>
        <p>· 운의 누수 지점: X월·X월 — 돈과 에너지가 빠지기 쉬운 구간</p>
      </div>
      <p className="mt-2 text-center text-[11px] text-mute">정확한 월·누수 지점은 전체 리포트에서 공개돼요.</p>
    </section>
  );
}
