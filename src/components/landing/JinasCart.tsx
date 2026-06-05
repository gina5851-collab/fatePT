import Link from "next/link";
import { getJinasPicks } from "@/config/products.mock";
import { MockProductCard } from "@/components/products/MockProductCard";

// "지나스 장바구니" — 사장님이 직접 고른 큐레이션 회유 동선.
export function JinasCart() {
  const items = getJinasPicks(5);
  return (
    <section className="container py-12 border-t border-hairline">
      <div className="text-center mb-6">
        <p className="text-[11px] font-mono tracking-[0.3em] text-mute mb-1.5">JINA&apos;S CART</p>
        <h2 className="text-[20px] md:text-[22px] font-bold text-ink">지나스 장바구니</h2>
        <p className="mt-2 text-[13px] text-body max-w-sm mx-auto">
          요즘 지나가 직접 담아 쓰고, 친구한테도 권하는 G만 모았어요.
        </p>
      </div>

      <div className="-mx-4 px-4 overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {items.map((p) => (
            <MockProductCard key={p.slug} product={p} variant="compact" />
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <Link href="/products" className="text-[12px] text-mute hover:text-ink underline underline-offset-4">
          지나의 픽 전체 보기 →
        </Link>
      </div>
    </section>
  );
}
