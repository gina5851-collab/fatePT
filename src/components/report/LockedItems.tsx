import type { ReportItem } from "@/lib/saju/report/types";

const FREE_BODY: Record<string, string[]> = {
  // 무료 공개 1 — 오래 버티며 생긴 자기보호 패턴
  "오래 버틴 사람의 기질": [
    "{name}님은 어지간한 일에는 흔들리지 않는 사람이에요. 힘들어도 '내가 좀 참으면 되지' 하고 넘겨온 시간이 길었을 거예요. 주변에서는 그런 {name}님을 보고 '강하다', '알아서 잘한다'고 말하지만, 사실 그건 강해서가 아니라 책임감이 커서, 그리고 무너지면 안 된다는 마음이 더 컸기 때문이에요.",
    "문제는, 그렇게 오래 버티다 보면 버티는 게 '성격'처럼 굳어진다는 거예요. 누가 도와준다고 해도 '괜찮아요, 제가 할게요'가 먼저 나오고, 약한 모습을 보이느니 차라리 혼자 감당하는 쪽을 택하게 돼요. 이건 {name}님이 차갑거나 고집이 세서가 아니에요. 한 번 기댔다가 실망한 경험이, '결국 믿을 건 나뿐'이라는 자기보호 방식을 만든 거예요.",
    "그래서 지금 {name}님이 느끼는 공허함이나 지침은, 능력이 부족해서 생긴 게 아니에요. 오히려 너무 잘 버텨왔기 때문에 생긴 피로예요. 늘 켜져 있는 상태로 살아온 사람에게 필요한 건 더 강해지는 게 아니라, 이제는 좀 꺼도 된다는 허락이에요.",
    "{name}님의 진짜 강점은 '버티는 힘'이 아니라, 그 힘을 어디에 쓸지 고를 수 있다는 데 있어요. 다 감당하지 않아도 되는 자리를 구분하기 시작하면, 같은 에너지로 훨씬 멀리 갈 수 있어요.",
  ],
  // 무료 공개 2 — 지금 가장 강하게 반복되는 막힘 지점
  "지금 반복되고 있는 신호 1가지": [
    "지금 {name}님의 흐름에서 가장 또렷하게 보이는 건, '비슷한 자리에서 또 막힌다'는 신호예요. 사람이 바뀌고 환경이 바뀌어도, 이상하게 같은 지점에서 같은 감정이 올라온 적 있을 거예요. '왜 나는 매번 여기서 걸리지?' 싶은 그 자리요.",
    "많은 분들이 이걸 '내가 의지가 약해서', '내가 또 잘못 골라서'라고 자책해요. 그런데 반복은 의지의 문제가 아니라 구조의 문제예요. {name}님은 특정 상황에서 거의 자동으로 같은 선택을 하도록 오래 길들여져 있어요. 그게 한때는 {name}님을 지켜준 방식이었기 때문에, 몸이 먼저 그쪽으로 움직이는 거예요.",
    "예를 들면 이런 식이에요. 관계에서는 '내가 더 맞춰서' 잡으려 하고, 일에서는 '내가 더 해서' 막으려 하고, 마음이 힘들 땐 '티 안 내고' 버티려 해요. 각각은 달라 보여도, 뿌리에 있는 패턴은 하나예요. 그 출발점 하나만 보이면, 반복은 생각보다 쉽게 끊깁니다.",
    "이 리포트의 나머지에서는 그 출발점이 {name}님의 관계·돈·일·감정에서 각각 어떻게 다르게 나타나는지, 그리고 2026년에 어디서 또 반복될 가능성이 높은지를 구체적으로 짚어드려요. 끝났다고 생각한 패턴이 다시 시작되기 전에, 먼저 알아두면 돼요.",
  ],
};

function fillName(text: string, name: string): string {
  return text.replace(/\{name\}/g, name);
}

export function LockedItems({ displayName, items }: { displayName: string; items: ReportItem[] }) {
  const free = items.filter((i) => i.free);
  const locked = items.filter((i) => !i.free);

  return (
    <section className="space-y-6">
      {/* 무료 공개 2 — 맛보기이자 돈값 (각 4문단) */}
      <div className="space-y-3">
        {free.map((it, idx) => {
          const paras = FREE_BODY[it.title];
          const heading = idx === 0 ? "오래 버티며 생긴 자기보호 패턴" : "지금 가장 강하게 반복되는 막힘 지점";
          return (
            <div key={it.id} className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-semibold rounded-full bg-blue-400 text-[#0c1322] px-2 py-0.5">무료 공개</span>
                <span className="text-[11px] text-mute">{it.category}</span>
              </div>
              <p className="text-[15px] font-semibold text-ink">{heading}</p>
              <div className="mt-2.5 space-y-2.5">
                {(paras ?? [it.teaser]).map((p, i) => (
                  <p key={i} className="text-[13px] leading-[1.7] text-body">{fillName(p, displayName)}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 잠금 21 — 이미 만들어졌지만 아직 못 보는 느낌 */}
      <div>
        <p className="text-[12px] text-mute mb-3">
          🔒 {displayName}님의 <span className="text-ink font-semibold">{locked.length}개 패턴</span>은 이미 분석이 끝났어요. 아직 열어보지 않았을 뿐이에요.
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
                {it.teaser} 이 부분은 {displayName}님의 명식에서 확인된 패턴으로, 구체적인 시기와 행동까지 분석돼 있어요.
              </p>
              {it.relatedSignals && it.relatedSignals.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {it.relatedSignals.map((sig) => (
                    <span key={sig} className="rounded bg-hairline/60 px-1.5 py-0.5 text-[10px] text-mute">
                      {sig}
                    </span>
                  ))}
                  <span className="text-[10px] text-mute self-center">· 전체 리포트에서 확인 가능</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProgressBar({
  displayName, free, total, parts,
}: { displayName: string; free: number; total: number; parts: number }) {
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
      <p className="mt-2 text-[11px] text-mute">
        지금은 {displayName}님의 리포트 중 {free}/{total}개 항목만 공개되었어요. 전체 해금 시 {total - free}개 패턴을 모두 확인할 수 있어요.
      </p>
    </div>
  );
}
