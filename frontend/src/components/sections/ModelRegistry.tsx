'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Model {
  name: string;
  version: string;
  stage: string;
  accuracy: number;
  last_updated: string;
}

export function ModelRegistry() {
  const [models, setModels] = useState<Model[]>([]);
  const [promoting, setPromoting] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/models')
      .then(res => res.json())
      .then(data => setModels(data.models))
      .catch(console.error);
  }, []);

  const handlePromote = async (modelName: string, version: string) => {
    setPromoting(`${modelName}-${version}`);
    try {
      const res = await fetch('http://localhost:5000/api/models/promote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_name: modelName, version: version })
      });
      if (res.ok) {
        setModels(prev => prev.map(m => 
          (m.name === modelName && m.version === version) 
            ? { ...m, stage: 'Production' } 
            : m
        ));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPromoting(null);
    }
  };
  return (
    <section id="model-registry" className="relative w-full min-h-full flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div className="relative h-[500px] w-full glass-panel rounded-2xl p-8 flex items-center justify-center border border-white/10 group cursor-pointer">
          {/* Abstract representation of a 3D version graph */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 rounded-2xl" />
          
          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div 
              animate={{ rotateY: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 border border-primary/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary),0.2)]"
            >
              <div className="w-16 h-16 border-2 border-secondary/80 rounded-full" />
            </motion.div>
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/50 group-hover:text-primary transition-colors">
              Interactive 3D Version Lineage [Active]
            </span>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Centralized Model Registry
          </h2>
          <p className="font-sans text-xl text-foreground/60 mb-8 leading-relaxed">
            Track lineage, compare versions, and promote models through environments safely.
          </p>
          
          <div className="space-y-4 font-mono text-sm">
            {models.length > 0 ? models.map((model, idx) => (
              <div 
                key={model.name + model.version} 
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  model.stage === 'Production' 
                    ? 'bg-primary/10 border-primary/30' 
                    : model.stage === 'Staging' 
                    ? 'bg-white/5 border-white/5 hover:border-yellow-500/50' 
                    : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  model.stage === 'Production' ? 'bg-primary shadow-[0_0_10px_var(--primary)] animate-pulse' 
                  : model.stage === 'Staging' ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' 
                  : 'bg-white/30'
                }`} />
                <div className="flex-1 flex justify-between items-center mr-4">
                  <span className={model.stage === 'Production' ? 'text-foreground font-bold' : 'text-foreground/80'}>
                    {model.name}_{model.version}
                  </span>
                  <span className="text-foreground/40 text-xs hidden sm:block">acc: {model.accuracy}</span>
                </div>
                
                {model.stage === 'Staging' ? (
                  <button 
                    onClick={() => handlePromote(model.name, model.version)}
                    disabled={promoting === `${model.name}-${model.version}`}
                    className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-yellow-500 hover:bg-green-500 text-black transition-colors shadow-[0_0_10px_rgba(234,179,8,0.3)] disabled:opacity-50"
                  >
                    {promoting === `${model.name}-${model.version}` ? 'Promoting...' : 'Promote'}
                  </button>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
                    model.stage === 'Production' ? 'bg-primary text-white' 
                    : 'bg-white/10 text-white/50'
                  }`}>
                    {model.stage}
                  </span>
                )}
              </div>
            )) : (
              <div className="text-center py-12 text-white/50 font-mono">Loading models from Registry...</div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
