import { Hero } from "@/components/landing/Hero";
import { GCategoryCards } from "@/components/landing/GCategoryCards";
import { BestPicks } from "@/components/landing/BestPicks";
import { TodaysSale } from "@/components/landing/TodaysSale";
import { JinasCart } from "@/components/landing/JinasCart";
import { GLab } from "@/components/landing/GLab";
import { CTA } from "@/components/landing/CTA";

// BrandG 홈 흐름 (데모) — DB 무관, mock 데이터 기반.
// Hero → 5G 카테고리 → BEST → 오늘의 G 특가 → 지나스 장바구니 → G 연구소 → CTA(내 G 찾기)
export default function HomePage() {
  return (
    <div className="mx-auto max-w-[640px]">
      <Hero />
      <GCategoryCards />
      <BestPicks />
      <TodaysSale />
      <JinasCart />
      <GLab />
      <CTA />
    </div>
  );
}
