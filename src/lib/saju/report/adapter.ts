// =====================================================
// luckyloveme API 응답 → 내부 표준(NormalizedSaju) adapter
// =====================================================
// 원본 JSON 구조가 일부 누락/변형돼도 안전하게 동작하도록 전부 옵셔널 처리.
// API 키/원본 응답은 이 모듈 밖으로 로깅하지 않는다.

import type { SajuAnalysisResponse } from "@/lib/saju/saju-api";
import type {
  NormalizedSaju,
  NormalizedPillar,
  Ohaeng,
  SipseongCategory,
  HapChungLite,
  SinsalLite,
} from "./types";

const OHAENG_LIST: Ohaeng[] = ["목", "화", "토", "금", "수"];
const SIPSEONG_LIST: SipseongCategory[] = ["비겁성", "식상성", "재성", "관성", "인성"];

// 천간/지지 → 오행 (응답에 ohaeng이 없을 때 폴백용)
const CHEON_OHAENG: Record<string, Ohaeng> = {
  갑: "목", 을: "목", 병: "화", 정: "화", 무: "토", 기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
};
const JI_OHAENG: Record<string, Ohaeng> = {
  인: "목", 묘: "목", 사: "화", 오: "화", 진: "토", 술: "토", 축: "토", 미: "토",
  신: "금", 유: "금", 자: "수", 해: "수",
};

type GanjiPillar = {
  gan?: string;
  ji?: string;
  ganHanja?: string;
  jiHanja?: string;
  ohaeng?: { gan?: Ohaeng | null; ji?: Ohaeng | null };
};

function normOhaeng(v: unknown): Ohaeng | null {
  return OHAENG_LIST.includes(v as Ohaeng) ? (v as Ohaeng) : null;
}

export function normalizeSaju(analysis: SajuAnalysisResponse): NormalizedSaju {
  const ganji = (analysis.ganji ?? {}) as Record<string, GanjiPillar | undefined>;

  const pillarDefs: { key: string; position: NormalizedPillar["position"]; label: string }[] = [
    { key: "year", position: "year", label: "년주" },
    { key: "month", position: "month", label: "월주" },
    { key: "day", position: "day", label: "일주" },
    { key: "hour", position: "hour", label: "시주" },
  ];

  const pillars: NormalizedPillar[] = [];
  const ohaengCount: Record<Ohaeng, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  for (const def of pillarDefs) {
    const p = ganji[def.key];
    if (!p || !p.gan || !p.ji) continue;
    const ganOhaeng = normOhaeng(p.ohaeng?.gan) ?? CHEON_OHAENG[p.gan] ?? null;
    const jiOhaeng = normOhaeng(p.ohaeng?.ji) ?? JI_OHAENG[p.ji] ?? null;
    if (ganOhaeng) ohaengCount[ganOhaeng] += 1;
    if (jiOhaeng) ohaengCount[jiOhaeng] += 1;
    pillars.push({
      position: def.position,
      label: def.label,
      gan: p.gan,
      ji: p.ji,
      ganHanja: p.ganHanja,
      jiHanja: p.jiHanja,
      ganOhaeng,
      jiOhaeng,
      isDayMaster: def.position === "day",
    });
  }

  const dayPillar = pillars.find((p) => p.position === "day");
  const dayGan = dayPillar?.gan ?? null;

  // 오행 우세/결핍
  const ohaengEntries = OHAENG_LIST.map((o) => [o, ohaengCount[o]] as const);
  const maxOhaeng = Math.max(...ohaengEntries.map(([, c]) => c));
  const ohaengDominant = maxOhaeng > 0 ? (ohaengEntries.find(([, c]) => c === maxOhaeng)?.[0] ?? null) : null;
  const ohaengMissing = OHAENG_LIST.filter((o) => ohaengCount[o] === 0);

  // ── 십성 분포 ───────────────────────────────
  const sipseongCount: Record<SipseongCategory, number> = {
    비겁성: 0, 식상성: 0, 재성: 0, 관성: 0, 인성: 0,
  };
  const sip = analysis.sipseong as { summary?: Record<string, number> } | undefined;
  if (sip?.summary) {
    sipseongCount.비겁성 = sip.summary.bigyeop ?? 0;
    sipseongCount.식상성 = sip.summary.siksang ?? 0;
    sipseongCount.재성 = sip.summary.jaeseong ?? 0;
    sipseongCount.관성 = sip.summary.gwanseong ?? 0;
    sipseongCount.인성 = sip.summary.inseong ?? 0;
  }
  const sipMax = Math.max(...SIPSEONG_LIST.map((s) => sipseongCount[s]));
  const sipseongDominant = sipMax > 0 ? (SIPSEONG_LIST.find((s) => sipseongCount[s] === sipMax) ?? null) : null;

  // ── 신강/신약 ───────────────────────────────
  const sinS = analysis.sinStrength as
    | { level?: number; strength?: string; isStrong?: boolean }
    | undefined;
  const sinStrengthLevel = typeof sinS?.level === "number" ? sinS.level : null;
  const sinStrengthLabel = sinS?.strength ?? null;
  const isStrong = typeof sinS?.isStrong === "boolean" ? sinS.isStrong : null;

  // ── 대운/세운/월운 (현재 요약) ───────────────
  const daeunRaw = analysis.daeun as
    | { direction?: string; current_daeun?: { ganji?: string; sipseong?: { ganCategory?: string } } }
    | undefined;
  const daeun = {
    currentLabel: daeunRaw?.current_daeun?.ganji ?? null,
    currentSipseong: daeunRaw?.current_daeun?.sipseong?.ganCategory ?? null,
    direction: daeunRaw?.direction ?? null,
  };

  const seunRaw = analysis.seun as
    | { currentSeun?: { year?: number; ganji?: string; sipseongRelation?: { gan?: string } } }
    | undefined;
  const seun = {
    currentYear: seunRaw?.currentSeun?.year ?? null,
    currentLabel: seunRaw?.currentSeun?.ganji ?? null,
    currentSipseong: seunRaw?.currentSeun?.sipseongRelation?.gan ?? null,
  };

  const weolunRaw = analysis.weolun as { currentWeolun?: { monthLabel?: string } } | undefined;
  const weolun = { currentLabel: weolunRaw?.currentWeolun?.monthLabel ?? null };

  // ── 합충 ────────────────────────────────────
  const hapchungRaw = (analysis.hapchung ?? []) as Array<{
    type?: string; source?: string; target?: string; meaning?: string;
  }>;
  const hapchung: HapChungLite[] = hapchungRaw
    .filter((h) => h.type)
    .map((h) => ({ type: h.type!, source: h.source ?? "", target: h.target ?? "", meaning: h.meaning }));
  const isChung = (t: string) => /충|형|파|해|원진/.test(t);
  const isHap = (t: string) => /합/.test(t);
  const chungCount = hapchung.filter((h) => isChung(h.type)).length;
  const hapCount = hapchung.filter((h) => isHap(h.type)).length;

  // ── 신살 (12신살 + 도화/홍염/화개) ──────────
  const sinsals: SinsalLite[] = [];
  const sibi = analysis.sibisinsals as { sibisinsals?: Array<{ name?: string; position?: string; ji?: string }> } | undefined;
  for (const s of sibi?.sibisinsals ?? []) {
    if (s.name) sinsals.push({ name: s.name, position: s.position, ji: s.ji });
  }
  const dohwaArr = (analysis.dohwa as { dohwa?: Array<{ name?: string; ji?: string }> } | undefined)?.dohwa ?? [];
  const hongyeomArr = (analysis.hongyeom as { hongyeom?: Array<{ name?: string; ji?: string }> } | undefined)?.hongyeom ?? [];
  const hwagaeArr = (analysis.hwagae as { hwagae?: Array<{ name?: string; ji?: string }> } | undefined)?.hwagae ?? [];
  for (const d of dohwaArr) if (d.name) sinsals.push({ name: d.name, ji: d.ji });
  for (const h of hongyeomArr) if (h.name) sinsals.push({ name: h.name, ji: h.ji });
  for (const h of hwagaeArr) if (h.name) sinsals.push({ name: h.name, ji: h.ji });

  // ── 귀인 ────────────────────────────────────
  const guiin = (analysis.guiin ?? {}) as Record<string, Array<unknown> | undefined>;
  const guiinCount = Object.values(guiin).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);

  // ── 격국/용신 ───────────────────────────────
  const gyeok = analysis.gyeokguk as
    | { name?: string; yongsin?: { 오행?: string }; 기신오행?: string }
    | undefined;
  const gyeokgukName = gyeok?.name ?? null;
  const yongsinOhaeng = normOhaeng(gyeok?.yongsin?.오행);
  const gisinOhaeng = normOhaeng(gyeok?.기신오행);

  // ── 비견/겁재 ───────────────────────────────
  const bg = analysis.bigyeonGeobjae as { bigyeonCount?: number; geobjaeCount?: number } | undefined;
  const bigyeonCount = bg?.bigyeonCount ?? 0;
  const geobjaeCount = bg?.geobjaeCount ?? 0;

  return {
    pillars,
    dayGan,
    ohaengCount,
    ohaengDominant,
    ohaengMissing,
    sipseongCount,
    sipseongDominant,
    sinStrengthLevel,
    sinStrengthLabel,
    isStrong,
    daeun,
    seun,
    weolun,
    hapchung,
    chungCount,
    hapCount,
    sinsals,
    hasDohwa: dohwaArr.length > 0,
    hasHwagae: hwagaeArr.length > 0,
    hasHongyeom: hongyeomArr.length > 0,
    guiinCount,
    gyeokgukName,
    yongsinOhaeng,
    gisinOhaeng,
    bigyeonCount,
    geobjaeCount,
    hasTimePillar: pillars.some((p) => p.position === "hour"),
  };
}
