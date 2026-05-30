import { MyeongsikTable } from "@/components/saju/MyeongsikTable";
import type { NormalizedSaju } from "@/lib/saju/report/types";
import type { Myeongsik } from "@/lib/saju/manseryeok";

// 사주 원본 구조 카드 — 명식표 + 오행/십성 분포 + 신강약/신살/합충/대운세운 요약.
// 천기문식 "내 사주를 진짜 읽었다" 신뢰감.
function Dist({ label, entries }: { label: string; entries: [string, number][] }) {
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return (
    <div>
      <p className="text-[11px] text-mute mb-1.5">{label}</p>
      <div className="space-y-1">
        {entries.map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="w-7 text-[11px] text-body">{k}</span>
            <div className="h-1.5 flex-1 rounded-full bg-hairline overflow-hidden">
              <div className="h-full rounded-full bg-amber-400/70" style={{ width: `${(v / max) * 100}%` }} />
            </div>
            <span className="w-4 text-right text-[11px] font-mono text-body">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FortuneSourceCard({ displayName, s }: { displayName: string; s: NormalizedSaju }) {
  const toP = (pos: string) => {
    const p = s.pillars.find((x) => x.position === pos);
    return p ? { cheongan: p.gan, jiji: p.ji } : null;
  };
  const myeongsik: Myeongsik = {
    year: toP("year") ?? { cheongan: "—", jiji: "—" },
    month: toP("month") ?? { cheongan: "—", jiji: "—" },
    day: toP("day") ?? { cheongan: "—", jiji: "—" },
    hour: toP("hour"),
  };

  const ohaeng = (Object.entries(s.ohaengCount) as [string, number][]);
  const sipseong = (Object.entries(s.sipseongCount) as [string, number][]);
  const sinsalNames = Array.from(new Set(s.sinsals.map((x) => x.name))).slice(0, 6);

  return (
    <section className="space-y-4">
      <div className="text-center">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1.5">SAJU SOURCE</p>
        <h2 className="text-[17px] font-bold text-ink leading-snug">
          {displayName}님께 새겨진 여덟 글자의 운명
        </h2>
        <p className="mt-2 text-[12px] leading-relaxed text-body max-w-[360px] mx-auto">
          {displayName}님에게 타고난 형(形), 기질, 흐름이 어떻게 새겨져 있는지 확인해보세요.
          무료 결과에서는 핵심 구조 일부만 보여드립니다.
        </p>
      </div>

      <MyeongsikTable myeongsik={myeongsik} />

      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-hairline bg-surface-soft p-4">
        <Dist label="오행 분포" entries={ohaeng} />
        <Dist label="십성 분포" entries={sipseong} />
      </div>

      <div className="rounded-2xl border border-hairline bg-surface-soft p-4 space-y-2 text-[12px]">
        <Row label="일간" value={s.dayGan ?? "—"} />
        <Row label="신강/신약" value={s.sinStrengthLabel ?? "—"} />
        {s.gyeokgukName && <Row label="격국" value={s.gyeokgukName} />}
        {sinsalNames.length > 0 && <Row label="신살" value={sinsalNames.join(", ")} />}
        <Row label="합·충" value={`합 ${s.hapCount} · 충 ${s.chungCount}`} />
        <Row label="대운(현재)" value={s.daeun.currentLabel ?? "—"} />
        <Row label="세운(올해)" value={s.seun.currentLabel ?? "—"} />
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-mute">{label}</span>
      <span className="text-ink font-medium">{value}</span>
    </div>
  );
}
