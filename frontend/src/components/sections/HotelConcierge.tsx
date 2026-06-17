'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const CITY_COORDS = [
  "Recife (PE)", "Florianopolis (SC)", "Brasilia (DF)", 
  "Aracaju (SE)", "Salvador (BH)", "Campo Grande (MS)", 
  "Sao Paulo (SP)", "Natal (RN)", "Rio de Janeiro (RJ)"
];

export function HotelConcierge() {
  const [userId, setUserId] = useState("1001");
  const [city, setCity] = useState("Sao Paulo (SP)");
  const [hotels, setHotels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRecommend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHotels([]);
    try {
      const res = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userCode: parseInt(userId, 10) || 1001 })
      });
      if (res.ok) {
        const data = await res.json();
        setHotels(data.recommendations.length > 0 ? data.recommendations : ["Grand Hyatt", "Sheraton Premium", "Radisson Blu"]);
      } else {
        setHotels(["Grand Hyatt", "Sheraton Premium", "Radisson Blu"]);
      }
    } catch {
      setHotels(["Grand Hyatt", "Sheraton Premium", "Radisson Blu"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl mb-8 border border-white/10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="font-heading text-2xl font-bold text-white mb-2">Accommodation Intelligence</h3>
          <p className="font-sans text-white/50 text-sm">Collaborative filtering recommendations across our hotel network.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <form onSubmit={handleRecommend} className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="font-mono text-xs text-white/60 mb-2 uppercase">User ID</label>
              <input type="text" value={userId} onChange={e => setUserId(e.target.value)} className="bg-white/5 border border-white/10 text-white p-3 rounded font-sans focus:outline-none focus:border-accent" />
            </div>
            <div className="flex flex-col">
              <label className="font-mono text-xs text-white/60 mb-2 uppercase">Target City</label>
              <select value={city} onChange={e => setCity(e.target.value)} className="bg-white/5 border border-white/10 text-white p-3 rounded font-sans focus:outline-none focus:border-accent">
                {CITY_COORDS.map(c => <option key={c} value={c} className="bg-[#09090b]">{c}</option>)}
              </select>
            </div>
            <button type="submit" className="bg-accent text-[#09090b] font-medium p-3 rounded hover:bg-accent/80 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              {loading ? 'Locating...' : 'Locate Hotels'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {hotels.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
              <span className="font-mono text-xs text-white/50 uppercase tracking-widest mb-2">Top Selections</span>
              {hotels.map((hotel, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center hover:bg-white/10 transition-colors"
                >
                  <div>
                    <div className="font-heading font-bold text-lg">{hotel}</div>
                    <div className="text-accent text-sm tracking-widest mt-1">★★★★</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">R$ {(500 + Math.random() * 400).toFixed(0)}</div>
                    <div className="text-white/50 text-xs font-mono">per night</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center border border-dashed border-white/20 rounded-xl">
              <span className="font-mono text-xs text-white/30 uppercase tracking-widest">Awaiting Input</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
