"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { isBankTransferEnabled, bankTransfer } from "@/config/site";

type Props = {
  productId: string;
  productSlug: string;
  isLoggedIn: boolean;
  isFree?: boolean;
};

const CONCERN_OPTIONS = ["연애", "결혼", "직장", "재물", "건강", "학업", "이직", "사업"];

export function SajuForm({ productId, productSlug, isLoggedIn, isFree = false }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [calendar, setCalendar] = useState<"solar" | "lunar">("solar");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"toss" | "bank_transfer">("toss");
  const [depositorName, setDepositorName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const bankEnabled = isBankTransferEnabled();

  function toggleConcern(c: string) {
    setConcerns((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthDate) {
      toast.error("생년월일을 입력해 주세요");
      return;
    }
    if (!isFree && paymentMethod === "bank_transfer" && !depositorName.trim()) {
      toast.error("입금자명을 입력해 주세요");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name,
        birthDate,
        birthTime: timeUnknown ? null : birthTime || null,
        timeUnknown,
        gender,
        calendar,
        concerns,
      };

      // 무료 키트 — 결제 없이 바로 생성 후 결과지로
      if (isFree) {
        const res = await fetch("/api/free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "무료 진단 생성 실패");
        router.push(`/results/${json.resultId}`);
        return;
      }

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          ...payload,
          paymentMethod,
          depositorName: paymentMethod === "bank_transfer" ? depositorName.trim() : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "주문 생성 실패");
      router.push(`/checkout/${json.orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "오류가 발생했습니다");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">이름 (선택)</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate">생년월일</Label>
          <Input id="birthDate" type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthTime">출생 시각</Label>
          <Input
            id="birthTime"
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            disabled={timeUnknown}
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={timeUnknown} onChange={(e) => setTimeUnknown(e.target.checked)} />
            시 모름
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>성별</Label>
          <div className="flex gap-2">
            {(["male", "female"] as const).map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 h-10 rounded-full border text-sm transition-colors ${gender === g ? "border-ink bg-ink text-canvas" : "border-hairline text-ink hover:border-ink"}`}
              >
                {g === "male" ? "남성" : "여성"}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>달력</Label>
          <div className="flex gap-2">
            {(["solar", "lunar"] as const).map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCalendar(c)}
                className={`flex-1 h-10 rounded-full border text-sm transition-colors ${calendar === c ? "border-ink bg-ink text-canvas" : "border-hairline text-ink hover:border-ink"}`}
              >
                {c === "solar" ? "양력" : "음력"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>고민 (복수 선택)</Label>
        <div className="flex flex-wrap gap-2">
          {CONCERN_OPTIONS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => toggleConcern(c)}
              className={`px-4 h-8 rounded-full border text-sm transition-colors ${concerns.includes(c) ? "border-ink bg-ink text-canvas" : "border-hairline text-ink hover:border-ink"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {!isFree && bankEnabled && (
        <div className="space-y-2">
          <Label>결제 방법</Label>
          <div className="flex gap-2">
            {([
              { key: "toss", label: "카드 결제" },
              { key: "bank_transfer", label: "무통장입금" },
            ] as const).map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setPaymentMethod(m.key)}
                className={`flex-1 h-10 rounded-full border text-sm transition-colors ${paymentMethod === m.key ? "border-ink bg-ink text-canvas" : "border-hairline text-ink hover:border-ink"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
          {paymentMethod === "bank_transfer" && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="depositorName">입금자명</Label>
              <Input
                id="depositorName"
                value={depositorName}
                onChange={(e) => setDepositorName(e.target.value)}
                placeholder="실제 입금하실 분 성함"
              />
              <p className="text-xs text-body">
                다음 화면의 계좌로 입금해 주시면, 입금 확인 후 보통 {bankTransfer.processingTime} 이내에 결과지를 보내드립니다.
              </p>
            </div>
          )}
        </div>
      )}

      {isLoggedIn ? (
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting
            ? isFree ? "진단 중..." : "주문 생성 중..."
            : isFree ? "무료로 진단받기" : paymentMethod === "bank_transfer" ? "입금 안내 받기" : "결제하러 가기"}
        </Button>
      ) : (
        <div className="space-y-2">
          <Link
            href={`/login?redirect=${encodeURIComponent(`/products/${productSlug}`)}`}
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            {isFree ? "로그인하고 무료로 받기" : "로그인하고 결제하기"}
          </Link>
          <p className="text-xs text-body text-center">
            결과는 로그인 후 <span className="text-ink">마이페이지</span> 에서 확인할 수 있어요.
          </p>
        </div>
      )}
    </form>
  );
}
