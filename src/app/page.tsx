import { Hero } from "@/components/landing/Hero";
import { ProductLineup } from "@/components/landing/ProductLineup";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[640px]">
      <Hero />
      <ProductLineup />
      <HowItWorks />
      <CTA />
    </div>
  );
}
