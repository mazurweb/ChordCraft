import { Hero } from '@/components/marketing/Hero';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { GenreShowcase } from '@/components/marketing/GenreShowcase';
import { PricingTable } from '@/components/marketing/PricingTable';
import { CTASection } from '@/components/marketing/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <GenreShowcase />
      <PricingTable />
      <CTASection />
    </>
  );
}
