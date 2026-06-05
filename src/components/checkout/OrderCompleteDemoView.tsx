"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getLastOrder, type LastOrder } from "@/lib/cart/lastOrder";
import { formatKRW } from "@/lib/utils";
import { findMockProduct } from "@/config/products.mock";

export function OrderCompleteDemoView() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setOrder(getLastOrder());
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p className="text-center py-20 text-mute text-sm">불러오는 중...</p>;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-[14px] text-body mb-1">주문 정보를 찾지 못했어요.</p>
        <p className="text-[12px] text-mute mb-6">주문서에서 다시 시작해 주세요.</p>
        <Link
          href="/products"
          className="inline-flex rounded-xl bg-amber-500 text-white px-5 py-3 text-[13px] font-bold hover:bg-amber-600 transition-colors shadow-sm"
        >
          상품 둘러보기 →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 성공 헤더 */}
      <div className="text-center py-8">
        <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center" aria-hidden>
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="mt-4 text-[11px] font-mono tracking-[0.3em] text-mute">ORDER PLACED (DEMO)</p>
        <h2 className="mt-1 text-[22px] font-bold text-ink">
          {order.customerName ? `${order.customerName}님 주문이 완료됐어요` : "주문이 완료됐어요"}
        </h2>
        <p className="mt-1 text-[12px] text-mute">실제 결제는 호출되지 않았습니다 (데모).</p>
      </div>

      {/* 주문 정보 */}
      <section className="mb-5 rounded-2xl border border-hairline bg-surface-soft p-5">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[11px] font-mono text-mute">주문번호</span>
          <span className="text-[13px] font-mono font-bold text-ink">{order.orderId}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-mono text-mute">주문일시</span>
          <span className="text-[12px] text-body">
            {new Date(order.createdAt).toLocaleString("ko-KR", {
              year: "numeric", month: "2-digit", day: "2-digit",
              hour: "2-digit", minute: "2-digit",
            })}
          </span>
        </div>
      </section>

      {/* 주문 상품 */}
      <section className="mb-5">
        <p className="text-[12px] font-semibold text-ink mb-3">주문 상품 ({order.items.length}건)</p>
        <ul className="rounded-2xl border border-hairline divide-y divide-hairline bg-canvas">
          {order.items.map((it) => {
            const product = findMockProduct(it.slug);
            return (
              <li key={it.slug} className="flex gap-3 p-4">
                <div className="relative shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-surface-soft">
                  {product?.imageUrl ? (
                    <Image src={product.imageUrl} alt={it.name} fill sizes="64px" className="object-cover" />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-b ${it.gradient}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-mute">{it.brand}</p>
                  <p className="text-[13px] font-medium text-ink leading-snug line-clamp-2">{it.name}</p>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-[11px] text-mute">{formatKRW(it.price)} × {it.qty}개</span>
                    <span className="text-[13px] font-mono font-semibold text-ink">{formatKRW(it.price * it.qty)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 결제 요약 */}
      <section className="mb-6 rounded-2xl border border-hairline bg-surface-soft p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] text-body">총 결제 금액</span>
          <span className="text-[20px] font-bold font-mono text-ink">{formatKRW(order.total)}</span>
        </div>
        <p className="text-[11px] text-mute">* 결제 기능은 추후 연결됩니다. 위 금액은 데모 표시입니다.</p>
      </section>

      {/* 다음 액션 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
        <Link
          href="/products"
          className="rounded-xl bg-amber-500 text-white py-3.5 text-center text-[13px] font-bold hover:bg-amber-600 transition-colors shadow-sm"
        >
          쇼핑 계속하기
        </Link>
        <Link
          href="/start"
          className="rounded-xl border border-hairline bg-canvas py-3.5 text-center text-[13px] font-semibold text-ink hover:border-ink transition-colors"
        >
          내 G 다시 찾기
        </Link>
      </section>

      <p className="text-center text-[12px] text-mute">
        궁금한 점이 있으면 — {" "}
        <a href="mailto:gina5851@gmail.com" className="text-ink underline underline-offset-4 hover:text-body">
          고객센터로 문의
        </a>
      </p>
    </div>
  );
}
