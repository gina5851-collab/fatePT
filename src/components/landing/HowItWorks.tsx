// Ollama: stays on the same paper-white canvas, no surface alternation.
// Steps are numbered minimal markers in monospace.
export function HowItWorks() {
  const steps = [
    { n: "01", t: "프로그램 선택", d: "운명 인바디·연애 세션·재회 회복·인생 리디자인 중 지금 필요한 프로그램을 고릅니다" },
    { n: "02", t: "운명 체성분 측정", d: "생년월일·출생 시각·성별을 입력해 내 명식(운명 체성분)을 측정합니다" },
    { n: "03", t: "결제", d: "토스페이먼츠 또는 무통장입금으로 안전하게 결제합니다" },
    { n: "04", t: "진단·처방 즉시 확인", d: "AI 운명 트레이너의 진단서와 맞춤 루틴 처방을 바로 확인합니다" },
  ];
  return (
    <section id="how-it-works" className="container py-20 border-t border-hairline">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-12">
        트레이닝 방식
      </h2>
      <ol className="grid grid-cols-1 gap-7 max-w-[360px] mx-auto">
        {steps.map((s) => (
          <li key={s.n}>
            <p className="text-xs font-mono text-mute mb-2">{s.n}</p>
            <p className="text-base font-semibold mb-1.5">{s.t}</p>
            <p className="text-sm text-body leading-relaxed">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
