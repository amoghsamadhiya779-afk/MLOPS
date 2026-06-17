'use client';

import { motion } from 'framer-motion';

const DAG_NODES = [
  "Data Validation",
  "Preprocessing",
  "Distributed Training",
  "Evaluation",
  "Model Registration"
];

export function TrainingPipeline() {
  return (
    <section id="training-pipeline" className="relative w-full min-h-full flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-7xl mx-auto w-full text-center">
        
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Automated Training Pipeline
        </h2>
        <p className="font-sans text-xl text-foreground/60 mb-16">
          Airflow-inspired DAG execution. Completely declarative.
        </p>

        <div className="flex flex-col items-center gap-4 relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-border -translate-x-1/2 z-0" />
          
          <motion.div 
            className="absolute top-0 left-1/2 w-0.5 bg-primary -translate-x-1/2 z-0 origin-top"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: false, amount: 0.8 }}
            transition={{ duration: 2, ease: "linear" }}
          />

          {DAG_NODES.map((node, idx) => (
            <motion.div
              key={node}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ delay: idx * 0.3 }}
              className="glass-panel px-8 py-4 rounded-full border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 relative bg-background flex items-center gap-4"
            >
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
              <span className="font-mono text-sm tracking-widest uppercase">{node}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
