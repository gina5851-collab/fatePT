// 결과 페이지 프리뷰용 데모 리포트 (실 DB 없이 UI 확인)
import type { SajuAnalysisResponse } from "@/lib/saju/saju-api";
import { buildDunmyeongReport } from "./report";
import type { DunmyeongReport } from "./types";

const DEMO_ANALYSIS: SajuAnalysisResponse = {
  ganji: {
    year: { gan: "경", ji: "오", ganHanja: "庚", jiHanja: "午" },
    month: { gan: "신", ji: "사", ganHanja: "辛", jiHanja: "巳" },
    day: { gan: "갑", ji: "자", ganHanja: "甲", jiHanja: "子" },
    hour: { gan: "신", ji: "미", ganHanja: "辛", jiHanja: "未" },
  },
  sipseong: { summary: { bigyeop: 3, siksang: 0, jaeseong: 1, gwanseong: 2, inseong: 2 } },
  sinStrength: { level: 5, strength: "신강", isStrong: true },
  daeun: {
    direction: "순행", current_age: 36,
    current_daeun: { gan: "을", ganji: "을유", age_start: 33, age_end: 42, sipseong: { ganCategory: "비겁성" }, wongukInteraction: { hapChungRelations: [{ type: "충" }] } },
  },
  seun: { currentSeun: { year: 2026, gan: "병", ganji: "병오", sipseongRelation: { gan: "식신" }, hapChungRelations: [{ type: "충" }] } },
  weolun: { currentWeolun: { monthLabel: "2026년 3월" } },
  hapchung: [{ type: "지지충", source: "자", target: "오" }, { type: "천간합", source: "갑", target: "기" }],
  sibisinsals: { sibisinsals: [{ name: "역마살", ji: "오" }, { name: "화개살", ji: "미" }] },
  dohwa: { dohwa: [{ name: "도화살", ji: "오" }] },
  guiin: { cheoneul: [{}] },
  gyeokguk: { name: "정관격", yongsin: { 오행: "수" }, 기신오행: "화" },
  bigyeonGeobjae: { bigyeonCount: 1, geobjaeCount: 2 },
} as unknown as SajuAnalysisResponse;

// 데모 사용자 — 결과 페이지 프리뷰용 샘플. 실제 서비스에는 사용되지 않음.
export const demoUser = {
  name: "서연",
  gender: "female" as const,
  birthYear: "1990",
  birthMonth: "5",
  birthDay: "15",
};

export function demoReport(): DunmyeongReport {
  return buildDunmyeongReport(DEMO_ANALYSIS);
}
