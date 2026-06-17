'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeEngine';
import Link from 'next/link';

export function HeroSection() {
  const { theme, setTheme } = useTheme();

  const scrollToOverview = () => {
    document.getElementById('product-overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
      {/* Background gradients managed globally, but we can add specific hero flares */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-5xl mx-auto"
      >
        <div className="flex justify-center mb-8">
          <img 
            src="/logo.png" 
            alt="SARA OS" 
            className="w-24 h-24 rounded-full ring-2 ring-white/10 shadow-[0_0_40px_rgba(var(--primary),0.2)] object-cover opacity-90" 
          />
        </div>
        
        <h1 className="font-heading text-6xl md:text-8xl font-bold tracking-tighter mb-6 leading-[1.1]">
          The Operating System <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            for Production Machine Learning
          </span>
        </h1>
        
        <p className="font-sans text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto mb-12 tracking-tight">
          Build. Train. Deploy. Monitor.<br/>
          At Enterprise Scale.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
          <button 
            onClick={scrollToOverview}
            className="px-8 py-4 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(var(--primary),0.3)]"
          >
            Explore Platform
          </button>
          <Link 
            href="/docs"
            className="px-8 py-4 glass-panel rounded-full font-medium hover:bg-white/10 transition-colors inline-block"
          >
            Read Documentation
          </Link>
        </div>

        {/* Live Animated Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto border-t border-border pt-12">
          <div className="flex flex-col items-center">
            <span className="font-heading text-4xl font-bold text-foreground mb-2">14,204</span>
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">Models Running</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-4xl font-bold text-foreground mb-2">89.2k</span>
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">Experiments Tracked</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-4xl font-bold text-primary mb-2">1.2B</span>
            <span className="font-mono text-xs uppercase tracking-widest text-primary/70">Predictions Served</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-4xl font-bold text-secondary mb-2">99.99%</span>
            <span className="font-mono text-xs uppercase tracking-widest text-secondary/70">Pipeline Health</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
