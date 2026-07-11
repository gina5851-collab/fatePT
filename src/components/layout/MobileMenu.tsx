"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { isLoggedIn: boolean };

const CATEGORY_ITEMS: { label: string; href: string }[] = [
  { label: "사주풀이", href: "/saju" },
  { label: "연애·궁합", href: "/products?tab=love" },
  { label: "재회", href: "/products?tab=reunion" },
  { label: "돈·직장", href: "/products?tab=money" },
  { label: "종합운세", href: "/products/premium-saju" },
  { label: "타로", href: "/tarot" },
  { label: "오늘의 운세", href: "/products/tarot-one-card" },
  { label: "전체 상품", href: "/products" },
];

export function MobileMenu({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // 페이지 이동 시 메뉴 닫기
  useEffect(() => { setOpen(false); }, [pathname]);

  // 열렸을 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* 햄버거 버튼 — 모바일만 표시 */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-md hover:bg-sf-panel-soft transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
      >
        <span className={`block w-5 h-[1.5px] bg-sf-ink transition-all duration-200 ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
        <span className={`block w-5 h-[1.5px] bg-sf-ink transition-all duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-[1.5px] bg-sf-ink transition-all duration-200 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
      </button>

      {/* 모바일 드로어 */}
      {open && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="md:hidden fixed inset-0 top-14 bg-black/25 z-40"
            onClick={() => setOpen(false)}
          />
          {/* 메뉴 패널 */}
          <nav className="md:hidden fixed top-14 left-0 right-0 max-h-[calc(100vh-3.5rem)] overflow-y-auto bg-sf-bg border-b border-sf-line z-50 px-5 py-4">
            <Link
              href="/start"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-sf-amber text-sf-navy text-center font-bold py-3 mb-3"
            >
              ✨ 1분 무료 진단
            </Link>

            <p className="pt-2 pb-1 text-[11px] font-mono text-sf-mute">CATEGORY</p>
            {CATEGORY_ITEMS.map((item) => (
              <MobileLink key={item.label} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </MobileLink>
            ))}

            <p className="pt-4 pb-1 text-[11px] font-mono text-sf-mute">MY</p>
            <MobileLink href="/contents" onClick={() => setOpen(false)}>콘텐츠</MobileLink>
            {isLoggedIn ? (
              <>
                <MobileLink href="/mypage" onClick={() => setOpen(false)}>마이페이지</MobileLink>
                <form action="/api/auth/signout" method="post">
                  <button
                    type="submit"
                    className="w-full text-left py-3 text-[15px] text-sf-body border-t border-sf-line"
                  >
                    로그아웃
                  </button>
                </form>
              </>
            ) : (
              <MobileLink href="/login" onClick={() => setOpen(false)}>로그인</MobileLink>
            )}
          </nav>
        </>
      )}
    </>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-3 text-[15px] font-medium text-sf-ink border-t border-sf-line first:border-t-0"
    >
      {children}
    </Link>
  );
}
