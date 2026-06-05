"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart/useCart";
import { cartTotal, cartCount, clearCart } from "@/lib/cart/storage";
import { saveLastOrder, generateOrderId, type LastOrder } from "@/lib/cart/lastOrder";
import { formatKRW } from "@/lib/utils";
import { findMockProduct } from "@/config/products.mock";

// /checkout-demo — 배송정보 + 주문요약 + "주문 완료(데모)" 버튼.
// 실제 결제/Toss/API 호출 0. localStorage 장바구니 → sessionStorage 주문 스냅샷 → /order-complete-demo.
export function CheckoutDemoView() {
  const router = useRouter();
  const { items, mounted } = useCart();
  const [submitting, setSubmitting] = useState(false);

  if (!mounted) {
    return <p className="text-center py-20 text-mute text-sm">불러오는 중...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[14px] text-body mb-1">담은 G 가 없어요.</p>
        <p className="text-[12px] text-mute mb-6">먼저 장바구니에 담아주세요.</p>
        <Link
          href="/products"
          className="inline-flex rounded-xl bg-ink text-canvas px-5 py-3 text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          상품 둘러보기 →
        </Link>
      </div>
    );
  }

  const total = cartTotal(items);
  const count = cartCount(items);
  const shipping = total >= 30000 ? 0 : 3000;
  const grandTotal = total + shipping;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const customerName = String(fd.get("name") || "고객님");
    const order: LastOrder = {
      orderId: generateOrderId(),
      items,
      total: grandTotal,
      createdAt: new Date().toISOString(),
      customerName,
    };
    saveLastOrder(order);
    clearCart();
    router.push("/order-complete-demo");
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-[1.3fr_1fr] gap-6">
      {/* 좌측: 배송 정보 */}
      <div>
        <Section title="배송 정보">
          <Field label="받으시는 분" name="name" placeholder="홍길동" required defaultValue="" />
          <Field label="휴대폰" name="phone" placeholder="010-0000-0000" inputMode="tel" required defaultValue="" />
          <Row2>
            <Field label="우편번호" name="zip" placeholder="00000" inputMode="numeric" defaultValue="" />
            <Field label="기본 주소" name="addr1" placeholder="주소 검색" defaultValue="" />
          </Row2>
          <Field label="상세 주소" name="addr2" placeholder="동·호수까지" defaultValue="" />
          <Field label="배송 메모 (선택)" name="memo" placeholder="문 앞에 놔주세요" defaultValue="" />
        </Section>

        <Section title="결제 수단">
          <div className="rounded-xl border border-hairline bg-surface-soft p-4">
            <p className="text-[13px] text-body">
              결제 기능은 추후 연결 예정입니다. 지금은 데모 화면이라 결제 호출 없이 주문완료로 이동합니다.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              <span className="rounded-lg border border-hairline px-3 py-2 text-mute text-center">카드 (준비 중)</span>
              <span className="rounded-lg border border-hairline px-3 py-2 text-mute text-center">계좌이체 (준비 중)</span>
            </div>
          </div>
        </Section>
      </div>

      {/* 우측: 주문 요약 + CTA */}
      <aside className="md:sticky md:top-20 md:self-start">
        <Section title={`주문 상품 (${count}개)`}>
          <ul className="rounded-xl border border-hairline divide-y divide-hairline">
            {items.map((it) => {
              const product = findMockProduct(it.slug);
              return (
                <li key={it.slug} className="flex gap-3 p-3">
                  <div className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-surface-soft">
                    {product?.imageUrl ? (
                      <Image src={product.imageUrl} alt={it.name} fill sizes="56px" className="object-cover" />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-b ${it.gradient}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-mute">{it.brand}</p>
                    <p className="text-[12px] font-medium text-ink leading-snug line-clamp-2">{it.name}</p>
                    <p className="mt-1 text-[11px] text-mute">{formatKRW(it.price)} × {it.qty}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        <div className="rounded-xl border border-hairline bg-surface-soft p-4 space-y-1.5">
          <SumRow label="상품 금액" value={formatKRW(total)} />
          <SumRow label="배송비" value={shipping === 0 ? "무료" : formatKRW(shipping)} muted={shipping === 0} />
          {shipping > 0 ? (
            <p className="text-[10px] text-mute">3만원 이상 무료배송</p>
          ) : null}
          <div className="pt-2 mt-2 border-t border-hairline flex items-center justify-between">
            <span className="text-[14px] font-semibold text-ink">결제 금액</span>
            <span className="text-[18px] font-bold font-mono text-ink">{formatKRW(grandTotal)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full rounded-xl bg-ink text-canvas py-4 text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "처리 중..." : "주문 완료하기 (데모)"}
        </button>
        <p className="mt-2 text-[10px] text-mute text-center">
          * 데모입니다. 실제 결제가 일어나지 않습니다.
        </p>
      </aside>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <p className="text-[12px] font-semibold text-ink mb-2.5">{title}</p>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  inputMode,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  inputMode?: "text" | "tel" | "numeric" | "email";
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] text-mute">{label}{required ? " *" : ""}</span>
      <input
        name={name}
        placeholder={placeholder}
        inputMode={inputMode}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 block w-full rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-[13px] text-ink placeholder:text-mute focus:outline-none focus:border-ink"
      />
    </label>
  );
}

function Row2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-[110px_1fr] gap-2">{children}</div>;
}

function SumRow({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[12px]">
      <span className="text-body">{label}</span>
      <span className={`font-mono ${muted ? "text-mute" : "text-ink"}`}>{value}</span>
    </div>
  );
}
