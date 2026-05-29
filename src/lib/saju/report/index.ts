// 운명PT 리포트 엔진 — 공개 API
// 사용처: const report = buildDunmyeongReport(await fetchSajuAnalysis(birthInfo, []));
export { buildDunmyeongReport } from "./report";
export { normalizeSaju } from "./adapter";
export { computeMetrics } from "./metrics";
export type {
  DunmyeongReport,
  NormalizedSaju,
  Metric,
  MetricKey,
  ReportItem,
  ReportItemCategory,
  CtaCopy,
} from "./types";
