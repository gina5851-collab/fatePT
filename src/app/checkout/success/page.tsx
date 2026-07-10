"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SuccessState = "loading" | "ok" | "error" | "pending";

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccessInner />
    </Suspense>
  );
}

function CheckoutSuccessInner() {
  const router = useRouter();
  const search = useSearchParams();
  const [state, setState] = useState<SuccessState>("loading");
  const [message, setMessage] = useState("결제 승인 중...");

  useEffect(() => {
    const paymentKey = search.get("paymentKey");
    const orderId = search.get("orderId");
    const amount = Number(search.get("amount"));
    if (!paymentKey || !orderId || !amount) {
      setState("error");
      setMessage("필수 파라미터가 누락되었습니다.");
      return;
    }

    // 90초 안에 응답 없으면 abort — 결과 생성 지연 안내 (결제 자체는 이미 성공일 수 있음).
    // confirm 비즈니스 로직은 그대로, 클라이언트 fail-safe 만 추가.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90_000);

    (async () => {
      try {
        const res = await fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentKey, orderId, amount }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "결제 승인 실패");
        if (json.publicToken) {
          // 타로 등 리딩 서비스 — 안전 토큰으로 결과 페이지 이동
          // (review 상품이면 결과 페이지가 '검수 중' 상태를 안내)
          router.replace(`/tarot/result/${json.publicToken}`);
        } else if (json.resultId) {
          router.replace(`/results/${json.resultId}`);
        } else {
          setState("ok");
          setMessage("결제는 완료되었으나 결과 생성에 실패했습니다. 고객센터로 문의해 주세요.");
        }
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof DOMException && err.name === "AbortError") {
          // 클라이언트 90초 timeout — 결제는 거의 확실히 완료, 결과 생성만 지연.
          setState("pending");
          setMessage(
            "결제는 완료되었으나 결과 생성이 지연되고 있습니다. 잠시 후 결과 페이지 또는 주문내역을 확인해주세요."
          );
        } else {
          setState("error");
          setMessage(err instanceof Error ? err.message : "결제 승인 중 오류가 발생했습니다.");
        }
      }
    })();

    return () => clearTimeout(timeoutId);
  }, [router, search]);

  return (
    <div className="container py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>
            {state === "error"
              ? "결제 처리 실패"
              : state === "pending"
                ? "결제 완료 · 결과 생성 중"
                : "결제 완료"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        {state !== "loading" && (
          <CardContent className="space-y-2">
            {state === "pending" && (
              <>
                <Link href="/mypage/orders" className={cn(buttonVariants(), "w-full")}>
                  주문내역에서 결과 확인 →
                </Link>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  다시 확인하기
                </button>
              </>
            )}
            <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              홈으로
            </Link>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
