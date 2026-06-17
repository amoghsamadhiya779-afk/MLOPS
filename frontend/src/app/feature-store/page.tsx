'use client';

import { motion } from 'framer-motion';

export default function FeatureStorePage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pt-12 pb-24 px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Feature Store & Data Lineage
          </h1>
          <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">
            Centralized feature engineering, drift detection, and end-to-end model lineage.
          </p>
        </div>

        {/* 1. Feature Store Studio */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-mono text-sm">1</span>
            Feature Store Studio
          </h2>
          <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
            {/* Pipeline Visualization */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
              
              {/* Raw Data */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-xl border border-white/20 bg-black flex flex-col items-center justify-center">
                  <span className="text-2xl">📊</span>
                  <span className="font-mono text-[10px] mt-2 text-white/50">Raw Data</span>
                </div>
                <span className="font-mono text-[10px] bg-white/5 px-2 py-1 rounded text-white/40">S3 Bucket</span>
              </div>

              <div className="hidden md:block flex-1 h-px bg-white/20 relative">
                <motion.div className="absolute top-0 left-0 h-full bg-primary" animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} />
              </div>

              {/* Feature Eng */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-xl border border-primary/50 bg-primary/10 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                  <span className="text-2xl">⚙️</span>
                  <span className="font-mono text-[10px] mt-2 text-primary">Airflow</span>
                </div>
                <span className="font-mono text-[10px] bg-primary/20 px-2 py-1 rounded text-primary">Transform</span>
              </div>

              <div className="hidden md:block flex-1 h-px bg-white/20 relative">
                <motion.div className="absolute top-0 left-0 h-full bg-primary" animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
              </div>

              {/* Feature Registry */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-24 rounded-xl border border-white/20 bg-black flex flex-col items-center justify-center">
                  <span className="font-heading font-bold">Registry</span>
                  <span className="font-mono text-[10px] mt-1 text-white/50">142 Active Features</span>
                </div>
              </div>

              <div className="hidden md:block flex-1 h-px bg-white/20 relative">
                <motion.div className="absolute top-0 left-0 h-full bg-secondary" animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
              </div>

              {/* Stores */}
              <div className="flex flex-col gap-4">
                <div className="w-32 h-16 rounded-xl border border-secondary/50 bg-secondary/10 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.2)]">
                  <span className="font-mono text-xs font-bold text-secondary">Online Store</span>
                  <span className="font-mono text-[9px] mt-1 text-secondary/70">Redis (2ms lat)</span>
                </div>
                <div className="w-32 h-16 rounded-xl border border-white/20 bg-white/5 flex flex-col items-center justify-center">
                  <span className="font-mono text-xs font-bold">Offline Store</span>
                  <span className="font-mono text-[9px] mt-1 text-white/50">Snowflake</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Drift Detection Center */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-secondary/20 text-secondary flex items-center justify-center font-mono text-sm">2</span>
            Drift Detection Center
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-xl border border-white/10">
              <h3 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-4">Feature Drift: Distance</h3>
              <div className="relative h-32 w-full flex items-end gap-1">
                {/* Simulated Histogram Overlay */}
                {[...Array(40)].map((_, i) => (
                  <div key={i} className="flex-1 relative h-full">
                    <motion.div className="absolute bottom-0 w-full bg-white/20 rounded-t-sm" style={{ height: `${20 + Math.sin(i * 0.2) * 50}%` }} />
                    <motion.div className="absolute bottom-0 w-full bg-red-500/50 rounded-t-sm" style={{ height: `${25 + Math.sin((i+2) * 0.2) * 45}%` }} animate={{ opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 font-mono text-[10px]">
                <span className="text-white/50 flex items-center gap-1"><div className="w-2 h-2 bg-white/20 rounded-sm"/> Training Dist</span>
                <span className="text-red-400 flex items-center gap-1"><div className="w-2 h-2 bg-red-500/50 rounded-sm"/> Production Dist</span>
              </div>
              <p className="mt-4 font-mono text-xs text-red-400 bg-red-500/10 p-2 rounded">Warning: Concept drift detected in 'Distance' (+14.2% shift)</p>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/10">
              <h3 className="font-mono text-xs uppercase tracking-widest text-foreground/50 mb-4">Prediction Drift: Flight Fare</h3>
              <div className="relative h-32 w-full flex items-end gap-1">
                {[...Array(40)].map((_, i) => (
                  <div key={i} className="flex-1 relative h-full">
                    <motion.div className="absolute bottom-0 w-full bg-white/20 rounded-t-sm" style={{ height: `${40 + Math.cos(i * 0.3) * 30}%` }} />
                    <motion.div className="absolute bottom-0 w-full bg-green-500/50 rounded-t-sm" style={{ height: `${42 + Math.cos((i+1) * 0.3) * 28}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 font-mono text-[10px]">
                <span className="text-white/50 flex items-center gap-1"><div className="w-2 h-2 bg-white/20 rounded-sm"/> Training Dist</span>
                <span className="text-green-400 flex items-center gap-1"><div className="w-2 h-2 bg-green-500/50 rounded-sm"/> Production Dist</span>
              </div>
              <p className="mt-4 font-mono text-xs text-green-400 bg-green-500/10 p-2 rounded">Stable: KL Divergence within safe thresholds (0.002)</p>
            </div>
          </div>
        </section>

        {/* 3. Model Lineage Graph */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-sm">3</span>
            Interactive Model Lineage DAG
          </h2>
          <div className="glass-panel p-8 rounded-2xl border border-white/10 overflow-x-auto">
            <div className="min-w-[800px] flex items-center justify-between">
              
              {/* Dataset Node */}
              <div className="border border-white/20 bg-black p-4 rounded-xl w-48 hover:border-purple-500/50 transition-colors cursor-pointer group">
                <span className="font-mono text-[10px] text-white/50 uppercase block mb-1">Dataset</span>
                <span className="font-bold block">Flight_Data_v3</span>
                <span className="font-mono text-xs text-foreground/40 mt-2 block">Rows: 1.4M</span>
              </div>
              
              <div className="h-px bg-white/20 w-16" />

              {/* Experiment Node */}
              <div className="border border-white/20 bg-black p-4 rounded-xl w-48 hover:border-purple-500/50 transition-colors cursor-pointer">
                <span className="font-mono text-[10px] text-white/50 uppercase block mb-1">Training Run</span>
                <span className="font-bold block">EXP-7892</span>
                <span className="font-mono text-xs text-foreground/40 mt-2 block">Algorithm: RF</span>
              </div>

              <div className="h-px bg-white/20 w-16" />

              {/* Model Node */}
              <div className="border border-purple-500/30 bg-purple-500/10 p-4 rounded-xl w-48 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <span className="font-mono text-[10px] text-purple-400 uppercase block mb-1">Model Registry</span>
                <span className="font-bold text-white block">flight_price_rf</span>
                <span className="font-mono text-xs text-purple-300 mt-2 block">Version: v1.4.2</span>
              </div>

              <div className="h-px bg-white/20 w-16" />

              {/* Deployment Node */}
              <div className="border border-primary/50 bg-primary/10 p-4 rounded-xl w-48 cursor-pointer shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                <span className="font-mono text-[10px] text-primary uppercase block mb-1">Deployment</span>
                <span className="font-bold text-white block">Production Cluster</span>
                <span className="font-mono text-xs text-primary mt-2 block">Status: Active</span>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
