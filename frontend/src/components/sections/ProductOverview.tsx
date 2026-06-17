'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const STAGES = [
  { name: "Data Sources", path: "/" },
  { name: "Feature Store", path: "/feature-store" },
  { name: "Experiment Tracking", path: "/experiment-tracking" },
  { name: "Training", path: "/training" },
  { name: "Registry", path: "/registry" },
  { name: "Deployment", path: "/deployment" },
  { name: "Monitoring", path: "/observability" }
];

export function ProductOverview() {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <section id="product-overview" className="relative min-h-screen flex flex-col items-center justify-center py-32 px-4 border-t border-border bg-background/50">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-24">
          <h2 className="font-heading text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Platform Architecture
          </h2>
          <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">
            A unified control plane tracking data from ingestion to inference.
          </p>
        </div>

        <div className="relative">
          {/* Animated connection line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden lg:block" />
          <motion.div 
            className="absolute top-1/2 left-0 w-full h-0.5 bg-primary -translate-y-1/2 hidden lg:block origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 relative z-10">
            {STAGES.map((stage, idx) => (
              <motion.div
                key={stage.path}
                onClick={() => handleNavigate(stage.path)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer border border-border hover:border-primary transition-colors bg-card/80 backdrop-blur-md"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-mono text-sm mb-4 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  0{idx + 1}
                </div>
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-foreground/80 group-hover:text-foreground transition-colors">
                  {stage.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
