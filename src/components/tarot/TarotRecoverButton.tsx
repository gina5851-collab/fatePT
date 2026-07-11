"use client";

import { useState } from "react";

// 결제 완료된 본인 타로 주문의 결과 복구 버튼.
// 성공하면 서버가 준 resultUrl 로 이동한다. 실패해도 재결제를 유도하지 않는다.
export function TarotRecoverButton({
  orderId,
  publicToken,
  label = "결과 복구하기",
}: {
  orderId?: string;
  publicToken?: string;
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function recover() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/readings/tarot/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderId ? { orderId } : { publicToken }),
      });
      const json = await res.json();
      if (res.ok && json.readingStatus === "generating") {
        setMessage("결과를 생성하는 중입니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      if (!res.ok) throw new Error(json.error ?? "결과 복구에 실패했습니다.");
      if (json.resultUrl) {
        window.location.href = json.resultUrl;
        return;
      }
      throw new Error("결과 주소를 받지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "결과 복구에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={recover}
        disabled={loading}
        className="text-sm font-medium underline underline-offset-4 text-ink disabled:opacity-50"
      >
        {loading ? "결과 생성 중..." : message ? "다시 시도" : label}
      </button>
      {message && <span className="text-xs text-body text-right max-w-[220px]">{message}</span>}
    </span>
  );
}
