import type { MbtiReading, MbtiType } from "@/lib/saju/report/mbti";

// MBTI(사회적 가면) vs 사주(숨겨진 본성) 거울 카드 — 천기문 핵심.
export function MbtiSajuMirrorCard({
  displayName, mbti, reading, sajuNature,
}: {
  displayName: string;
  mbti: MbtiType;
  reading: MbtiReading;
  sajuNature: string; // persona.oneLiner 등 사주 본성 한 줄
}) {
  return (
    <section className="rounded-2xl border border-hairline bg-surface-soft p-5">
      <h2 className="text-center text-[15px] font-semibold text-ink mb-4">
        {displayName}님의 겉모습과 속마음
      </h2>

      <div className="grid grid-cols-1 gap-3">
        {/* 겉모습 = MBTI */}
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
          <p className="text-[11px] font-semibold text-blue-300 mb-1">
            겉모습 {reading.known ? `· ${mbti}` : ""} (사회적 가면)
          </p>
          <p className="text-[13px] leading-relaxed text-ink">{reading.mask}</p>
        </div>

        {/* 속마음 = 사주 */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-[11px] font-semibold text-amber-300 mb-1">사주 본성 (숨겨진 결)</p>
          <p className="text-[13px] leading-relaxed text-ink">{sajuNature}</p>
        </div>
      </div>

      {/* 축별 해석 */}
      {reading.axisLines.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {reading.axisLines.map((line, i) => (
            <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-body">
              <span className="text-amber-300" aria-hidden>·</span>{line}
            </li>
          ))}
        </ul>
      )}

      {/* 결론 */}
      <p className="mt-4 rounded-lg bg-canvas/30 p-3 text-[13px] leading-relaxed text-ink">
        {displayName}님은 차갑거나 예민한 사람이 아니라,
        오래 버티기 위해 스스로를 단단하게 만든 사람이에요.
      </p>
    </section>
  );
}
