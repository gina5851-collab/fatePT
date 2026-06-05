import { Hero } from "@/components/landing/Hero";
import { GCategoryCards } from "@/components/landing/GCategoryCards";
import { CTA } from "@/components/landing/CTA";
import { WhatWeRead } from "@/components/landing/WhatWeRead";
import { HowItWorks } from "@/components/landing/HowItWorks";

// BrandG 홈 흐름 (Phase 1):
// Hero → 5G 카테고리 카드 → 메인 CTA → (사주 자산 보존: WhatWeRead/HowItWorks)
// 사주 자산(WhatWeRead, HowItWorks)은 Phase 4 콘텐츠 정리 전까지 보존.
export default function HomePage() {
  return (
    <div className="mx-auto max-w-[640px]">
      <Hero />
      <GCategoryCards />
      <CTA />
      <WhatWeRead />
      <HowItWorks />
    </div>
  );
}
