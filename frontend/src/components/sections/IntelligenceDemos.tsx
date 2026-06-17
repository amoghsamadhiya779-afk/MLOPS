'use client';

import { Playground } from '@/components/sections/Playground';
import { IdentityLab } from '@/components/sections/IdentityLab';
import { HotelConcierge } from '@/components/sections/HotelConcierge';

export function IntelligenceDemos() {
  return (
    <section id="demos" className="relative w-full min-h-full flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Live AI Models
          </h2>
          <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">
            Interact with our proprietary recommendation engines and pricing predictors running live.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {/* We reuse the previously built legacy UI components here */}
          <div className="glass-panel p-8 rounded-2xl border border-white/10">
            <h3 className="font-heading text-2xl mb-6">Flight Pricing Engine</h3>
            <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <Playground />
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/10">
            <h3 className="font-heading text-2xl mb-6">Demographic Analyzer</h3>
            <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <IdentityLab />
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/10">
            <h3 className="font-heading text-2xl mb-6">Accommodation Intelligence</h3>
            <div className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <HotelConcierge />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
