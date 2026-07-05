'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  ShieldAlert, 
  TrendingUp, 
  Lock,
  Ghost,
  Volume2
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col relative overflow-hidden font-sans">
      {/* Decorative Neon Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="w-full h-20 flex items-center justify-between px-6 sm:px-12 border-b border-slate-800/40 bg-slate-950/20 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/40 border border-slate-850 p-1">
            <img src="/logo.svg" alt="Faclie Logo" className="h-7 w-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white">Faclie</span>
            <span className="text-[9px] font-medium text-slate-500 uppercase tracking-widest -mt-1">Simulator</span>
          </div>
        </div>

        <Link href="/dashboard">
          <Button variant="glass" className="border border-slate-700/60 text-white gap-2 font-semibold">
            Launch App
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-bold uppercase tracking-wider animate-pulse-subtle">
          <Sparkles className="h-3.5 w-3.5" />
          Next-Gen Freelance Client Simulator
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.15] bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Latih Negosiasi Klien <br />
            <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Sebelum Kena Red Flags
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Hadapi Linda si Scope Creeper, Budi si pembenci DP, dan Sarah si antusias Web3 dalam game simulasi percakapan interaktif berbasis state emosional dan intent tracking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 font-bold bg-primary text-primary-foreground hover:opacity-95 shadow-lg shadow-primary/25 h-12 px-8">
              Mulai Simulasi Sekarang
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <a href="#features" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 hover:bg-slate-800/40 text-slate-200 h-12 px-8">
              Pelajari Fitur
            </Button>
          </a>
        </div>

        {/* Hero Mockup Grid preview */}
        <div className="w-full border border-slate-800/60 rounded-2xl p-2 bg-slate-900/20 backdrop-blur-sm shadow-2xl relative mt-12 group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] to-transparent pointer-events-none z-20" />
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800/50 text-slate-500 text-xs shrink-0 select-none">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
            <span className="ml-4 font-mono text-[10px]">faclie_simulation_sandbox_v1.exe</span>
          </div>
          <div className="bg-slate-950/60 p-6 flex flex-col sm:flex-row gap-6 text-left rounded-b-xl">
            {/* Mock message bubble */}
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-primary font-bold">LINDA CHEN (PRODUCT MANAGER)</span>
                <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-300">
                  Quick question... VCs are asking for a demo link tomorrow! Can we quickly build a custom login flow and social share integration? Should be super simple right? 😅🙏
                </div>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[10px] text-emerald-400 font-bold">YOU (FREELANCER)</span>
                <div className="p-3 bg-primary/20 border border-primary/30 rounded-xl text-xs text-slate-200 inline-block text-left">
                  That will cost an extra $300 and require adding 3 days to our current milestone delivery schedule.
                </div>
                <div className="text-[9px] text-slate-500 block">Intent: Scope Creep Resistance</div>
              </div>
            </div>
            {/* Mock brief */}
            <div className="w-full sm:w-60 border border-slate-800/80 bg-slate-900/20 p-4 rounded-xl space-y-4 shrink-0 text-xs">
              <div className="font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                Risk Indicators (1)
              </div>
              <div className="bg-red-500/5 border border-red-500/10 p-2.5 rounded-lg text-[10px] text-red-400 leading-normal">
                <strong>Mid-Project Scope Creep</strong><br />
                Client attempting to slide in login and social share popups as &quot;simple adjustments&quot;.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section id="features" className="py-24 border-t border-slate-900 bg-slate-950/20 z-10">
        <div className="container mx-auto px-6 sm:px-12 max-w-5xl space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Fitur Cerdas untuk Asah Mental Agency
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
              Simulasi dirancang menyerupai realita freelance, lengkap dengan emosi klien yang labil dan detail agenda tersembunyi.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 border border-slate-800/60 bg-slate-900/30 rounded-xl space-y-3 transition-colors hover:border-slate-800">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-100">Hybrid Response Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Klien membalas pesan secara dinamis menggunakan state emosi (Satisfaction, Patience, Urgency) dan memory tracking jangka panjang.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-slate-800/60 bg-slate-900/30 rounded-xl space-y-3 transition-colors hover:border-slate-800">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-100">Crisis &amp; Surprise Events</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tantang diri Anda dengan mengaktifkan surprise event seperti klien memotong budget sepihak atau mendadak minta pivot ditengah jalan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-slate-800/60 bg-slate-900/30 rounded-xl space-y-3 transition-colors hover:border-slate-800">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-100">Performance Report Cards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dapatkan kartu penilaian instan di akhir simulasi mengukur skor profesionalisme, negosiasi keuangan, dan proteksi scope kerja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-600 bg-[#080b12] z-10 shrink-0">
        &copy; {new Date().getFullYear()} Faclie. All rights reserved. Built for Freelance &amp; Agency Professional development.
      </footer>
    </div>
  );
}
