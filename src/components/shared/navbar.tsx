'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, LayoutDashboard, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const pathname = usePathname();
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');
  const [aiConfig, setAiConfig] = React.useState<{ online: boolean; provider: string; model: string } | null>(null);

  React.useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => setAiConfig(data))
      .catch((err) => console.warn('Failed to fetch AI configuration status:', err));
  }, []);

  // Initialize theme from HTML class list
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    const activeTheme = isDark ? 'dark' : 'light';
    setTimeout(() => {
      setTheme(activeTheme);
    }, 0);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/analytics', label: 'Performance Analytics', icon: BarChart2 },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border glass shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/10 dark:bg-slate-950/40 border border-border transition-transform group-hover:scale-105 p-1">
              <img src="/logo.svg" alt="Faclie Logo" className="h-7 w-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-foreground bg-clip-text">
                Faclie
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest -mt-1">
                Client Simulator
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="gap-2 px-4 h-9 font-medium"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* AI Connection Status HUD */}
          {aiConfig && (
            <div 
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold select-none cursor-help mr-2 transition-all ${
                aiConfig.online 
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500 hover:bg-emerald-500/15' 
                  : 'bg-amber-500/10 border-amber-500/25 text-amber-500 hover:bg-amber-500/15'
              }`}
              title={
                aiConfig.online 
                  ? `AI model active: ${aiConfig.model} (${aiConfig.provider.toUpperCase()} Provider)` 
                  : 'Running in Local Offline Mode. Set NVIDIA_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY to enable Generative AI.'
              }
            >
              <div className={`h-1.5 w-1.5 rounded-full ${aiConfig.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden sm:inline">
                {aiConfig.online ? `AI: ${aiConfig.provider.toUpperCase()}` : 'Local Mode'}
              </span>
              <span className="sm:hidden">
                {aiConfig.online ? aiConfig.provider.toUpperCase() : 'Local'}
              </span>
            </div>
          )}

          {/* Mobile Nav Trigger Links */}
          <div className="flex md:hidden gap-1 mr-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="icon"
                    className="h-9 w-9"
                    title={link.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full border border-transparent hover:border-border"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600 fill-indigo-600/10" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
