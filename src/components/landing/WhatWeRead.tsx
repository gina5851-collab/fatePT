// 대문 아래 — "무엇을 읽어주나요?" 4축(관계/돈/일/감정) 궁금증 카드.
const CARDS = [
  { icon: "💞", axis: "관계", q: "왜 같은 사람에게 지칠까?" },
  { icon: "💸", axis: "돈", q: "왜 벌어도 남지 않을까?" },
  { icon: "💼", axis: "일", q: "왜 오래 버텨도 막힐까?" },
  { icon: "🌊", axis: "감정", q: "왜 괜찮다가 한 번에 무너질까?" },
];

export function WhatWeRead() {
  return (
    <section className="container py-14 border-t border-hairline">
      <h2 className="text-center text-xl md:text-2xl font-semibold tracking-tight text-ink mb-8">
        운명PT는 무엇을 읽어주나요?
      </h2>
      <div className="grid grid-cols-2 gap-3 max-w-[440px] mx-auto">
        {CARDS.map((c) => (
          <div key={c.axis} className="rounded-xl border border-hairline bg-surface-soft p-5">
            <p className="text-2xl mb-2">{c.icon}</p>
            <p className="text-[12px] text-amber-300 font-semibold mb-1">{c.axis}</p>
            <p className="text-[13px] leading-relaxed text-ink">{c.q}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
