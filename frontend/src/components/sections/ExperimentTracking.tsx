'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Experiment {
  id: string;
  name: string;
  status: string;
  accuracy: number;
  loss: number;
  duration: string;
  timestamp: string;
}

export function ExperimentTracking() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingMessage, setTrainingMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/experiments')
      .then(res => res.json())
      .then(data => setExperiments(data.experiments.slice(0, 6)))
      .catch(console.error);
  }, []);

  const handleRetrain = async () => {
    setIsTraining(true);
    setTrainingMessage("Triggering distributed training cluster...");
    try {
      const res = await fetch('http://localhost:5000/api/train', { method: 'POST' });
      const data = await res.json();
      setTrainingMessage(data.message);
      
      // Add the new simulated run to the list
      const newRun: Experiment = {
        id: data.run_id,
        name: "Auto_Retrain_RF",
        status: "Completed",
        accuracy: data.metrics.accuracy,
        loss: data.metrics.loss,
        duration: "12m",
        timestamp: "Just now"
      };
      
      setTimeout(() => {
        setExperiments(prev => [newRun, ...prev].slice(0, 6));
        setTrainingMessage(null);
        setIsTraining(false);
      }, 2000);
      
    } catch (e) {
      setTrainingMessage("Failed to connect to cluster.");
      setIsTraining(false);
    }
  };
  return (
    <section id="experiment-tracking" className="relative w-full min-h-full flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-7xl mx-auto w-full">
        
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Experiment Tracking
          </h2>
          <p className="font-sans text-xl text-foreground/60 max-w-2xl mx-auto mb-8">
            Compare runs, track hyperparameters, and monitor model convergence in real-time.
          </p>
          
          <button 
            onClick={handleRetrain}
            disabled={isTraining}
            className={`px-6 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(var(--primary),0.3)] ${
              isTraining ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/80 text-white'
            }`}
          >
            {isTraining ? 'Training in Progress...' : '▶ Trigger Retraining Pipeline'}
          </button>
          
          {trainingMessage && (
            <p className="text-secondary mt-4 font-mono text-sm animate-pulse">
              [SYSTEM] {trainingMessage}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Run Cards */}
          {experiments.length > 0 ? experiments.map((run, idx) => (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-panel p-6 rounded-xl border ${idx === 0 ? 'border-secondary shadow-[0_0_20px_rgba(0,212,255,0.2)]' : 'border-white/10'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-heading font-bold text-lg">{run.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${run.status === 'Failed' ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
                  {run.status}
                </span>
              </div>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/50">Run ID</span>
                  <span>{run.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/50">Duration</span>
                  <span>{run.duration}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-white/10 mt-4">
                  <span className="text-foreground/50">Accuracy / Loss</span>
                  <span className={idx === 0 ? 'text-secondary font-bold' : ''}>
                    {run.accuracy} / {run.loss}
                  </span>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-3 text-center py-12 text-white/50 font-mono">Loading experiments from MLflow...</div>
          )}
        </div>

      </div>
    </section>
  );
}
