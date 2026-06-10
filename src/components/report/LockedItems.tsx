import type { ReportItem } from "@/lib/saju/report/types";

// ────────────────────────────────────────────────────────
// 무료 공개 본문 (FREE_BODY)
// 흐름:
// ① 정체성 몰입 — 오래 버틴 사람의 자기보호
// ② 타고난 기질 — 신중함과 예리함, 결정적 순간의 판단
// ③ 살아가는 방식 — 필터 없는 현실 통찰 + 피로 인정
// ④ 지금 반복되는 신호 — 이미 보이는 패턴
// ────────────────────────────────────────────────────────
const FREE_BODY_IDENTITY: string[] = [
  "{name}님은 어지간한 일에는 흔들리지 않는 사람이에요. 힘들어도 '내가 좀 참으면 되지' 하고 넘겨온 시간이 길었을 거예요. 주변에서는 그런 {name}님을 보고 '강하다', '알아서 잘한다'고 말하지만, 사실 그건 강해서가 아니라 책임감이 커서, 그리고 무너지면 안 된다는 마음이 더 컸기 때문이에요.",
  "문제는, 그렇게 오래 버티다 보면 버티는 게 '성격'처럼 굳어진다는 거예요. 누가 도와준다고 해도 '괜찮아요, 제가 할게요'가 먼저 나오고, 약한 모습을 보이느니 차라리 혼자 감당하는 쪽을 택하게 돼요. 이건 {name}님이 차갑거나 고집이 세서가 아니에요. 한 번 기댔다가 실망한 경험이, '결국 믿을 건 나뿐'이라는 자기보호 방식을 만든 거예요.",
  "그래서 지금 {name}님이 느끼는 공허함이나 지침은, 능력이 부족해서 생긴 게 아니에요. 오히려 너무 잘 버텨왔기 때문에 생긴 피로예요. 늘 켜져 있는 상태로 살아온 사람에게 필요한 건 더 강해지는 게 아니라, 이제는 좀 꺼도 된다는 허락이에요.",
  "{name}님의 진짜 강점은 '버티는 힘'이 아니라, 그 힘을 어디에 쓸지 고를 수 있다는 데 있어요. 다 감당하지 않아도 되는 자리를 구분하기 시작하면, 같은 에너지로 훨씬 멀리 갈 수 있어요.",
];

const FREE_BODY_NATURE: string[] = [
  "{name}님의 사주에는 신중함과 예리함이 강하게 드러납니다. 겉으로는 차분하고 신중해 보이지만, 안쪽에는 자기 기준이 분명한 사람이에요. 남들이 정해놓은 길을 그대로 따라가기보다, 스스로 납득한 방식으로 움직일 때 힘이 살아납니다.",
  "쉽게 흔들리지 않는다는 건 단순히 무던하다는 뜻이 아니에요. 보통 사람이라면 그냥 넘겨버릴 신호를, {name}님은 이미 한 번 더 보고 한 번 더 생각해본 사람이에요. 결정적인 순간에는 자신의 판단을 믿고 움직이는 구조라, 평소에 머뭇거리는 듯 보여도 막상 결정해야 할 자리에서는 흔들림이 적어요.",
  "다만 감정 표현이나 속마음을 바로 드러내기보다, 충분히 지켜본 뒤 선택하는 경향이 있습니다. 이건 차가운 게 아니라, 안전하다고 느낄 때까지 마음을 안 여는 결이에요. 그래서 {name}님과 가까워지는 데에는 시간이 걸리지만, 한 번 곁을 내준 사람에게는 깊게 가는 사람이에요.",
  "이 신중함과 예리함이 재물과 관계에서 어떻게 작동하는지는, 전체 명식 분석에서 더 선명하게 드러납니다. 같은 성향이 어떤 자리에서는 강점이 되고, 어떤 자리에서는 피로의 출발점이 되거든요.",
];

const FREE_BODY_LIVING: string[] = [
  "{name}님은 복잡한 상황 속에서도 핵심을 빠르게 짚어내는 힘이 있어요. 사람을 볼 때도, 흐름을 읽을 때도, 필터 없이 본질을 보는 결이 있습니다. 그래서 같은 자리에 있어도 다른 사람들이 못 보는 결을 먼저 보는 일이 자주 일어나요.",
  "이 능력은 분명한 강점이지만, 동시에 피로의 원인이기도 해요. 너무 많이 보이면 너무 많이 책임지게 되거든요. 모든 것을 혼자 판단하고 책임지려 할 때 피로가 쌓이고, 정작 도움이 필요한 순간에 도움을 청하지 못하게 됩니다.",
  "{name}님은 자유롭게 보이지만, 사실 그건 기준이 없어서가 아니에요. 자기 기준이 너무 분명해서, 남의 기준에 맞추는 게 답답하게 느껴지는 것뿐이에요. 조직이나 관계에서 정해진 틀만 따를 때 답답함이 커지는 건 그 때문입니다.",
  "전체 리포트에서는 이 성향이 {name}님의 돈, 관계, 일에서 어떻게 반복되는지 더 구체적으로 분석합니다. 같은 예리함이 어디서 무기가 되고, 어디서는 자기를 베는지 — 그 분기점이 명식 안에 새겨져 있어요.",
];

// 기존 items.ts 의 free=true 항목 본문 — title 매칭
const FREE_BODY: Record<string, string[]> = {
  "오래 버틴 사람의 기질": FREE_BODY_IDENTITY,
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

function FreeSection({
  eyebrow,
  title,
  paras,
  displayName,
}: {
  eyebrow: string;
  title: string;
  paras: string[];
  displayName: string;
}) {
  return (
    <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-semibold rounded-full bg-blue-400 text-[#0c1322] px-2 py-0.5">
          무료 공개
        </span>
        <span className="text-[11px] text-mute">{eyebrow}</span>
      </div>
      <h3 className="text-[16px] font-semibold text-ink leading-snug">{fillName(title, displayName)}</h3>
      <div className="mt-3 space-y-2.5">
        {paras.map((p, i) => (
          <p key={i} className="text-[13px] leading-[1.75] text-body">
            {fillName(p, displayName)}
          </p>
        ))}
      </div>
    </div>
  );
}

function LockedTeaserCard({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-hairline bg-surface-soft px-4 py-3.5">
      <span aria-hidden className="text-lg shrink-0 mt-0.5">🔒</span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-ink leading-snug">{title}</p>
        <p className="mt-0.5 text-[11px] text-mute">{sub}</p>
      </div>
    </div>
  );
}

// 잠금 모드(무료) — 4 free section + 2 inline teaser + locked grid
export function LockedItems({
  displayName,
  items,
  unlocked = false,
}: {
  displayName: string;
  items: ReportItem[];
  unlocked?: boolean;
}) {
  const free = items.filter((i) => i.free);
  const locked = items.filter((i) => !i.free);

  if (unlocked) {
    return <UnlockedItems displayName={displayName} items={items} />;
  }

  const identityBody = free[0] ? FREE_BODY[free[0].title] ?? FREE_BODY_IDENTITY : FREE_BODY_IDENTITY;
  const flowBody = free[1] ? FREE_BODY[free[1].title] ?? [] : [];

  return (
    <section className="space-y-5">
      {/* ① 정체성 몰입 */}
      <FreeSection
        eyebrow="속성 분석"
        title={`{name}님께 새겨진 여덟 글자의 운명`}
        paras={identityBody}
        displayName={displayName}
      />

      {/* ② 타고난 기질 */}
      <FreeSection
        eyebrow="타고난 기질"
        title="얼어붙은 대지 위에서 스스로 빛나는 보석"
        paras={FREE_BODY_NATURE}
        displayName={displayName}
      />

      {/* 잠금 카드 1 — 본문 중간 호기심 장치 */}
      <LockedTeaserCard
        title={`${displayName}님의 보석 같은 감각이 현실에서 빛나는 결정적 순간`}
        sub="전체 명식에서 확인 가능"
      />

      {/* ③ 살아가는 방식 */}
      <FreeSection
        eyebrow="살아가는 방식"
        title="필터 없는 예리함이 만드는 현실적 통찰"
        paras={FREE_BODY_LIVING}
        displayName={displayName}
      />

      {/* 잠금 카드 2 */}
      <LockedTeaserCard
        title="당신의 재능이 막히는 지점과 다시 흐름을 여는 방법"
        sub="프리미엄 리포트에서 확인 가능"
      />

      {/* ④ 지금 반복되는 신호 (기존 무료 본문 2) */}
      {flowBody.length > 0 && (
        <FreeSection
          eyebrow="지금 흐름"
          title="지금 반복되고 있는 신호 1가지"
          paras={flowBody}
          displayName={displayName}
        />
      )}

      {/* 잠금 21개 그리드 */}
      <div>
        <p className="text-[12px] text-mute mb-3 mt-2">
          🔒 {displayName}님의 <span className="text-ink font-semibold">{locked.length}개 패턴</span>은
          이미 분석이 끝났어요. 아직 열어보지 않았을 뿐이에요.
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
              <p className="mt-1.5 text-[12px] leading-relaxed text-body blur-[5px] select-none" aria-hidden>
                {it.teaser} 이 부분은 {displayName}님의 명식에서 확인된 패턴으로, 구체적인 시기와 행동까지 분석돼 있어요.
              </p>
              {it.relatedSignals && it.relatedSignals.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {it.relatedSignals.map((sig) => (
                    <span
                      key={sig}
                      className="rounded bg-hairline/60 px-1.5 py-0.5 text-[10px] text-mute"
                    >
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

// 결제 완료 모드 — 모든 항목 풀텍스트 + 잠금 해제 헤더
function UnlockedItems({ displayName, items }: { displayName: string; items: ReportItem[] }) {
  // 무료 본문은 기존대로, 잠금 본문은 teaser + 풀텍스트(임시: teaser 확장형) 으로 노출
  const free = items.filter((i) => i.free);
  const locked = items.filter((i) => !i.free);

  return (
    <section className="space-y-5">
      <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-center">
        <p className="text-[11px] font-mono tracking-[0.3em] text-amber-300 mb-1">UNLOCKED</p>
        <p className="text-[14px] font-semibold text-ink">
          {displayName}님의 전체 리포트가 열렸습니다
        </p>
        <p className="mt-1 text-[12px] text-body">
          총 {items.length}개 패턴 — 모든 항목을 이어서 확인하세요.
        </p>
      </div>

      {/* 4개 무료 본문 그대로 */}
      <FreeSection
        eyebrow="속성 분석"
        title={`{name}님께 새겨진 여덟 글자의 운명`}
        paras={free[0] ? FREE_BODY[free[0].title] ?? FREE_BODY_IDENTITY : FREE_BODY_IDENTITY}
        displayName={displayName}
      />
      <FreeSection
        eyebrow="타고난 기질"
        title="얼어붙은 대지 위에서 스스로 빛나는 보석"
        paras={FREE_BODY_NATURE}
        displayName={displayName}
      />
      <FreeSection
        eyebrow="살아가는 방식"
        title="필터 없는 예리함이 만드는 현실적 통찰"
        paras={FREE_BODY_LIVING}
        displayName={displayName}
      />
      {free[1] && (
        <FreeSection
          eyebrow="지금 흐름"
          title="지금 반복되고 있는 신호 1가지"
          paras={FREE_BODY[free[1].title] ?? []}
          displayName={displayName}
        />
      )}

      {/* 잠금 해제된 21개 — 풀텍스트 */}
      <div className="space-y-3 pt-2">
        <p className="text-[12px] text-mute">
          {displayName}님의 명식에서 확인된 {locked.length}개 패턴을 이어서 확인하세요.
        </p>
        {locked.map((it) => (
          <div key={it.id} className="rounded-xl border border-hairline bg-surface-soft p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] text-mute">{it.category}</span>
              {it.relatedSignals && it.relatedSignals.length > 0 && (
                <div className="flex gap-1">
                  {it.relatedSignals.slice(0, 2).map((sig) => (
                    <span key={sig} className="rounded bg-hairline/60 px-1.5 py-0.5 text-[10px] text-mute">
                      {sig}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="text-[14px] font-semibold text-ink">{it.title}</p>
            <p className="mt-2 text-[13px] leading-[1.7] text-body">
              {it.teaser} 이 부분은 {displayName}님의 명식에서 확인된 패턴으로, 구체적인 시기와 행동까지 분석돼 있어요.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// 기존 호환용 — ProgressBar 는 UnlockProgress 로 대체됨. 호출처 정리 후 제거 가능.
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
