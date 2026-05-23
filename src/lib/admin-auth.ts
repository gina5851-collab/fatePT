// =====================================================
// 어드민 인증 — .env 의 ADMIN_PASSWORD 기반 단일 비밀번호 게이트
// =====================================================
// 강의용 단순화: 회원/권한 모델 없이 .env 의 비밀번호 1개로 /admin 보호.
// 로그인 시 비밀번호를 httpOnly 쿠키에 저장하고, 매 요청 동등 비교.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverEnv } from "@/lib/env";

const COOKIE_NAME = "admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7일

export function isAdminConfigured(): boolean {
  return serverEnv().ADMIN_PASSWORD.length > 0;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = serverEnv().ADMIN_PASSWORD;
  if (!expected) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return !!token && token === expected;
}

// 어드민 페이지의 상단에서 호출 — 미인증이면 /admin/login 으로 리다이렉트
export async function requireAdminPassword(redirectFrom: string) {
  if (!isAdminConfigured()) {
    redirect(`/admin/login?from=${encodeURIComponent(redirectFrom)}&unconfigured=1`);
  }
  if (!(await isAdminAuthenticated())) {
    redirect(`/admin/login?from=${encodeURIComponent(redirectFrom)}`);
  }
}

export async function setAdminCookie(password: string): Promise<boolean> {
  const expected = serverEnv().ADMIN_PASSWORD;
  if (!expected || password !== expected) return false;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
  return true;
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
