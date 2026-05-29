import type { Myeongsik, Pillar } from "@/lib/saju/manseryeok";

// 천기문式 명식표 — 오행 색상 카드 + 한자 + 일간 강조. 이미지·API 의존 0.
const CHEON_HANJA: Record<string, string> = {
  갑: "甲", 을: "乙", 병: "丙", 정: "丁", 무: "戊", 기: "己", 경: "庚", 신: "辛", 임: "壬", 계: "癸",
};
const JI_HANJA: Record<string, string> = {
  자: "子", 축: "丑", 인: "寅", 묘: "卯", 진: "辰", 사: "巳", 오: "午", 미: "未", 신: "申", 유: "酉", 술: "戌", 해: "亥",
};
const CHEON_OHAENG: Record<string, string> = {
  갑: "목", 을: "목", 병: "화", 정: "화", 무: "토", 기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
};
const JI_OHAENG: Record<string, string> = {
  인: "목", 묘: "목", 사: "화", 오: "화", 진: "토", 술: "토", 축: "토", 미: "토", 신: "금", 유: "금", 자: "수", 해: "수",
};
const OHAENG_STYLE: Record<string, { box: string; text: string }> = {
  목: { box: "bg-green-50 border-green-300", text: "text-green-700" },
  화: { box: "bg-red-50 border-red-300", text: "text-red-600" },
  토: { box: "bg-amber-50 border-amber-300", text: "text-amber-700" },
  금: { box: "bg-neutral-100 border-neutral-300", text: "text-neutral-700" },
  수: { box: "bg-blue-50 border-blue-300", text: "text-blue-700" },
};

function Glyph({ ko, kind, dayMaster }: { ko: string; kind: "cheon" | "ji"; dayMaster?: boolean }) {
  const hanja = kind === "cheon" ? CHEON_HANJA[ko] : JI_HANJA[ko];
  const ohaeng = (kind === "cheon" ? CHEON_OHAENG[ko] : JI_OHAENG[ko]) ?? "토";
  const s = OHAENG_STYLE[ohaeng];
  return (
    <div
      className={`relative rounded-xl border ${s.box} py-3 flex flex-col items-center justify-center ${dayMaster ? "ring-2 ring-red-400" : ""}`}
    >
      <span className={`text-2xl font-bold leading-none ${s.text}`}>{ko}</span>
      <span className={`mt-0.5 text-[11px] ${s.text} opacity-70`}>{hanja ?? ""}</span>
      <span className="absolute bottom-1 right-1.5 text-[9px] text-mute">{ohaeng}</span>
    </div>
  );
}

export function MyeongsikTable({ myeongsik }: { myeongsik: Myeongsik }) {
  const cols: { label: string; p: Pillar; day?: boolean }[] = [
    myeongsik.hour ? { label: "시주", p: myeongsik.hour } : null,
    { label: "일주", p: myeongsik.day, day: true },
    { label: "월주", p: myeongsik.month },
    { label: "년주", p: myeongsik.year },
  ].filter((c): c is { label: string; p: Pillar; day?: boolean } => c !== null);

  return (
    <div className="rounded-2xl border border-hairline bg-[#fafafa] p-4">
      <p className="text-center text-[11px] font-mono tracking-[0.3em] text-mute mb-3">命 式 · 사주팔자</p>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}
      >
        {cols.map((c, i) => (
          <div key={i} className="text-center">
            <p className="text-[11px] text-mute mb-1.5">
              {c.label}
              {c.day && <span className="ml-0.5 text-red-500">★</span>}
            </p>
            <div className="space-y-2">
              <Glyph ko={c.p.cheongan} kind="cheon" dayMaster={c.day} />
              <Glyph ko={c.p.jiji} kind="ji" />
            </div>
          </div>
        ))}
      </div>
      {myeongsik.hour === null && (
        <p className="mt-3 text-center text-[10px] text-mute">시주는 출생 시각을 입력하면 함께 표시돼요</p>
      )}
    </div>
  );
}
