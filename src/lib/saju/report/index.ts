// 운명PT 리포트 엔진 — 공개 API
// 사용처: const report = buildDunmyeongReport(await fetchSajuAnalysis(birthInfo, []));
export { buildDunmyeongReport, SINSAL_COPY, sinsalCopy, REUNION_CS_SCRIPT } from "./report";
export { normalizeSaju } from "./adapter";
export { computeMetrics } from "./metrics";
export { buildItems } from "./items";
export { buildPersona } from "./persona";
export type { PersonaProfile } from "./persona";
export { readMbti, isMbti, MBTI_LIST } from "./mbti";
export type { MbtiType, MbtiReading } from "./mbti";
export { getDisplayName, formatName, resolveName } from "./name";
export type {
  DunmyeongReport,
  NormalizedSaju,
  Metric,
  MetricKey,
  ReportItem,
  ReportItemCategory,
  CtaCopy,
} from "./types";
