"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { isLoggedIn: boolean };

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
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-md hover:bg-surface-soft transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
      >
        <span className={`block w-5 h-[1.5px] bg-ink transition-all duration-200 ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
        <span className={`block w-5 h-[1.5px] bg-ink transition-all duration-200 ${open ? "opacity-0" : ""}`} />
        <span className={`block w-5 h-[1.5px] bg-ink transition-all duration-200 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
      </button>

      {/* 모바일 드로어 */}
      {open && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="md:hidden fixed inset-0 top-14 bg-black/20 z-40"
            onClick={() => setOpen(false)}
          />
          {/* 메뉴 패널 */}
          <nav className="md:hidden fixed top-14 left-0 right-0 bg-canvas border-b border-hairline z-50 px-5 py-4 space-y-0">
            <MobileLink href="/start" onClick={() => setOpen(false)}>
              ✨ 무료 진단
            </MobileLink>
            <MobileLink href="/contents" onClick={() => setOpen(false)}>
              콘텐츠
            </MobileLink>
            <MobileLink href="/products" onClick={() => setOpen(false)}>
              프로그램
            </MobileLink>
            {isLoggedIn ? (
              <>
                <MobileLink href="/mypage" onClick={() => setOpen(false)}>
                  마이페이지
                </MobileLink>
                <div className="pt-1 pb-1">
                  <form action="/api/auth/signout" method="post">
                    <button
                      type="submit"
                      className="w-full text-left py-3.5 text-[15px] text-body border-t border-hairline"
                    >
                      로그아웃
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <MobileLink href="/login" onClick={() => setOpen(false)}>
                로그인
              </MobileLink>
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
      className="block py-3.5 text-[15px] font-medium text-ink border-t border-hairline first:border-t-0"
    >
      {children}
    </Link>
  );
}
