import type { PersonaProfile } from "@/lib/saju/report/persona";

// 개인 타입명 히어로 — 결과지 최상단. 불안 후킹 → 타입명 → 한 줄 정체성.
export function PersonaHero({ displayName, persona }: { displayName: string; persona: PersonaProfile }) {
  return (
    <header className="text-center">
      <p className="text-[13px] text-body mb-2">왜 나는 늘 같은 문제에서 막힐까요?</p>
      <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-3">{displayName}님의 사주 원본 분석</p>
      <h1 className="text-[26px] font-extrabold leading-snug text-amber-300">{persona.typeName}</h1>
      <p className="mt-2 text-[14px] text-ink">{persona.subtitle}</p>
      <p className="mt-3 text-[13px] leading-relaxed text-body">{persona.oneLiner}</p>
      {persona.keywords.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {persona.keywords.map((k) => (
            <span key={k} className="rounded-full border border-hairline px-2.5 py-0.5 text-[11px] text-body">{k}</span>
          ))}
        </div>
      )}
    </header>
  );
}
