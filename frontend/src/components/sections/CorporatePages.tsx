'use client';

import { motion } from 'framer-motion';

export function ArchitectureDeepDive() {
  return (
    <section id="architecture-deep-dive" className="relative min-h-screen flex flex-col items-center justify-center py-32 px-4 border-t border-border bg-background">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Architecture Deep Dive
          </h2>
          <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">
            Built for scale. Designed for performance.
          </p>
        </div>
        <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center font-mono text-sm text-foreground/60">
          <p>[Interactive Deep Dive Diagram Placeholder]</p>
          <p className="mt-4">Frontend &rarr; Backend &rarr; Feature Store &rarr; Streaming &rarr; Registry &rarr; Serving &rarr; Monitoring</p>
        </div>
      </div>
    </section>
  );
}

export function EngineeringBlog() {
  return (
    <section id="engineering-blog" className="relative min-h-screen flex flex-col items-center justify-center py-32 px-4 border-t border-border bg-background/50">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Engineering Blog
          </h2>
          <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">
            Read about how we scale our infrastructure.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel p-6 rounded-xl border border-white/10 hover:border-primary transition-colors cursor-pointer group">
              <div className="w-full h-40 bg-white/5 rounded-lg mb-4 group-hover:bg-primary/10 transition-colors" />
              <h3 className="font-heading font-bold text-xl mb-2">Scaling to 1M Inference Requests</h3>
              <p className="text-sm text-foreground/60">An architecture review of our Kubernetes autoscaler.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Documentation() {
  return (
    <section id="documentation" className="relative min-h-screen flex flex-col items-center justify-center py-32 px-4 border-t border-border bg-background">
      <div className="max-w-6xl mx-auto w-full text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Documentation
        </h2>
        <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto mb-8">
          Production-quality API references and guides.
        </p>
        <button className="px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(var(--primary),0.3)]">
          Read Docs
        </button>
      </div>
    </section>
  );
}

export function Careers() {
  return (
    <section id="careers" className="relative min-h-screen flex flex-col items-center justify-center py-32 px-4 border-t border-border bg-background/50">
      <div className="max-w-6xl mx-auto w-full text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Careers at SARA
        </h2>
        <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto mb-8">
          Help us build the operating system for intelligence.
        </p>
        <div className="flex flex-col gap-4 max-w-2xl mx-auto text-left">
          <div className="glass-panel p-6 rounded-xl border border-white/10 flex justify-between items-center hover:border-primary cursor-pointer transition-colors">
            <div>
              <h3 className="font-bold text-lg">Senior Machine Learning Engineer</h3>
              <p className="text-foreground/50 text-sm">Remote / San Francisco</p>
            </div>
            <span className="text-primary">&rarr;</span>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-white/10 flex justify-between items-center hover:border-primary cursor-pointer transition-colors">
            <div>
              <h3 className="font-bold text-lg">Frontend Architect (WebGL)</h3>
              <p className="text-foreground/50 text-sm">Remote</p>
            </div>
            <span className="text-primary">&rarr;</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactDemo() {
  return (
    <section id="contact" className="relative min-h-screen flex flex-col items-center justify-center py-32 px-4 border-t border-border bg-background">
      <div className="max-w-xl mx-auto w-full text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Ready to Scale?
        </h2>
        <p className="font-sans text-xl text-foreground/60 mb-12">
          Book a demo with our engineering team today.
        </p>
        
        <form className="flex flex-col gap-4 text-left">
          <input type="text" placeholder="Work Email" className="w-full glass-panel border border-white/20 p-4 rounded-xl bg-transparent outline-none focus:border-primary transition-colors" />
          <button className="w-full px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(var(--primary),0.3)]">
            Schedule Demo
          </button>
        </form>
      </div>
    </section>
  );
}
