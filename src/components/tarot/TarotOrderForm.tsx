"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isBankTransferEnabled, bankTransfer } from "@/config/site";

type Props = {
  productSlug: string;
  source: string | null;
};

export function TarotOrderForm({ productSlug, source }: Props) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"toss" | "bank_transfer">("toss");
  const [depositorName, setDepositorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const bankEnabled = isBankTransferEnabled();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (paymentMethod === "bank_transfer" && !depositorName.trim()) {
      toast.error("입금자명을 입력해 주세요");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/readings/tarot/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          question: question.trim() || undefined,
          paymentMethod,
          depositorName: paymentMethod === "bank_transfer" ? depositorName.trim() : undefined,
          source: source ?? undefined,
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
        <Label htmlFor="question">질문 (선택)</Label>
        <Textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="예) 그 사람은 지금 저를 어떻게 생각하고 있을까요?"
          maxLength={300}
          rows={3}
        />
      </div>

      {bankEnabled && (
        <div className="space-y-2">
          <Label>결제 방법</Label>
          <div className="flex gap-2">
            {(
              [
                { key: "toss", label: "카드 결제" },
                { key: "bank_transfer", label: "무통장입금" },
              ] as const
            ).map((m) => (
              <button
                type="button"
                key={m.key}
                onClick={() => setPaymentMethod(m.key)}
                className={`flex-1 h-10 rounded-full border text-sm transition-colors ${
                  paymentMethod === m.key ? "border-ink bg-ink text-canvas" : "border-hairline text-ink hover:border-ink"
                }`}
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
                다음 화면의 계좌로 입금해 주시면, 입금 확인 후 보통 {bankTransfer.processingTime} 이내에 결과를 발행해
                드립니다.
              </p>
            </div>
          )}
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting
          ? "주문 생성 중..."
          : paymentMethod === "bank_transfer"
            ? "입금 안내 받기"
            : "결제하고 카드 뽑기"}
      </Button>
    </form>
  );
}
