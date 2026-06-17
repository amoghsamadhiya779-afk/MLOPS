'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'monochrome' | 'light-glass' | 'blueprint';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  xrayMode: boolean;
  setXrayMode: (xray: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('monochrome');
  const [xrayMode, setXrayMode] = useState(false);

  useEffect(() => {
    // Apply theme to document element
    if (theme === 'monochrome') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    if (xrayMode) {
      document.documentElement.classList.add('xray-mode');
    } else {
      document.documentElement.classList.remove('xray-mode');
    }
  }, [theme, xrayMode]);

  // Global X-Ray hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle on 'X' key, ignore if typing in an input
      if (e.key.toLowerCase() === 'x' && e.target instanceof Element && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        setXrayMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, xrayMode, setXrayMode }}>
      {children}
      {/* X-Ray Indicator */}
      {xrayMode && (
        <div className="fixed bottom-4 left-4 z-[9999] bg-green-500/20 border border-green-500 text-green-400 font-mono text-xs px-3 py-1 rounded animate-pulse pointer-events-none shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          X-RAY MODE ACTIVE
        </div>
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
