import { Hero } from "@/components/landing/Hero";
import { WhatWeRead } from "@/components/landing/WhatWeRead";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";

// 대문 흐름: 히어로(후킹+CTA) → 무엇을 읽나 → CTA(감정) → 진행방식(절차는 아래로)
// 상품/가격 그리드는 대문에서 노출하지 않음(먼저 "확인하고 싶다" → 입력 유도).
export default function HomePage() {
  return (
    <div className="mx-auto max-w-[640px]">
      <Hero />
      <WhatWeRead />
      <CTA />
      <HowItWorks />
    </div>
  );
}
