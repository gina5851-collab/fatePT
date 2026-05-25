import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Ollama-style inverted CTA strip — the single attention-grabbing surface.
export function CTA() {
  return (
    <section className="container py-16">
      <div className="rounded-lg bg-surface-dark px-5 py-10 md:px-8 md:py-12 text-center text-canvas">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          막연한 불안을 리포트로 정리해 보세요
        </h2>
        <p className="mt-3 text-sm text-white/70">
          로그인 없이 게스트로도 결제할 수 있어요 · 결제 후 바로 확인 가능
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className={cn(buttonVariants({ size: "lg", variant: "onDark" }))}
          >
            리포트 시작하기
          </Link>
          <Link
            href="/contents"
            className="text-sm text-white/60 hover:text-white/90 underline underline-offset-4"
          >
            고민별 콘텐츠 먼저 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
