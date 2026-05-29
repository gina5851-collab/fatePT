import { ReportView } from "@/components/report/ReportView";
import { demoReport } from "@/lib/saju/report/demo";

export const metadata = { title: "결과 미리보기 (데모)" };

// 프리뷰 전용 — 실 DB 없이 전환형 결과 페이지를 확인하기 위한 데모 라우트.
export default function ResultDemoPage() {
  return <ReportView name="진아" report={demoReport()} />;
}
