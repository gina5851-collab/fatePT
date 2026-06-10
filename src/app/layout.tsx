import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "sonner";
import { siteConfig, businessInfo } from "@/config/site";
import { isSupabaseConfigured } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartIcon } from "@/components/cart/CartIcon";
import { Analytics } from "@/components/analytics/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    locale: "ko_KR",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 로그인 여부에 따라 헤더 메뉴 분기. Supabase 미설정(데모) 모드면 무조건 비로그인 취급.
  const isLoggedIn = isSupabaseConfigured() ? !!(await getCurrentUser()) : false;

  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <Analytics />
        <SiteHeader isLoggedIn={isLoggedIn} />
        <main className="min-h-[calc(100vh-7rem)]">{children}</main>
        <SiteFooter />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

// 뉴트럴 톤 헤더 — BrandG 크림 본문과 자연스럽게 밸런스.
// 텍스트는 따뜻한 다크 (#2A2A24), 배경은 살짝 따뜻한 크림 (#FBF8EE).
function SiteHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header
      className="border-b sticky top-0 z-30"
      style={{ backgroundColor: "#FBF8EE", borderColor: "#E8DFC9", color: "#2A2A24" }}
    >
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold text-[15px]" style={{ color: "#2A2A24" }}>
          {siteConfig.name}
        </Link>

        {/* 데스크톱 네비 */}
        <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium" style={{ color: "#2A2A24" }}>
          <Link href="/categories" className="hover:opacity-70">카테고리</Link>
          <Link href="/products" className="hover:opacity-70">상품</Link>
          {isLoggedIn ? (
            <>
              <Link href="/mypage" className="hover:opacity-70">마이페이지</Link>
              <form action="/api/auth/signout" method="post">
                <button type="submit" className="hover:opacity-70">로그아웃</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="hover:opacity-70">로그인</Link>
          )}
          <Link
            href="/start"
            className="rounded-full px-3.5 py-1.5 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#2A2A24", color: "#FBF8EE" }}
          >
            내 G 찾기
          </Link>
          <CartIcon />
        </nav>

        {/* 모바일: 장바구니 아이콘 + 햄버거 */}
        <div className="flex items-center md:hidden">
          <CartIcon />
          <MobileMenu isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}

// Ollama: footer is a quiet caption-gray strip with hairline divider.
function SiteFooter() {
  // 사업자정보 한 줄 — 운세위키 푸터 포맷: "회사 | 사업자등록번호: ... | 통신판매업 신고번호: ... | 대표: ... | 주소: ..."
  const businessLine = [
    businessInfo.companyName,
    `사업자등록번호: ${businessInfo.businessNumber}`,
    businessInfo.mailOrderNumber ? `통신판매업 신고번호: ${businessInfo.mailOrderNumber}` : null,
    `대표: ${businessInfo.representative}`,
    `주소: ${businessInfo.address}`,
  ].filter(Boolean).join(" | ");

  const contactLine = [
    `고객센터: 010-4868-8244`,
    businessInfo.phone
      ? `전화${businessInfo.phoneNote ? `(${businessInfo.phoneNote})` : ""}: ${businessInfo.phone}`
      : null,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <footer className="border-t border-hairline mt-20">
      <div className="container py-10 text-xs text-body space-y-4">
        <div className="grid grid-cols-2 gap-y-2 gap-x-6 sm:flex sm:flex-wrap sm:gap-x-5 sm:gap-y-1.5">
          <Link href="/about" className="hover:text-ink">BrandG 소개</Link>
          <Link href="/help" className="hover:text-ink">고객센터</Link>
          <Link href="/faq" className="hover:text-ink">자주 묻는 질문</Link>
          <Link href="/legal/terms" className="hover:text-ink">이용약관</Link>
          <Link href="/legal/privacy" className="hover:text-ink">개인정보처리방침</Link>
          <Link href="/legal/refund-policy" className="hover:text-ink">환불정책</Link>
        </div>
        <p className="text-mute leading-relaxed">{businessLine}</p>
        <p className="text-mute leading-relaxed">{contactLine}</p>
        <p className="text-mute">© {new Date().getFullYear()} {siteConfig.name}</p>
      </div>
    </footer>
  );
}
