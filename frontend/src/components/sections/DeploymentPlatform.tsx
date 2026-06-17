'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function DeploymentPlatform() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <section id="deployment" className="relative w-full min-h-full flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-7xl mx-auto w-full text-center mb-16">
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Autoscaling Inference
        </h2>
        <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">
          Kubernetes-native serving. Zero-downtime rollouts. Sub-millisecond latency.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        {/* Animated Traffic Particles */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
           {mounted && [...Array(20)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"
               initial={{ top: 0, left: `${Math.random() * 100}%`, opacity: 0 }}
               animate={{ top: '100%', opacity: [0, 1, 0] }}
               transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
             />
           ))}
        </div>

        <div className="relative z-10 flex flex-col gap-12">
          
          {/* Load Balancer / Ingress */}
          <div className="flex justify-center">
            <div className="glass-panel p-6 rounded-xl border border-white/20 text-center bg-white/5 relative shadow-[0_0_30px_rgba(255,255,255,0.05)] w-64">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black font-mono text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                Global Ingress
              </div>
              <span className="font-heading font-bold text-xl block mb-1">Nginx Controller</span>
              <p className="text-sm font-mono text-primary animate-pulse">Routing 10,492 req/s</p>
              
              {/* Traffic lines to nodes */}
              <div className="absolute -bottom-12 left-1/2 w-px h-12 bg-gradient-to-b from-white/50 to-primary/50" />
              <div className="absolute -bottom-12 left-[25%] w-[50%] h-px bg-primary/50" />
              <div className="absolute -bottom-12 left-[25%] w-px h-12 bg-primary/50" />
              <div className="absolute -bottom-12 right-[25%] w-px h-12 bg-primary/50" />
            </div>
          </div>

          {/* Kubernetes Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Node 1 */}
            <div className="glass-panel p-6 rounded-xl border border-white/10 bg-black/40">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                    Node: us-east-1a
                  </h3>
                  <span className="font-mono text-[10px] text-white/40">t4g.xlarge | Memory: 62% | CPU: 45%</span>
                </div>
                <span className="bg-primary/20 text-primary px-2 py-1 rounded font-mono text-[10px] uppercase">Healthy</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: i * 0.2 }}
                    className="glass-panel p-3 rounded-lg border border-primary/30 bg-primary/5 text-center flex flex-col items-center justify-center relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <div className="w-2 h-2 rounded-full bg-primary mb-2 shadow-[0_0_8px_var(--primary)]" />
                    <span className="font-mono text-[9px] uppercase text-white/70">Pod-{i+1}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Node 2 */}
            <div className="glass-panel p-6 rounded-xl border border-white/10 bg-black/40">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308] animate-pulse"></span>
                    Node: us-east-1b
                  </h3>
                  <span className="font-mono text-[10px] text-white/40">t4g.xlarge | Memory: 89% | CPU: 92%</span>
                </div>
                <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded font-mono text-[10px] uppercase">Scaling</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: i * 0.2 }}
                    className="glass-panel p-3 rounded-lg border border-primary/30 bg-primary/5 text-center flex flex-col items-center justify-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mb-2 shadow-[0_0_8px_var(--primary)]" />
                    <span className="font-mono text-[9px] uppercase text-white/70">Pod-{i+7}</span>
                  </motion.div>
                ))}
                
                {/* Pending Pods */}
                {[...Array(2)].map((_, i) => (
                  <motion.div 
                    key={`pending-${i}`}
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="glass-panel p-3 rounded-lg border border-white/20 bg-transparent text-center flex flex-col items-center justify-center border-dashed"
                  >
                    <div className="w-2 h-2 rounded-full bg-white/30 mb-2" />
                    <span className="font-mono text-[9px] uppercase text-white/40">Pending</span>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
