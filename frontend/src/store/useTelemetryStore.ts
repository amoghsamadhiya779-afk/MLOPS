import { create } from 'zustand';

interface TelemetryState {
  // Metrics
  modelsRunning: number;
  experimentsTracked: number;
  predictionsServed: number;
  pipelineHealth: number;
  averageLatency: number;
  
  // UI State
  layer: 'world' | 'platform';
  fpsLimit: 60 | 144 | 240;
  
  // Actions
  setLayer: (layer: 'world' | 'platform') => void;
  setFpsLimit: (limit: 60 | 144 | 240) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  modelsRunning: 2450,
  experimentsTracked: 45210,
  predictionsServed: 1250000,
  pipelineHealth: 99.9,
  averageLatency: 45,
  layer: 'world',
  fpsLimit: 60,
  setLayer: (layer) => set({ layer }),
  setFpsLimit: (limit) => set({ fpsLimit: limit }),
}));

// High-frequency simulation loop outside of React render cycle
if (typeof window !== 'undefined') {
  // Detect high refresh rate capabilities roughly
  let lastTime = performance.now();
  let frameCount = 0;
  
  const checkRefreshRate = (time: number) => {
    frameCount++;
    if (time - lastTime >= 1000) {
      if (frameCount > 100) {
        useTelemetryStore.setState({ fpsLimit: 144 });
      } else {
        useTelemetryStore.setState({ fpsLimit: 60 });
      }
      // Stop checking after first second
    } else {
      requestAnimationFrame(checkRefreshRate);
    }
  };
  requestAnimationFrame(checkRefreshRate);

  // Fetch live telemetry from FastAPI backend
  setInterval(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/telemetry');
      if (res.ok) {
        const data = await res.json();
        useTelemetryStore.setState((state) => ({
          predictionsServed: state.predictionsServed + data.throughput / 10,
          averageLatency: data.p99_latency,
          experimentsTracked: state.experimentsTracked + (Math.random() > 0.95 ? 1 : 0),
        }));
      }
    } catch (e) {
      // Fallback if backend is down
      useTelemetryStore.setState((state) => ({
        predictionsServed: state.predictionsServed + Math.floor(Math.random() * 50) + 10,
        averageLatency: 40 + Math.random() * 10,
      }));
    }
  }, 1000);
}
