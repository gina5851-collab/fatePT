import { Hero } from "@/components/landing/Hero";
import { LifeIssueChips } from "@/components/landing/LifeIssueChips";
import { GCategoryCards } from "@/components/landing/GCategoryCards";
import { BestPicks } from "@/components/landing/BestPicks";
import { JinasCart } from "@/components/landing/JinasCart";
import { TodaysSale } from "@/components/landing/TodaysSale";
import { GLab } from "@/components/landing/GLab";
import { BrandCuration } from "@/components/landing/BrandCuration";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { GGuides } from "@/components/landing/GGuides";
import { LifeIssuePlans } from "@/components/landing/LifeIssuePlans";
import { CTA } from "@/components/landing/CTA";

// BrandG 홈 — Phase 3 재구성 (올영베러식 흐름).
// Hero (축소) → 생활문제 chip → 5G → BEST → 지나스 → 특가 → G 연구소 → 브랜드 → NEW → 가이드 → 기획전 → CTA
export default function HomePage() {
  return (
    <div className="brandg-shop">
      <div className="mx-auto max-w-[1080px]">
        <Hero />
        <LifeIssueChips />
        <GCategoryCards />
        <BestPicks />
        <JinasCart />
        <TodaysSale />
        <GLab />
        <BrandCuration />
        <NewArrivals />
        <GGuides />
        <LifeIssuePlans />
        <CTA />
      </div>
    </div>
  );
}
