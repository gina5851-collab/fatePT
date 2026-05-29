import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Ollama-style inverted CTA strip — the single attention-grabbing surface.
export function CTA() {
  return (
    <section className="container py-16">
      <div className="rounded-2xl border border-hairline bg-surface-soft px-5 py-10 md:px-8 md:py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink">
          막연한 불안을, 단련 가능한 루틴으로
        </h2>
        <p className="mt-3 text-sm text-body">
          1분 무료 진단으로 시작 · 결과는 마이페이지에서 바로 확인
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/start"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            1분 무료로 진단받기
          </Link>
          <Link
            href="/contents"
            className="text-sm text-mute hover:text-ink underline underline-offset-4"
          >
            고민별 콘텐츠 먼저 보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
