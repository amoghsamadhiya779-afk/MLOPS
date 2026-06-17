'use client';

import { useTheme } from '@/components/ThemeEngine';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProductOverview } from '@/components/sections/ProductOverview';
import { BackgroundSlideshow } from '@/components/animations/BackgroundSlideshow';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundSlideshow />
      </div>
      <div className="relative z-10 flex flex-col">
        <HeroSection />
        <ProductOverview />
      </div>
    </div>
  );
}
