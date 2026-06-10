// 프리미엄 미리보기 — 일부 공개 + 나머지 블러 처리. "뒤에 더 있다"는 결핍을 만든다.
export function PremiumPreview({ displayName }: { displayName: string }) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface-soft overflow-hidden">
      <div className="p-5 pb-3">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-2">부의 흐름</p>
        <h3 className="text-[17px] font-bold text-ink leading-snug">
          보석의 전략 — 재물이 폭발하는 순간
        </h3>
        <p className="mt-3 text-[13px] leading-[1.7] text-body">
          {displayName}님의 재물 구조는 <span className="font-semibold text-ink">폭발형(R5)</span>입니다.
          평소에는 신중하게 내공을 쌓다가, 결정적인 타이밍에 자신의 예리한 안목을 투여해 성과를 거두는 구조예요.
        </p>
        <p className="mt-2 text-[13px] leading-[1.7] text-body">
          매달 일정하게 들어오는 흐름보다, 흐름의 결을 읽고 한 번에 가져가는 구조에 가까워요.
          그래서 평소엔 느려 보이지만, 한 번 움직일 땐 누구보다 크게 가져갑니다.
        </p>
      </div>

      {/* 블러 처리 — 실제로 안 읽히게 */}
      <div className="relative px-5 pb-5">
        <div
          aria-hidden
          className="space-y-2.5 select-none pointer-events-none blur-[5px]"
        >
          <p className="text-[13px] leading-[1.7] text-body">
            다만 {displayName}님의 사주에는 재성이 흐름을 타는 결정적 시기가 따로 있어요.
            이 시기를 놓치면 같은 노력으로도 절반밖에 가져오지 못하는 구조가 됩니다.
          </p>
          <p className="text-[13px] leading-[1.7] text-body">
            특히 2026년 하반기 ~ 2027년 상반기 구간에서는 재물 누수의 신호가 보입니다.
            구체적인 시기와 어떤 결정이 위험한지는 전체 리포트에서 확인할 수 있어요.
          </p>
          <p className="text-[13px] leading-[1.7] text-body">
            이 구간을 어떻게 통과하느냐에 따라 향후 10년의 재물 흐름이 갈립니다.
            {displayName}님께 맞는 진입 타이밍과 회수 타이밍은 명식 안에 이미 새겨져 있어요.
          </p>
          <p className="text-[13px] leading-[1.7] text-body">
            돈이 들어왔을 때 어디로 흘려야 하는지, 어디서 막혀야 하는지 —
            폭발형 재물 구조를 가진 사람에게만 적용되는 전략이 별도로 있습니다.
          </p>
          <p className="text-[13px] leading-[1.7] text-body">
            그리고 마지막으로, {displayName}님이 절대 손대지 말아야 하는 자리도 분석돼 있어요.
          </p>
        </div>

        {/* gradient + 자물쇠 */}
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent via-canvas/60 to-canvas pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <div className="rounded-full bg-canvas/80 border border-hairline w-12 h-12 flex items-center justify-center text-2xl">
            🔒
          </div>
          <p className="text-[12px] text-mute font-medium">
            전체 명식 분석에서 확인할 수 있습니다
          </p>
        </div>
      </div>
    </section>
  );
}
