import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// Ollama-style hero: paper-white canvas, 36px centered headline,
// single black pill CTA, monospace inline tag as "command pill".
export function Hero() {
  const questions = [
    "왜 나는 같은 연애를 반복할까?",
    "돈을 버는데도 안 모이는 이유",
    "중요한 선택 앞에서 늘 흔들리는 이유",
  ];

  return (
    <section className="container py-24 md:py-32 text-center">
      {/* 질문형 서브 태그 */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {questions.map((q) => (
          <span
            key={q}
            className="inline-block rounded-full border border-hairline px-3 py-1 text-xs text-body"
          >
            {q}
          </span>
        ))}
      </div>

      <h1 className="text-[34px] md:text-[44px] font-semibold tracking-tight leading-[1.1] text-ink">
        {siteConfig.tagline}
      </h1>
      <p className="mt-5 text-[15px] text-body max-w-lg mx-auto leading-relaxed">
        {siteConfig.description}
      </p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <Link href="/products" className={cn(buttonVariants({ size: "lg" }))}>
          리포트 보기
        </Link>
        <Link
          href="/contents"
          className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
        >
          고민별 콘텐츠
        </Link>
      </div>

      <p className="mt-5 text-xs text-mute">
        단정적인 운세가 아닌, 오늘의 선택을 정리하는 자기이해 리포트입니다
      </p>
    </section>
  );
}
