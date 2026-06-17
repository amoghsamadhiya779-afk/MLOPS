'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeEngine';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Feature Store', path: '/feature-store' },
    { name: 'Registry', path: '/registry' },
    { name: 'Deployment', path: '/deployment' },
    { name: 'Platform Ops', path: '/ops' },
    { name: 'Observability', path: '/observability' },
    { name: 'AI Demos', path: '/demos' },
    { name: 'Engineering Profile', path: '/engineering' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.png" 
            alt="SARA Logo" 
            className="w-10 h-10 rounded-full ring-1 ring-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] opacity-90 object-cover"
          />
          <span className="font-heading font-bold text-xl tracking-tight group-hover:text-primary transition-colors">
            SARA
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.path ? 'text-primary' : 'text-foreground/60'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Theme Toggles */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTheme('monochrome')}
            className={`w-6 h-6 rounded-full border-2 ${theme === 'monochrome' ? 'border-primary' : 'border-border'} bg-black`}
            title="Monochrome Theme"
          />
          <button 
            onClick={() => setTheme('light-glass')}
            className={`w-6 h-6 rounded-full border-2 ${theme === 'light-glass' ? 'border-primary' : 'border-border'} bg-white`}
            title="Light Glass Theme"
          />
          <button 
            onClick={() => setTheme('blueprint')}
            className={`w-6 h-6 rounded-full border-2 ${theme === 'blueprint' ? 'border-primary' : 'border-border'} bg-blue-900`}
            title="Blueprint Theme"
          />
        </div>

      </div>
    </nav>
  );
}
