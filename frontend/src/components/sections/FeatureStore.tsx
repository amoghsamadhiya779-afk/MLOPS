'use client';

import { motion } from 'framer-motion';

export function FeatureStore() {
  return (
    <section id="feature-store" className="relative w-full min-h-full flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Real-time <br/>
            <span className="text-primary">Feature Intelligence</span>
          </h2>
          <p className="font-sans text-xl text-foreground/60 mb-8 leading-relaxed">
            Unify batch and streaming data. Serve point-in-time correct features for training, and millisecond-latency vectors for inference.
          </p>
          
          <div className="space-y-6">
            <div className="p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_var(--secondary)]" />
                <h3 className="font-heading font-bold uppercase tracking-widest text-sm">Streaming Ingestion</h3>
              </div>
              <p className="font-mono text-xs text-foreground/50">Kafka • Kinesis • PubSub &rarr; 12ms latency</p>
            </div>
            
            <div className="p-6 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                <h3 className="font-heading font-bold uppercase tracking-widest text-sm">Batch Processing</h3>
              </div>
              <p className="font-mono text-xs text-foreground/50">Snowflake • BigQuery &rarr; Scheduled materialization</p>
            </div>
          </div>
        </div>

        <div className="relative h-[500px] w-full glass-panel rounded-2xl overflow-hidden p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-secondary">Vector Retrieval Simulation</span>
            <span className="font-mono text-xs text-primary">Status: ONLINE</span>
          </div>
          
          <div className="flex-1 relative">
            {/* Mocked UI for Feature Vectors */}
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i}
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex justify-between items-center py-4 border-b border-white/5"
              >
                <div className="font-mono text-sm text-foreground/80">user_embedding_v{i}</div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-primary/20 text-primary text-[10px] rounded uppercase font-bold">Float32</span>
                  <span className="px-2 py-1 bg-white/10 text-white/50 text-[10px] rounded font-mono">1.2ms</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
