'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EngineeringProfilePage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pt-12 pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tighter mb-4">
            Engineering Profile
          </h1>
          <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto">
            Interactive verification of core engineering competencies demonstrated within SARA OS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* MLOps Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-panel p-8 rounded-2xl border border-white/10"
          >
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-bold text-xl mb-6">
              ML
            </div>
            <h2 className="text-2xl font-bold mb-4">MLOps & Tracking</h2>
            <ul className="space-y-3 mb-8 text-foreground/70">
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">Model Registry Lifecycle</span></li>
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">Experiment Tracking (MLflow Clone)</span></li>
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">Data & Concept Drift Detection</span></li>
            </ul>
            <div className="flex gap-4">
              <Link href="/experiment-tracking" className="text-xs uppercase tracking-widest bg-white/5 hover:bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded transition-colors">
                View Experiments
              </Link>
              <Link href="/registry" className="text-xs uppercase tracking-widest bg-white/5 hover:bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded transition-colors">
                View Registry
              </Link>
            </div>
          </motion.div>

          {/* Platform Engineering Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-panel p-8 rounded-2xl border border-white/10"
          >
            <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-lg flex items-center justify-center font-bold text-xl mb-6">
              K8s
            </div>
            <h2 className="text-2xl font-bold mb-4">Platform & Deployment</h2>
            <ul className="space-y-3 mb-8 text-foreground/70">
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">Distributed Systems Visualization</span></li>
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">Kubernetes Cluster Topology</span></li>
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">Traffic Routing & Load Balancing</span></li>
            </ul>
            <Link href="/deployment" className="text-xs uppercase tracking-widest bg-white/5 hover:bg-secondary/20 text-secondary border border-secondary/30 px-4 py-2 rounded transition-colors inline-block">
              View K8s Cluster
            </Link>
          </motion.div>

          {/* Backend & Systems Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-panel p-8 rounded-2xl border border-white/10"
          >
            <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center font-bold text-xl mb-6">
              API
            </div>
            <h2 className="text-2xl font-bold mb-4">Backend & Observability</h2>
            <ul className="space-y-3 mb-8 text-foreground/70">
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">FastAPI Control Plane Engine</span></li>
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">Real-time Telemetry & Metrics</span></li>
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">Database Schema Management</span></li>
            </ul>
            <Link href="/observability" className="text-xs uppercase tracking-widest bg-white/5 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 px-4 py-2 rounded transition-colors inline-block">
              View Observability Center
            </Link>
          </motion.div>

          {/* Deep Learning & Interpretability Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-panel p-8 rounded-2xl border border-white/10"
          >
            <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center font-bold text-xl mb-6">
              DL
            </div>
            <h2 className="text-2xl font-bold mb-4">ML & Interpretability</h2>
            <ul className="space-y-3 mb-8 text-foreground/70">
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">End-to-End Inference Pipeline</span></li>
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">Feature Importance & Contributions</span></li>
              <li className="flex items-center gap-2">✅ <span className="font-mono text-sm">Confidence Intervals & Calibration</span></li>
            </ul>
            <Link href="/demos" className="text-xs uppercase tracking-widest bg-white/5 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded transition-colors inline-block">
              View Live Inference Playground
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
