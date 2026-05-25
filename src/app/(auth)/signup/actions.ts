"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type SignupState = { error?: string } | null;

export async function signupAction(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!name || !email || !password) {
    return { error: "모든 항목을 입력해 주세요." };
  }
  if (password.length < 8) {
    return { error: "비밀번호는 8자 이상이어야 합니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name }, // 서버에서 처리 → 브라우저 헤더 제한 없음
    },
  });

  if (error) {
    // 이미 가입된 이메일 등 주요 메시지 한국어 변환
    const msg: Record<string, string> = {
      "User already registered": "이미 가입된 이메일입니다. 로그인해 주세요.",
      "Invalid email": "이메일 형식이 올바르지 않습니다.",
      "Password should be at least 6 characters": "비밀번호는 6자 이상이어야 합니다.",
    };
    return { error: msg[error.message] ?? error.message };
  }

  redirect("/mypage");
}
