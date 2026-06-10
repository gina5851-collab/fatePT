import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// BrandG 메인 CTA 섹션 — 내 G 진단 vs 쇼핑 양 갈래.
export function CTA() {
  return (
    <section className="container py-16">
      <div className="rounded-2xl border border-hairline bg-surface-soft px-5 py-10 md:px-8 md:py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
          내게 맞는 G, 한 번에 정리해드릴게요
        </h2>
        <p className="mt-3 text-sm text-body">
          생년월일 입력 → 내 타입 → 추천 G + 추천 상품
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 max-w-[300px] mx-auto">
          <Link
            href="/start"
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            내 G 찾기
          </Link>
          <Link
            href="/products"
            className="text-sm text-mute hover:text-ink underline underline-offset-4"
          >
            카테고리 먼저 둘러보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
