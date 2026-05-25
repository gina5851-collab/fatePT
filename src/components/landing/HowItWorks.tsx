// Ollama: stays on the same paper-white canvas, no surface alternation.
// Steps are numbered minimal markers in monospace.
export function HowItWorks() {
  const steps = [
    { n: "01", t: "고민 선택", d: "관계·돈·선택·자기이해 중 지금 가장 궁금한 주제의 리포트를 고릅니다" },
    { n: "02", t: "생년월일 입력", d: "생년월일·출생 시각·성별을 입력합니다. 고민 키워드를 추가하면 더 정밀합니다" },
    { n: "03", t: "결제", d: "토스페이먼츠로 안전하게 결제합니다. 카드·간편결제 모두 가능합니다" },
    { n: "04", t: "리포트 즉시 확인", d: "AI가 생성한 맞춤 자기이해 리포트를 바로 확인할 수 있습니다" },
  ];
  return (
    <section id="how-it-works" className="container py-20 border-t border-hairline">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-12">
        작동 방식
      </h2>
      <ol className="grid grid-cols-2 gap-8 md:grid-cols-4">
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
