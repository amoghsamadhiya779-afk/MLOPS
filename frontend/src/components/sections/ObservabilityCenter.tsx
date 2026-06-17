'use client';

import { useTelemetryStore } from '@/store/useTelemetryStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import { useEffect, useState } from 'react';

// Mock Data for EDA charts derived from Streamlit logic
const AGENCY_DATA = [
  { name: 'FlyingDrops', count: 4500 },
  { name: 'Rainbow', count: 3200 },
  { name: 'CloudFy', count: 2800 },
];

const CORPORATE_DATA = [
  { name: '4You', value: 400 },
  { name: 'Umbrella LTDA', value: 300 },
  { name: 'Wonka Industries', value: 300 },
];
const COLORS = ['#7c3aed', '#00d4ff', '#10b981'];

const SCATTER_DATA = Array.from({ length: 50 }, () => ({
  distance: Math.random() * 2000 + 500,
  price: Math.random() * 800 + 200,
}));

export function ObservabilityCenter() {
  const [data, setData] = useState<any[]>([]);
  const averageLatency = useTelemetryStore((state) => state.averageLatency);
  const pipelineHealth = useTelemetryStore((state) => state.pipelineHealth);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev, { time: new Date().toLocaleTimeString(), latency: averageLatency }];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [averageLatency]);

  return (
    <section id="observability" className="relative w-full min-h-full flex flex-col items-center justify-start py-12 px-4">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-heading text-3xl font-bold text-white mb-2">Observability & Analytics</h3>
          <p className="font-sans text-white/50 text-sm">Real-time pipeline metrics and Exploratory Data Analysis.</p>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs text-accent uppercase tracking-widest block mb-1">System Health</span>
          <span className="font-heading text-2xl font-bold text-accent">{pipelineHealth}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Latency Chart */}
        <div className="glass-panel p-6 rounded-xl border border-white/5">
          <h4 className="font-mono text-xs text-secondary mb-6 uppercase tracking-widest">Global P99 Latency (ms)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} stroke="#ffffff33" tick={{fill: '#ffffff66', fontSize: 10, fontFamily: 'monospace'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff1a', borderRadius: '8px' }}
                  itemStyle={{ color: '#00d4ff', fontFamily: 'monospace', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="latency" stroke="#00d4ff" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Throughput Chart */}
        <div className="glass-panel p-6 rounded-xl border border-white/5">
          <h4 className="font-mono text-xs text-primary mb-6 uppercase tracking-widest">Inference Throughput (req/s)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="time" hide />
                <YAxis domain={['auto', 'auto']} stroke="#ffffff33" tick={{fill: '#ffffff66', fontSize: 10, fontFamily: 'monospace'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff1a', borderRadius: '8px' }}
                  itemStyle={{ color: '#7c3aed', fontFamily: 'monospace', fontSize: '12px' }}
                />
                <Line type="step" dataKey={() => 1200 + Math.random() * 200} stroke="#7c3aed" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* EDA CHARTS FROM STREAMLIT */}
      <h3 className="font-heading text-2xl font-bold text-white mb-6 mt-12">Fleet Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="glass-panel p-6 rounded-xl border border-white/5">
          <h4 className="font-mono text-xs text-white/50 mb-6 uppercase tracking-widest">Agency Performance</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AGENCY_DATA}>
                <XAxis dataKey="name" stroke="#ffffff33" tick={{fill: '#ffffff66', fontSize: 10, fontFamily: 'monospace'}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff1a', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-white/5">
          <h4 className="font-mono text-xs text-white/50 mb-6 uppercase tracking-widest">Corporate Client Share</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CORPORATE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                  {CORPORATE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff1a', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-white/5">
          <h4 className="font-mono text-xs text-white/50 mb-6 uppercase tracking-widest">Price vs Distance Matrix</h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <XAxis dataKey="distance" type="number" name="Distance" stroke="#ffffff33" tick={{fill: '#ffffff66', fontSize: 10}} />
                <YAxis dataKey="price" type="number" name="Price" stroke="#ffffff33" tick={{fill: '#ffffff66', fontSize: 10}} />
                <ZAxis range={[20, 20]} />
                <Tooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff1a', borderRadius: '8px' }} />
                <Scatter name="Flights" data={SCATTER_DATA} fill="#00d4ff" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
    </section>
  );
}
