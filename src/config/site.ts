// =====================================================
// 사이트 메타 / 사업자 정보
// =====================================================
// 운영 전 본인 정보로 반드시 교체하세요. 아래는 모두 더미 데이터입니다.

export const siteConfig = {
  name: "오늘의 사주",
  tagline: "왜 나는 같은 선택을 반복할까?",
  description: "생년월일 기반 AI 리포트로 내 관계·돈·선택의 패턴을 정리합니다. 단정적인 운세가 아닌, 오늘을 더 선명하게 살아가기 위한 자기이해 리포트입니다.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "support@example.com",
};

// 통신판매업 / 사업자 정보 — 법적 페이지 및 푸터에 노출됩니다.
// ※ 아래 값은 모두 더미입니다. 운영 전 본인 사업자 정보로 반드시 교체하세요.
export const businessInfo = {
  companyName: "(예시) 회사명",
  representative: "(예시) 홍길동",
  businessNumber: "000-00-00000",
  mailOrderNumber: "0000-지역-0000",
  address: "(예시) 서울특별시 OO구 OO로 OO, OO호",
  phone: "010-0000-0000",
  phoneNote: "문자만", // 비우면 푸터에서 부가표시 없이 노출
  email: "support@example.com",
  privacyOfficer: "(예시) 홍길동",
  // 호스팅 / 주요 처리 위탁 업체 — 개인정보처리방침에 노출
  hostingProvider: "Vercel Inc.",
  // 시행일 — 약관 / 개인정보처리방침 / 환불정책에 공통 노출
  effectiveDate: "2026-01-01",
};
