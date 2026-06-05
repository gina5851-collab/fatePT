// =====================================================
// 사이트 메타 / 사업자 정보
// =====================================================

export const siteConfig = {
  name: "BrandG",
  tagline: "뭐가 필요하G?",
  description: "BrandG는 40+ 자기관리 편집샵입니다. Good Life를 위한 동안이G·건강이G·힐링이G·가벼워지G·편안하G 5개 카테고리 큐레이션과 내 G 찾기 진단 + 심층 G 리포트를 함께 제공합니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "gina5851@gmail.com",
};

// 무통장입금(계좌이체) 설정 — 토스 PG 심사 통과 전 임시 결제 수단.
// accountNumber 를 채우면 활성화됩니다. 비워두면 체크아웃에 무통장입금 옵션이 숨겨집니다.
export const bankTransfer = {
  enabled: true, // 무통장입금 켜기/끄기 스위치. false 로 바꾸면 결제창에서 숨겨집니다.
  bankName: "신한은행",
  accountNumber: "110-387-832895",
  accountHolder: "장진아",
  processingTime: "24시간", // 입금 확인 후 결과 발송까지 안내 시간. 손님 화면에 노출됩니다.
};

export function isBankTransferEnabled(): boolean {
  return bankTransfer.enabled && bankTransfer.accountNumber.trim().length > 0;
}

// 통신판매업 / 사업자 정보 — 법적 페이지 및 푸터에 노출됩니다.
export const businessInfo = {
  companyName: "브랜드지",
  representative: "장진아",
  businessNumber: "309-47-01110",
  mailOrderNumber: "2026-경기김포-0764", // 통신판매업 신고번호
  address: "경기도 김포시 김포한강9로75번길22, 804-C038",
  phone: "", // 미표기 (이메일 고객센터로 대체). 필요 시 안심번호(050)/카카오채널 권장
  phoneNote: "",
  email: "gina5851@gmail.com",
  privacyOfficer: "장진아",
  // 호스팅 / 주요 처리 위탁 업체 — 개인정보처리방침에 노출
  hostingProvider: "Vercel Inc.",
  // 시행일 — 약관 / 개인정보처리방침 / 환불정책에 공통 노출
  effectiveDate: "2026-05-25",
};
