import { ReportView } from "@/components/report/ReportView";
import { demoReport, demoUser } from "@/lib/saju/report/demo";

export const metadata = { title: "결과 미리보기 (데모)" };

// 프리뷰 전용 — 실 DB 없이 전환형 결과 페이지를 확인하기 위한 데모 라우트.
// 데모 이름은 demoUser 안에서만 관리(실제 결과 페이지는 DB/입력 이름 사용).
export default function ResultDemoPage() {
  return <ReportView name={demoUser.name} report={demoReport()} />;
}
