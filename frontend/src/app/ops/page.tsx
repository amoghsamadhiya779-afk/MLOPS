'use client';

import { motion } from 'framer-motion';

export default function OperationsCenterPage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pt-12 pb-24 px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Platform Operations Center
          </h1>
          <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">
            Automated CI/CD, incident response simulations, and infrastructure economics.
          </p>
        </div>

        {/* 1. CI/CD Pipeline Viewer */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center font-mono text-sm">1</span>
            Interactive CI/CD Pipeline
          </h2>
          <div className="glass-panel p-8 rounded-2xl border border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
              
              {/* Stages */}
              {[
                { name: 'Git Push', status: 'success', time: '12s' },
                { name: 'Unit Tests', status: 'success', time: '45s' },
                { name: 'Docker Build', status: 'success', time: '2m 14s' },
                { name: 'E2E Testing', status: 'running', time: 'In Progress' },
                { name: 'Prod Deploy', status: 'pending', time: '--' }
              ].map((stage, idx, arr) => (
                <div key={stage.name} className="flex flex-col items-center gap-2 relative z-10 w-32">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                    stage.status === 'success' ? 'border-green-500 bg-green-500/10 text-green-500' :
                    stage.status === 'running' ? 'border-primary bg-primary/10 text-primary animate-pulse' :
                    'border-white/20 bg-black text-white/30'
                  }`}>
                    {stage.status === 'success' ? '✓' : stage.status === 'running' ? '⚙' : '○'}
                  </div>
                  <span className="font-bold text-sm text-center">{stage.name}</span>
                  <span className="font-mono text-[10px] text-foreground/50">{stage.time}</span>
                  
                  {/* Connecting Line */}
                  {idx < arr.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-full w-full h-px -translate-y-1/2 -z-10">
                      <div className={`h-full ${stage.status === 'success' ? 'bg-green-500' : 'bg-white/20'}`} />
                      {stage.status === 'running' && (
                        <motion.div className="absolute top-0 left-0 h-full bg-primary" animate={{ width: ['0%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity }} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Incident Timeline Replay */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-red-500/20 text-red-400 flex items-center justify-center font-mono text-sm">2</span>
            Incident Response Timeline
          </h2>
          <div className="glass-panel p-8 rounded-2xl border border-white/10 relative">
            <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-px bg-white/10 -translate-x-1/2" />
            
            <div className="space-y-8">
              <div className="relative flex flex-col md:flex-row items-center justify-between group">
                <div className="hidden md:block w-[45%] text-right pr-8">
                  <span className="font-mono text-xs text-red-400 block mb-1">14:02:45 UTC</span>
                  <p className="text-sm text-foreground/70">Prediction latency spiked &gt; 2000ms.</p>
                </div>
                <div className="w-4 h-4 rounded-full bg-red-500 absolute left-4 md:left-1/2 -translate-x-1/2 shadow-[0_0_10px_#ef4444] z-10" />
                <div className="w-[45%] pl-12 md:pl-8 text-left">
                  <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                    <span className="font-bold text-red-400 block">Critical Alert Triggered</span>
                    <span className="font-mono text-[10px] text-red-400/70">PagerDuty Ticket #8492</span>
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col md:flex-row items-center justify-between group">
                <div className="w-[45%] pl-12 md:pl-0 md:pr-8 text-left md:text-right order-2 md:order-1">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                    <span className="font-bold text-yellow-500 block">Automated Rollback Initiated</span>
                    <span className="font-mono text-[10px] text-yellow-500/70">Reverting to deployment/v1.4.1</span>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full bg-yellow-500 absolute left-4 md:left-1/2 -translate-x-1/2 shadow-[0_0_10px_#eab308] z-10 order-1 md:order-2" />
                <div className="hidden md:block w-[45%] pl-8 text-left order-3">
                  <span className="font-mono text-xs text-yellow-500 block mb-1">14:03:12 UTC</span>
                  <p className="text-sm text-foreground/70">SARA OS detects anomaly, triggers ArgoCD sync.</p>
                </div>
              </div>

              <div className="relative flex flex-col md:flex-row items-center justify-between group">
                <div className="hidden md:block w-[45%] text-right pr-8">
                  <span className="font-mono text-xs text-green-400 block mb-1">14:04:30 UTC</span>
                  <p className="text-sm text-foreground/70">Latency stabilized at 42ms.</p>
                </div>
                <div className="w-4 h-4 rounded-full bg-green-500 absolute left-4 md:left-1/2 -translate-x-1/2 shadow-[0_0_10px_#22c55e] z-10" />
                <div className="w-[45%] pl-12 md:pl-8 text-left">
                  <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                    <span className="font-bold text-green-400 block">System Recovered</span>
                    <span className="font-mono text-[10px] text-green-400/70">MTTR: 1m 45s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Cost Analytics */}
        <section>
          <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-sm">3</span>
            Infrastructure Economics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="glass-panel p-6 rounded-xl border border-white/10 text-center">
              <span className="font-mono text-[10px] uppercase text-foreground/50 block mb-2">Training Clusters (GPU)</span>
              <span className="font-heading text-3xl font-bold block mb-1">$4,250</span>
              <span className="text-xs text-red-400 flex justify-center items-center gap-1">↑ 12% vs last month</span>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/10 text-center">
              <span className="font-mono text-[10px] uppercase text-foreground/50 block mb-2">Inference Nodes (CPU)</span>
              <span className="font-heading text-3xl font-bold block mb-1">$1,890</span>
              <span className="text-xs text-green-400 flex justify-center items-center gap-1">↓ 4% vs last month</span>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-white/10 text-center">
              <span className="font-mono text-[10px] uppercase text-foreground/50 block mb-2">Feature Store (Redis/S3)</span>
              <span className="font-heading text-3xl font-bold block mb-1">$840</span>
              <span className="text-xs text-white/40 flex justify-center items-center gap-1">- Stable</span>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-primary/30 bg-primary/5 text-center shadow-[0_0_15px_rgba(var(--primary),0.1)]">
              <span className="font-mono text-[10px] uppercase text-primary block mb-2">Total MLOps TCO</span>
              <span className="font-heading text-3xl font-bold block mb-1">$6,980</span>
              <span className="text-xs text-foreground/70">Estimated Monthly</span>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
