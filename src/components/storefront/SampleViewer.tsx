import type { SampleBlock } from "@/config/catalog";

// 결과 예시 렌더러 — 외부 이미지 없이 실제 결과 형식을 본뜬 익명 샘플을 그린다.
// 모든 샘플에 "결과 예시" 라벨을 명시한다 (실제 고객 데이터 아님).
export function SampleViewer({ sample }: { sample: SampleBlock }) {
  return (
    <figure className="rounded-2xl border border-white/10 bg-sf-navy p-5 md:p-6 overflow-hidden relative">
      {/* 라벨 */}
      <figcaption className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold text-sf-amber tracking-wide">📄 {sample.title || "결과 예시"}</span>
        <span className="text-[10px] rounded-full border border-sf-navy-soft bg-sf-navy-soft text-charcoal px-2 py-0.5">
          예시 화면 · 실제 결과와 형식이 같습니다
        </span>
      </figcaption>

      {sample.kind === "saju" ? <SajuSample sample={sample} /> : <TarotSample sample={sample} />}
    </figure>
  );
}

function SajuSample({ sample }: { sample: Extract<SampleBlock, { kind: "saju" }> }) {
  return (
    <div className="space-y-4">
      {/* 한 줄 진단 */}
      <div className="rounded-xl bg-sf-navy-soft border border-hairline p-4">
        <p className="text-[10px] font-mono text-mute mb-1.5">ONE-LINER</p>
        <p className="text-[15px] font-semibold text-ink leading-relaxed">{sample.oneLiner}</p>
      </div>

      {/* 섹션 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sample.sections.map((s, i) => (
          <div key={i} className="rounded-xl border border-hairline p-4">
            <p className="text-[11px] font-semibold text-sf-amber mb-1.5">{s.label}</p>
            <p className="text-[13px] text-charcoal leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      {/* 행동 처방 */}
      {sample.actions.length > 0 && (
        <ul className="space-y-1.5">
          {sample.actions.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-[13px] text-body">
              <span className="mt-0.5 text-sf-amber">✓</span>
              {a}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TarotSample({ sample }: { sample: Extract<SampleBlock, { kind: "tarot" }> }) {
  return (
    <div className="space-y-4">
      <p className="text-[12px] text-body">
        <span className="text-mute">질문 예시 —</span> “{sample.question}”
      </p>

      {/* 카드 배열 */}
      <div
        className={`grid gap-3 ${
          sample.cards.length >= 4
            ? "grid-cols-2 sm:grid-cols-3"
            : sample.cards.length === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1"
        }`}
      >
        {sample.cards.map((c, i) => (
          <div key={i} className="rounded-xl border border-hairline bg-sf-navy-soft p-3.5">
            <TarotCardArt index={i} />
            <p className="mt-2.5 text-[10px] font-mono text-mute">{c.position}</p>
            <p className="text-[13px] font-semibold text-ink">{c.card}</p>
            <p className="mt-1 text-[12px] text-body leading-relaxed">{c.meaning}</p>
          </div>
        ))}
      </div>

      {/* 종합 + 행동 */}
      <div className="rounded-xl border border-hairline p-4">
        <p className="text-[11px] font-semibold text-sf-amber mb-1.5">종합 리딩</p>
        <p className="text-[13px] text-charcoal leading-relaxed">{sample.summary}</p>
        <p className="mt-3 flex items-start gap-2 text-[13px] text-body">
          <span className="mt-0.5 text-sf-amber">✓</span>
          {sample.action}
        </p>
      </div>
    </div>
  );
}

// 타로 카드 뒷면풍 미니 아트 — 자체 SVG (외부 자산 없음)
function TarotCardArt({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 60 84" className="w-12 h-auto rounded-md border border-hairline-strong" aria-hidden>
      <rect width="60" height="84" rx="6" fill="#0c1730" />
      <circle cx="30" cy="34" r="14" fill="none" stroke="#e8a11c" strokeWidth="1.2" opacity="0.9" />
      <circle cx="30" cy="34" r="8" fill="none" stroke="#e8a11c" strokeWidth="0.8" opacity="0.6" />
      {[0, 1, 2, 3, 4].map((s) => {
        const a = (Math.PI * 2 * s) / 5 - Math.PI / 2 + index * 0.4;
        return (
          <circle key={s} cx={30 + Math.cos(a) * 14} cy={34 + Math.sin(a) * 14} r="1.6" fill="#e8a11c" />
        );
      })}
      <path d="M12 62 L48 62" stroke="#2c3c5b" strokeWidth="1" />
      <path d="M18 68 L42 68" stroke="#2c3c5b" strokeWidth="1" />
    </svg>
  );
}
