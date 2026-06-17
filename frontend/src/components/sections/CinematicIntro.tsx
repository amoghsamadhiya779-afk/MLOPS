'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTelemetryStore } from '@/store/useTelemetryStore';

const DESTINATIONS = [
  { name: 'NYC', url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Boston', url: 'https://images.unsplash.com/photo-1506501139174-099022df5260?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Machu Picchu', url: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Paris', url: 'https://images.unsplash.com/photo-1502602898657-3e9076596500?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Taj Mahal', url: 'https://images.unsplash.com/photo-1564507592208-02df21ead9cb?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Tokyo', url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2000&auto=format&fit=crop' },
];

export function CinematicIntro() {
  const [index, setIndex] = useState(0);
  const setLayer = useTelemetryStore((state) => state.setLayer);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % DESTINATIONS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={index}
          src={DESTINATIONS[index].url}
          alt={DESTINATIONS[index].name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

      {/* Button and Subtitles only. The SARA Logo is handled in page.tsx for layout transition */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end items-center pb-24">
        <motion.div 
          className="text-center flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <h2 className="font-heading text-4xl md:text-5xl tracking-tight text-white font-bold mb-4">
            The Operating System <br />
            <span className="text-white/60 font-light">for Travel Intelligence</span>
          </h2>
          
          <p className="font-sans text-lg text-white/70 max-w-xl mx-auto mb-10 font-light tracking-wide">
            Build. Train. Deploy. Observe. Scale. <br/> From Data to Decisions.
          </p>

          <motion.button
            onClick={() => setLayer('platform')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-sans text-sm tracking-widest uppercase rounded-full hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Explore Platform
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
