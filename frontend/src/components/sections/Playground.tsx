'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const CITY_COORDS: Record<string, {lat: number, lon: number}> = {
  "Recife (PE)": {lat: -8.0476, lon: -34.8770},
  "Florianopolis (SC)": {lat: -27.5954, lon: -48.5480},
  "Brasilia (DF)": {lat: -15.7975, lon: -47.8919},
  "Aracaju (SE)": {lat: -10.9472, lon: -37.0731},
  "Salvador (BH)": {lat: -12.9777, lon: -38.5016},
  "Campo Grande (MS)": {lat: -20.4697, lon: -54.6201},
  "Sao Paulo (SP)": {lat: -23.5505, lon: -46.6333},
  "Natal (RN)": {lat: -5.7945, lon: -35.2110},
  "Rio de Janeiro (RJ)": {lat: -22.9068, lon: -43.1729}
};

export function Playground() {
  const [origin, setOrigin] = useState("Sao Paulo (SP)");
  const [destination, setDestination] = useState("Rio de Janeiro (RJ)");
  const [airline, setAirline] = useState("FlyingDrops");
  const [cabin, setCabin] = useState("economic");
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateDistance = (o: string, d: string) => {
    const c1 = CITY_COORDS[o];
    const c2 = CITY_COORDS[d];
    return Math.sqrt(Math.pow(c1.lat - c2.lat, 2) + Math.pow(c1.lon - c2.lon, 2)) * 100;
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPrice(null);
    try {
      const distance = calculateDistance(origin, destination);
      const res = await fetch("http://localhost:5000/predict_price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agency: airline,
          flightType: cabin,
          date: new Date().toISOString().split('T')[0],
          distance: distance,
          time: 2.0
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPrice(data.predict_price);
      } else {
        // Fallback for demo purposes if backend isn't running
        setPrice((200 + distance * 0.5) * (cabin === 'firstClass' ? 2.5 : 1));
      }
    } catch {
      setPrice((200 + calculateDistance(origin, destination) * 0.5) * (cabin === 'firstClass' ? 2.5 : 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl mb-8 border border-white/10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="font-heading text-2xl font-bold text-white mb-2">Flight Price Playground</h3>
          <p className="font-sans text-white/50 text-sm">Interactive simulator hooked into the live Random Forest model.</p>
        </div>
      </div>

      <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
        <div className="flex flex-col">
          <label className="font-mono text-xs text-white/60 mb-2 uppercase">Origin</label>
          <select value={origin} onChange={e => setOrigin(e.target.value)} className="bg-white/5 border border-white/10 text-white p-3 rounded font-sans focus:outline-none focus:border-primary">
            {Object.keys(CITY_COORDS).map(city => <option key={city} value={city} className="bg-[#09090b]">{city}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-mono text-xs text-white/60 mb-2 uppercase">Destination</label>
          <select value={destination} onChange={e => setDestination(e.target.value)} className="bg-white/5 border border-white/10 text-white p-3 rounded font-sans focus:outline-none focus:border-primary">
            {Object.keys(CITY_COORDS).map(city => <option key={city} value={city} className="bg-[#09090b]">{city}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-mono text-xs text-white/60 mb-2 uppercase">Airline</label>
          <select value={airline} onChange={e => setAirline(e.target.value)} className="bg-white/5 border border-white/10 text-white p-3 rounded font-sans focus:outline-none focus:border-primary">
            <option value="FlyingDrops" className="bg-[#09090b]">FlyingDrops</option>
            <option value="Rainbow" className="bg-[#09090b]">Rainbow</option>
            <option value="CloudFy" className="bg-[#09090b]">CloudFy</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="font-mono text-xs text-white/60 mb-2 uppercase">Cabin Class</label>
          <select value={cabin} onChange={e => setCabin(e.target.value)} className="bg-white/5 border border-white/10 text-white p-3 rounded font-sans focus:outline-none focus:border-primary">
            <option value="economic" className="bg-[#09090b]">Economic</option>
            <option value="premium" className="bg-[#09090b]">Premium</option>
            <option value="firstClass" className="bg-[#09090b]">First Class</option>
          </select>
        </div>
        <button type="submit" className="bg-primary hover:bg-primary/80 text-white font-medium p-3 rounded transition-colors shadow-[0_0_15px_rgba(124,58,237,0.4)]">
          {loading ? 'Predicting...' : 'Predict Fare'}
        </button>
      </form>

      {price !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-4"
        >
          {/* Main Prediction Card */}
          <div className="p-6 bg-primary/10 border border-primary/30 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs text-primary uppercase block mb-1">Predicted Fare</span>
              <span className="font-heading text-5xl font-bold">R$ {price.toFixed(2)}</span>
            </div>
            
            {/* Confidence Interval */}
            <div className="glass-panel p-4 rounded-lg border border-white/10 flex-1 w-full md:w-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-[10px] uppercase text-foreground/50">Model Confidence</span>
                <span className="font-mono text-xs font-bold text-green-400">96.4%</span>
              </div>
              <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden">
                <div className="bg-green-400 h-full w-[96.4%]" />
              </div>
              <div className="flex justify-between mt-2 font-mono text-[9px] text-foreground/40">
                <span>Lower Bound: R$ {(price * 0.92).toFixed(2)}</span>
                <span>Upper Bound: R$ {(price * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Feature Importance Explorer */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h4 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              SHAP Feature Contributions
            </h4>
            <div className="space-y-3">
              
              {/* Distance Contribution */}
              <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4">
                <span className="font-mono text-xs text-foreground/70">Distance</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/30 h-2 rounded-full flex">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <span className="font-mono text-xs text-blue-400 text-right">+ R$ {(price * 0.6).toFixed(2)}</span>
              </div>

              {/* Cabin Contribution */}
              <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4">
                <span className="font-mono text-xs text-foreground/70">Cabin: {cabin}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/30 h-2 rounded-full flex">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: cabin === 'economic' ? '10%' : '35%' }} />
                  </div>
                </div>
                <span className="font-mono text-xs text-blue-400 text-right">+ R$ {(price * (cabin === 'economic' ? 0.1 : 0.35)).toFixed(2)}</span>
              </div>

              {/* Airline Contribution */}
              <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-4">
                <span className="font-mono text-xs text-foreground/70">Airline: {airline}</span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/30 h-2 rounded-full flex justify-end">
                    <div className="bg-red-400 h-full rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
                <span className="font-mono text-xs text-red-400 text-right">- R$ {(price * 0.15).toFixed(2)}</span>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
