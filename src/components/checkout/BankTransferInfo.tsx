"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatKRW } from "@/lib/utils";

type Props = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  orderId: string;
  depositorName: string | null;
};

export function BankTransferInfo({
  bankName,
  accountNumber,
  accountHolder,
  amount,
  orderId,
  depositorName,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(accountNumber.replace(/[\s-]/g, ""));
      setCopied(true);
      toast.success("계좌번호를 복사했어요");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했어요. 직접 입력해 주세요.");
    }
  }

  const rows: { label: string; value: string }[] = [
    { label: "은행", value: bankName },
    { label: "예금주", value: accountHolder },
    { label: "입금액", value: formatKRW(amount) },
  ];
  if (depositorName) rows.push({ label: "입금자명", value: depositorName });

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-hairline divide-y divide-hairline">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-mute">계좌번호</span>
          <button
            type="button"
            onClick={copyAccount}
            className="flex items-center gap-2 text-sm font-semibold text-ink underline underline-offset-4"
          >
            {accountNumber}
            <span className="text-xs text-body">{copied ? "복사됨" : "복사"}</span>
          </button>
        </div>
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-mute">{r.label}</span>
            <span className="text-sm font-medium text-ink">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-surface-soft p-4 text-xs leading-relaxed text-body space-y-1">
        <p>· 위 계좌로 <span className="font-semibold text-ink">{formatKRW(amount)}</span>을 입금해 주세요.</p>
        <p>· 입금자명이 다르면 확인이 늦어질 수 있어요{depositorName ? ` (입력하신 입금자명: ${depositorName})` : ""}.</p>
        <p>· 입금 확인 후 결과지를 생성해 드리며, <span className="font-semibold text-ink">마이페이지</span>에서 확인하실 수 있어요.</p>
        <p className="font-mono text-[11px] text-mute pt-1">주문번호: {orderId}</p>
      </div>

      <Link href="/mypage/orders" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
        입금했어요 · 마이페이지로
      </Link>
    </div>
  );
}
