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
    <section className="container py-16 md:py-32 text-center">
      {/* 질문형 서브 태그 */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 px-2">
        {questions.map((q) => (
          <span
            key={q}
            className="inline-block rounded-full border border-hairline px-3 py-1 text-xs text-body"
          >
            {q}
          </span>
        ))}
      </div>

      <h1 className="text-[28px] md:text-[44px] font-semibold tracking-tight leading-[1.15] text-ink px-2">
        {siteConfig.tagline}
      </h1>
      <p className="mt-4 text-[14px] md:text-[15px] text-body max-w-lg mx-auto leading-relaxed px-4">
        {siteConfig.description}
      </p>

      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
        <Link href="/products" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
          내 운명 진단받기
        </Link>
        <Link
          href="/contents"
          className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto")}
        >
          고민별 콘텐츠
        </Link>
      </div>

      <p className="mt-5 text-xs text-mute px-4">
        단정적인 운세가 아니라, 오늘부터 단련하는 자기이해 트레이닝입니다
      </p>
    </section>
  );
}
