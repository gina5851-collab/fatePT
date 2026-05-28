// =====================================================
// 사이트 메타 / 사업자 정보
// =====================================================

export const siteConfig = {
  name: "운명PT",
  tagline: "왜 나는 같은 선택을 반복할까?",
  description: "생년월일 기반 AI 리포트로 내 관계·돈·선택의 패턴을 정리합니다. 단정적인 운세가 아닌, 오늘을 더 선명하게 살아가기 위한 자기이해 리포트입니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "gina5851@gmail.com",
};

// 무통장입금(계좌이체) 설정 — 토스 PG 심사 통과 전 임시 결제 수단.
// accountNumber 를 채우면 활성화됩니다. 비워두면 체크아웃에 무통장입금 옵션이 숨겨집니다.
export const bankTransfer = {
  bankName: "신한은행",
  accountNumber: "110-387-832895",
  accountHolder: "장진아",
};

export function isBankTransferEnabled(): boolean {
  return bankTransfer.accountNumber.trim().length > 0;
}

// 통신판매업 / 사업자 정보 — 법적 페이지 및 푸터에 노출됩니다.
export const businessInfo = {
  companyName: "브랜드지",
  representative: "장진아",
  businessNumber: "309-47-01110",
  mailOrderNumber: "", // 통신판매업 신고 후 입력
  address: "경기도 김포시 김포한강9로75번길22, 804-C038",
  phone: "", // 표기 안 함
  phoneNote: "",
  email: "gina5851@gmail.com",
  privacyOfficer: "장진아",
  // 호스팅 / 주요 처리 위탁 업체 — 개인정보처리방침에 노출
  hostingProvider: "Vercel Inc.",
  // 시행일 — 약관 / 개인정보처리방침 / 환불정책에 공통 노출
  effectiveDate: "2026-05-25",
};
