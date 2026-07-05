'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useClientStore } from '@/store/useClientStore';
import { useProjectStore } from '@/store/useProjectStore';
import { useChatStore } from '@/store/useChatStore';
import { ChatWindow } from '@/features/chat/chat-window';
import { ProjectBriefPanel } from '@/features/project/project-brief-panel';
import { Button } from '@/components/ui/button';
import { ChevronLeft, RotateCcw, AlertTriangle, Play, HelpCircle } from 'lucide-react';
import Navbar from '@/components/shared/navbar';
import Link from 'next/link';

export default function SimulatorPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params?.clientId as string;

  const { clients, initializeClients, resetClient } = useClientStore();
  const { resetProject } = useProjectStore();
  const { clearSession } = useChatStore();

  React.useEffect(() => {
    initializeClients();
  }, [initializeClients]);

  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h2 className="text-xl font-bold">Client Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Profil simulasi klien ini tidak terdaftar atau telah dihapus.
          </p>
          <Link href="/dashboard">
            <Button size="sm">Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleReset = () => {
    if (confirm(`Reset simulasi dengan ${client.name}? Seluruh riwayat chat akan dihapus.`)) {
      resetClient(clientId);
      clearSession(clientId);
      resetProject(clientId);
      router.refresh();
    }
  };

  const difficultyColors = {
    easy: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    hard: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    nightmare: 'text-red-500 bg-red-500/10 border-red-500/20 animate-pulse',
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Simulator Actions Header */}
      <div className="border-b border-border/80 bg-slate-900/5 dark:bg-slate-950/20 py-3 shrink-0">
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-border">
                <ChevronLeft className="h-4.5 w-4.5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-md font-extrabold tracking-tight text-foreground truncate max-w-[150px] sm:max-w-none">
                  Simulating: {client.name}
                </h1>
                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase shrink-0 ${difficultyColors[client.difficulty]}`}>
                  {client.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs h-8 text-muted-foreground hover:text-foreground gap-1.5 border border-border">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Session
            </Button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Simulator Layout */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 grid gap-6 md:grid-cols-12 overflow-hidden h-[calc(100vh-120px)]">
        {/* Left Column: Chat Window */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center h-full">
          <ChatWindow client={client} />
        </div>

        {/* Right Column: Project Brief Panel */}
        <div className="md:col-span-5 lg:col-span-4 h-full overflow-hidden">
          <ProjectBriefPanel client={client} />
        </div>
      </main>
    </div>
  );
}
