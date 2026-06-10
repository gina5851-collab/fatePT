"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { isLoggedIn: boolean };

// 헤더 뉴트럴 톤 매칭 — 햄버거 라인 / 드로어 / 텍스트 모두 #2A2A24 + cream bg.
const INK = "#2A2A24";
const CREAM = "#FBF8EE";
const BORDER = "#E8DFC9";

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
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-md transition-colors hover:bg-black/5"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
      >
        <span style={{ backgroundColor: INK }} className={`block w-5 h-[1.5px] transition-all duration-200 ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
        <span style={{ backgroundColor: INK }} className={`block w-5 h-[1.5px] transition-all duration-200 ${open ? "opacity-0" : ""}`} />
        <span style={{ backgroundColor: INK }} className={`block w-5 h-[1.5px] transition-all duration-200 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
      </button>

      {/* 모바일 드로어 */}
      {open && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="md:hidden fixed inset-0 top-14 bg-black/30 z-40"
            onClick={() => setOpen(false)}
          />
          {/* 메뉴 패널 */}
          <nav
            className="md:hidden fixed top-14 left-0 right-0 border-b z-50 px-5 py-4 space-y-0"
            style={{ backgroundColor: CREAM, borderColor: BORDER }}
          >
            <MobileLink href="/start" onClick={() => setOpen(false)}>
              ✨ 내 G 찾기
            </MobileLink>
            <MobileLink href="/categories" onClick={() => setOpen(false)}>
              카테고리
            </MobileLink>
            <MobileLink href="/products" onClick={() => setOpen(false)}>
              상품
            </MobileLink>
            <MobileLink href="/cart" onClick={() => setOpen(false)}>
              장바구니
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
                      className="w-full text-left py-3.5 text-[15px] border-t"
                      style={{ color: INK, borderColor: BORDER, opacity: 0.7 }}
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
      className="block py-3.5 text-[15px] font-medium border-t first:border-t-0"
      style={{ color: INK, borderColor: BORDER }}
    >
      {children}
    </Link>
  );
}
