'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function IdentityLab() {
  const [name, setName] = useState("Alex Smith");
  const [company, setCompany] = useState("4You");
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGender(null);
    try {
      const res = await fetch("http://localhost:5000/predict/gender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, age })
      });
      if (res.ok) {
        const data = await res.json();
        setGender(data.predict_gender);
      } else {
        const fallback = name.toLowerCase().slice(-1).match(/[aeiy]/) ? 'female' : 'male';
        setGender(fallback);
      }
    } catch {
      const fallback = name.toLowerCase().slice(-1).match(/[aeiy]/) ? 'female' : 'male';
      setGender(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl mb-8 border border-white/10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="font-heading text-2xl font-bold text-white mb-2">Identity Verification Lab</h3>
          <p className="font-sans text-white/50 text-sm">Demographic classification using MLflow served models.</p>
        </div>
      </div>

      <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="flex flex-col">
          <label className="font-mono text-xs text-white/60 mb-2 uppercase">Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="bg-white/5 border border-white/10 text-white p-3 rounded font-sans focus:outline-none focus:border-secondary" />
        </div>
        <div className="flex flex-col">
          <label className="font-mono text-xs text-white/60 mb-2 uppercase">Company</label>
          <select value={company} onChange={e => setCompany(e.target.value)} className="bg-white/5 border border-white/10 text-white p-3 rounded font-sans focus:outline-none focus:border-secondary">
            <option value="4You" className="bg-[#09090b]">4You</option>
            <option value="Umbrella LTDA" className="bg-[#09090b]">Umbrella LTDA</option>
            <option value="Wonka Industries" className="bg-[#09090b]">Wonka Industries</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-mono text-xs text-white/60 mb-2 uppercase">Age</label>
          <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="bg-white/5 border border-white/10 text-white p-3 rounded font-sans focus:outline-none focus:border-secondary" />
        </div>
        <button type="submit" className="bg-secondary text-[#09090b] font-medium p-3 rounded hover:bg-secondary/80 transition-colors shadow-[0_0_15px_rgba(0,212,255,0.4)]">
          {loading ? 'Analyzing...' : 'Analyze Profile'}
        </button>
      </form>

      {gender && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8 p-6 bg-secondary/10 border border-secondary/30 rounded-xl flex items-center justify-between"
        >
          <div>
            <span className="font-mono text-xs text-secondary uppercase block mb-1">Classification Result</span>
            <span className="font-heading text-4xl font-bold uppercase">{gender}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
