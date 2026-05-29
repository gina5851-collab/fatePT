import type { ReportItem } from "@/lib/saju/report/types";

const FREE_BODY: Record<string, string> = {
  "오래 버틴 사람의 기질":
    "당신은 쉽게 무너지지 않으려고, 오래 버티는 쪽을 택해온 사람이에요. 그건 강해서가 아니라 책임감이 커서였고, 그 버팀이 어느 순간 '혼자 다 감당하는 방식'으로 굳어졌어요. 부족해서가 아니라, 너무 오래 버텨서 생긴 자세예요.",
  "지금 반복되고 있는 신호 1가지":
    "지금 당신의 흐름에는 '비슷한 선택을 또 하게 되는' 신호가 보여요. 끝났다고 생각한 자리에서 다시 같은 감정이 올라오는 건, 의지가 약해서가 아니라 패턴의 출발점을 아직 못 봤기 때문이에요. 그 지점만 알아도 반은 끊어집니다.",
};

export function LockedItems({ items }: { items: ReportItem[] }) {
  const free = items.filter((i) => i.free);
  const locked = items.filter((i) => !i.free);

  return (
    <section className="space-y-6">
      {/* 무료 공개 2 */}
      <div className="space-y-3">
        {free.map((it) => (
          <div key={it.id} className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold rounded-full bg-blue-400 text-[#0c1322] px-2 py-0.5">무료 공개</span>
              <span className="text-[11px] text-mute">{it.category}</span>
            </div>
            <p className="text-[15px] font-semibold text-ink">{it.title}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-body">
              {FREE_BODY[it.title] ?? it.teaser}
            </p>
          </div>
        ))}
      </div>

      {/* 잠금 21 — 이미 만들어졌지만 아직 못 보는 느낌 */}
      <div>
        <p className="text-[12px] text-mute mb-3">
          🔒 아래 <span className="text-ink font-semibold">{locked.length}개 패턴</span>은 이미 분석이 끝났어요. 아직 열어보지 않았을 뿐이에요.
        </p>
        <div className="grid grid-cols-1 gap-2.5">
          {locked.map((it) => (
            <div
              key={it.id}
              className="relative overflow-hidden rounded-xl border border-hairline bg-surface-soft p-4"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <span className="text-[10px] text-mute">{it.category}</span>
                  <p className="text-[14px] font-semibold text-ink truncate">{it.title}</p>
                </div>
                <span className="shrink-0 text-mute" aria-hidden>🔒</span>
              </div>
              {/* 블러 처리된 본문 미리보기 */}
              <p className="mt-1.5 text-[12px] leading-relaxed text-body blur-[5px] select-none" aria-hidden>
                {it.teaser} 이 부분은 당신의 명식에서 확인된 패턴으로, 구체적인 시기와 행동까지 분석돼 있어요.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProgressBar({ free, total, parts }: { free: number; total: number; parts: number }) {
  const pct = Math.round((free / total) * 100);
  return (
    <div className="rounded-xl border border-hairline bg-surface-soft p-4">
      <div className="flex items-center justify-between text-[12px] text-body mb-2">
        <span>{total}개 항목 · {parts}개 파트</span>
        <span className="text-ink font-semibold">{free}/{total} 공개</span>
      </div>
      <div className="h-2 rounded-full bg-hairline overflow-hidden">
        <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-[11px] text-mute">전체 해금 시 {total - free}개 패턴을 모두 확인할 수 있어요.</p>
    </div>
  );
}
