import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "sonner";
import { siteConfig, businessInfo } from "@/config/site";
import { isSupabaseConfigured } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth";
import { MobileMenu } from "@/components/layout/MobileMenu";
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

// 카테고리형 헤더 — 스토어프런트 라이트(아이보리) 톤, sticky.
// 아직 독립 페이지가 없는 카테고리는 /products 필터 또는 실제 상품으로 연결 (빈 페이지·404 금지).
const PRIMARY_NAV: { label: string; href: string }[] = [
  { label: "사주풀이", href: "/saju" },
  { label: "타로", href: "/tarot" },
  { label: "연애·궁합", href: "/products?tab=love" },
  { label: "재회", href: "/products?tab=reunion" },
  { label: "전체 상품", href: "/products" },
];

const SECONDARY_NAV: { label: string; href: string }[] = [
  { label: "종합운세", href: "/products/premium-saju" },
  { label: "돈·직장", href: "/products?tab=money" },
  { label: "오늘의 운세", href: "/products/tarot-daily" },
  { label: "자기이해", href: "/products?tab=self" },
  { label: "콘텐츠", href: "/contents" },
];

function SiteHeader({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <header className="sticky top-0 z-30 bg-sf-bg/95 backdrop-blur border-b border-sf-line">
      {/* 메인 줄 — 로고 · 주요 카테고리 · 로그인 · 무료 진단 */}
      <div className="container flex h-16 md:h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex flex-col leading-none shrink-0">
          <span className="font-extrabold text-[21px] md:text-[24px] text-sf-ink tracking-tight">
            {siteConfig.name}
          </span>
          <span className="mt-1 hidden md:block text-[11px] font-medium tracking-[0.14em] text-sf-amber-deep">
            {siteConfig.tagline}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[15px] font-bold text-sf-ink">
          {PRIMARY_NAV.map((c) => (
            <Link key={c.label} href={c.href} className="hover:text-sf-amber-deep transition-colors">
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5 text-[13.5px] font-medium shrink-0">
          {isLoggedIn ? (
            <>
              <Link href="/mypage" className="text-sf-body hover:text-sf-ink">마이페이지</Link>
              <form action="/api/auth/signout" method="post">
                <button type="submit" className="text-sf-body hover:text-sf-ink">로그아웃</button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-sf-body hover:text-sf-ink">로그인</Link>
          )}
          <Link
            href="/start"
            className="rounded-full bg-sf-amber text-sf-navy font-bold text-[14px] px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            무료 진단
          </Link>
        </div>

        {/* 모바일 — 무료 진단 + 햄버거 */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/start"
            className="rounded-full bg-sf-amber text-sf-navy font-bold text-[12.5px] px-3.5 py-1.5"
          >
            무료 진단
          </Link>
          <MobileMenu isLoggedIn={isLoggedIn} />
        </div>
      </div>

      {/* 보조 줄 — PC 전용 얇은 카테고리 */}
      <nav aria-label="보조 카테고리" className="hidden md:block border-t border-sf-line/70">
        <div className="container flex items-center gap-6 h-10 text-[13px] font-medium text-sf-body">
          {SECONDARY_NAV.map((c) => (
            <Link key={c.label} href={c.href} className="hover:text-sf-ink transition-colors">
              {c.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

// 푸터 — 네이비 섹션. 사업자·정책·고객센터 정보는 기존 값 유지.
function SiteFooter() {
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
    <footer className="bg-sf-navy border-t border-hairline">
      <div className="container py-10 text-xs space-y-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="font-bold text-[14px] text-ink mr-2">{siteConfig.name}</span>
          <Link href="/saju" className="text-body hover:text-ink">사주</Link>
          <Link href="/tarot" className="text-body hover:text-ink">타로</Link>
          <Link href="/products" className="text-body hover:text-ink">전체 상품</Link>
          <Link href="/contents" className="text-body hover:text-ink">콘텐츠</Link>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          <Link href="/legal/terms" className="text-body hover:text-ink">이용약관</Link>
          <Link href="/legal/privacy" className="text-body hover:text-ink">개인정보처리방침</Link>
          <Link href="/legal/refund-policy" className="text-body hover:text-ink">환불정책</Link>
        </div>
        <p className="text-mute leading-relaxed">{businessLine}</p>
        <p className="text-mute leading-relaxed">{contactLine}</p>
        <p className="text-mute">
          © {new Date().getFullYear()} {siteConfig.name} — 단정적 예언이 아니라, 반복 패턴을 읽어 선택을 돕습니다.
        </p>
      </div>
    </footer>
  );
}
