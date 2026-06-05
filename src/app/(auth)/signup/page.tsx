"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signupAction } from "./actions";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <div className="brandg-shop">
    <div className="container py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>BrandG 시작하기</CardTitle>
          <CardDescription>
            가입 후 담은 G 와 주문 내역이 계정에 저장됩니다.
            <br />
            게스트로도 진단·둘러보기·구매까지 가능합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 (8자 이상)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
              />
            </div>

            {/* 오류 메시지 */}
            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <Button type="submit" disabled={isPending} className="w-full bg-amber-500 text-white hover:bg-amber-600 font-bold">
              {isPending ? "가입 중..." : "가입하기"}
            </Button>
            <p className="text-sm text-center text-mute">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-ink underline underline-offset-4 hover:opacity-80">
                로그인
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-[12px] text-mute">
        가입 시{" "}
        <Link href="/legal/terms" className="underline underline-offset-4 hover:text-ink">이용약관</Link>
        과{" "}
        <Link href="/legal/privacy" className="underline underline-offset-4 hover:text-ink">개인정보처리방침</Link>
        에 동의한 것으로 간주됩니다.
      </p>
    </div>
    </div>
  );
}
