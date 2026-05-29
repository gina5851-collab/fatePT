// 후기 카드 — 요청된 5가지 감정. (샘플 후기: 실제 후기 쌓이면 DB로 교체)
const REVIEWS = [
  { tag: "#불안했는데", emotion: "불안해서 봤는데 이상하게 마음이 놓였어요", body: "뭔가 잘못된 줄 알고 떨면서 봤는데, 읽고 나니 '아 내가 그동안 너무 버텼구나' 싶어서 오히려 위로받았어요." },
  { tag: "#팩폭", emotion: "팩폭인데 기분 나쁘지 않았어요", body: "정확하게 짚는데 이상하게 기분이 안 상해요. 혼내는 게 아니라 설명해주는 느낌이라 그런가 봐요." },
  { tag: "#무료랑다름", emotion: "무료 테스트랑 확실히 달라요", body: "다른 데 무료 사주는 '좋은 기운이 와요~' 이런 건데, 여긴 제 반복 패턴을 콕 짚어줘서 소름." },
  { tag: "#해석", emotion: "나를 평가하는 게 아니라 해석해주는 느낌이었어요", body: "점수 매기는 게 아니라, 왜 그랬는지 풀어줘서 계속 읽게 돼요. 다 읽고 나니 결제한 거 안 아까웠어요." },
];

export function ReviewCards() {
  return (
    <section>
      <h3 className="text-center text-[15px] font-semibold text-ink mb-1">먼저 전체를 본 분들의 이야기</h3>
      <p className="text-center text-[11px] text-mute mb-4">평가가 아니라 해석이라, 읽고 나면 마음이 놓여요.</p>
      <div className="space-y-2.5">
        {REVIEWS.map((r) => (
          <div key={r.tag} className="rounded-xl border border-hairline bg-surface-soft p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-amber-300 text-[12px]">★★★★★</span>
              <span className="text-[11px] text-mute">{r.tag}</span>
            </div>
            <p className="text-[13px] font-semibold text-ink">{r.emotion}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-body">{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
