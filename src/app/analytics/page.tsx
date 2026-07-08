'use client';

import * as React from 'react';
import { useChatStore } from '@/store/useChatStore';
import { useClientStore } from '@/store/useClientStore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog } from '@/components/ui/dialog';
import Navbar from '@/components/shared/navbar';
import { 
  TrendingUp, 
  Award, 
  Play, 
  BookOpen,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/tailwind';

export default function AnalyticsPage() {
  const { sessions, activeReplaySessionId, setActiveReplaySession } = useChatStore();
  const { clients, initializeClients } = useClientStore();

  React.useEffect(() => {
    initializeClients();
  }, [initializeClients]);

  // Filter completed sessions (those containing a scoreCard)
  const completedSessions = Object.values(sessions).filter(
    (s) => s.scoreCard !== undefined
  );

  // Calculate overall performance metrics
  const totalCompleted = completedSessions.length;
  
  const avgProfessionalism = totalCompleted > 0
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.scoreCard?.professionalism || 0), 0) / totalCompleted)
    : 0;

  const avgScopeMgt = totalCompleted > 0
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.scoreCard?.scopeManagement || 0), 0) / totalCompleted)
    : 0;

  const avgNegotiation = totalCompleted > 0
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.scoreCard?.negotiationSkill || 0), 0) / totalCompleted)
    : 0;

  const avgOverall = totalCompleted > 0
    ? Math.round((avgProfessionalism + avgScopeMgt + avgNegotiation) / 3)
    : 0;

  const activeReplay = activeReplaySessionId ? sessions[activeReplaySessionId] : null;
  const replayClient = activeReplay ? clients.find((c) => c.id === activeReplay.clientId) : null;

  const getRankName = (score: number) => {
    if (score >= 90) return 'Elite Freelance Consultant';
    if (score >= 75) return 'Professional Contractor';
    if (score >= 50) return 'Midweight Agency Lead';
    return 'Junior Spec Builder';
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
            Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Tinjau skor profesionalisme, manajemen scope kerja, negosiasi, dan tonton ulang percakapan lama.
          </p>
        </div>

        {totalCompleted === 0 ? (
          /* Empty State */
          <div className="grid gap-6 md:grid-cols-12">
            <Card className="md:col-span-8 border-border bg-card/30 backdrop-blur-sm p-8 text-center flex flex-col items-center justify-center space-y-4 min-h-[350px]">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Belum Ada Sesi Simulasi yang Selesai</h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Skor performa dan transkrip percakapan akan muncul di sini setelah Anda menyelesaikan proyek 
                dan menerima tagihan pembayaran final dari klien.
              </p>
              <Link href="/dashboard">
                <Button size="sm" className="gap-2 font-semibold">
                  Mulai Simulasi Pertama
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>

            <Card className="md:col-span-4 border-border bg-card/30 backdrop-blur-sm p-6 space-y-4">
              <h3 className="font-extrabold text-sm tracking-tight">Kualifikasi Freelancer</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Elite Freelancer</h4>
                    <p className="text-[10px] text-muted-foreground">Skor rata-rata di atas 90%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Professional Contractor</h4>
                    <p className="text-[10px] text-muted-foreground">Skor rata-rata 75% - 89%</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Stats Active Page */
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-12">
              {/* Overall Ratings Card */}
              <Card className="md:col-span-8 border-border bg-card/40 backdrop-blur-sm relative overflow-hidden">
                <CardHeader className="p-6 pb-0 flex flex-row items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-md font-extrabold">Overall Quality Score</CardTitle>
                    <CardDescription className="text-xs">Rata-rata kumulatif seluruh sesi simulasi</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6 grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col justify-center space-y-2 border-r border-border/40 pr-6">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Current Rank</span>
                    <h3 className="text-xl font-black text-primary leading-tight">{getRankName(avgOverall)}</h3>
                    <p className="text-xs text-muted-foreground">Berdasarkan total {totalCompleted} sesi simulasi.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Professionalism</span>
                        <span className="text-indigo-400 font-extrabold">{avgProfessionalism}%</span>
                      </div>
                      <Progress value={avgProfessionalism} indicatorClassName="bg-indigo-500" className="h-1.5" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Scope Management</span>
                        <span className="text-amber-400 font-extrabold">{avgScopeMgt}%</span>
                      </div>
                      <Progress value={avgScopeMgt} indicatorClassName="bg-amber-500" className="h-1.5" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Negotiation Skill</span>
                        <span className="text-emerald-400 font-extrabold">{avgNegotiation}%</span>
                      </div>
                      <Progress value={avgNegotiation} indicatorClassName="bg-emerald-500" className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Summary Card */}
              <Card className="md:col-span-4 border-border bg-card/40 backdrop-blur-sm p-6 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-extrabold text-sm tracking-tight uppercase text-muted-foreground">Simulations Completed</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-foreground">{totalCompleted}</span>
                    <span className="text-xs text-muted-foreground">Sesi Selesai</span>
                  </div>
                </div>

                <div className="bg-slate-900/5 dark:bg-slate-950/20 p-4 border border-border/40 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-foreground">Tips Karir:</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Klien dengan tingkat kesulitan tinggi seperti Sarah (Nightmare) atau Budi (Hard) 
                    menuntut pertahanan batasan proyek yang ekstra solid. Jangan pernah menyetujui request tanpa tagihan ekstra!
                  </p>
                </div>
              </Card>
            </div>

            {/* Session Logs List */}
            <div className="space-y-4">
              <h2 className="text-md font-bold text-foreground">Completed Simulations</h2>
              
              <div className="flex flex-col gap-3">
                {completedSessions.map((session) => {
                  const client = clients.find((c) => c.id === session.clientId);
                  if (!client) return null;

                  return (
                    <div 
                      key={session.clientId} 
                      className="flex items-center justify-between p-4 border border-border rounded-xl bg-card/30 hover:bg-card/50 transition-all gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary text-xs shrink-0">
                          {client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-foreground">{client.name}</h4>
                            <Badge className="text-[9px] px-1.5 h-4.5 capitalize">{client.difficulty}</Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{client.role} at {client.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-xs text-center shrink-0">
                          <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Overall Rating</span>
                          <span className="font-extrabold text-foreground">{session.scoreCard?.overallRating}%</span>
                        </div>

                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setActiveReplaySession(session.clientId)}
                          className="gap-1.5 text-xs font-semibold h-8"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          View Replay
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Session Replay Dialog */}
      <Dialog 
        isOpen={activeReplaySessionId !== null} 
        onClose={() => setActiveReplaySession(null)}
        title={replayClient ? `Session Replay: ${replayClient.name}` : 'Session Replay'}
        className="max-w-2xl"
      >
        {activeReplay && replayClient && (
          <div className="flex flex-col space-y-4">
            <div className="p-3 border rounded-xl bg-slate-900/5 dark:bg-slate-950/20 text-xs flex justify-between items-center text-muted-foreground shrink-0">
              <span>{replayClient.role} at {replayClient.company}</span>
              <span className="font-bold text-primary">Score: {activeReplay.scoreCard?.overallRating}%</span>
            </div>

            {/* Replay Chat Logs Scroll area */}
            <div className="h-[350px] overflow-y-auto border border-border/80 rounded-xl p-4 bg-slate-900/5 dark:bg-slate-950/10 space-y-3.5">
              {activeReplay.messages.map((message) => {
                const isUser = message.sender === 'user';
                const isSystem = message.sender === 'system';
                
                if (isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center">
                      <span className="bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] px-3 py-1 rounded-lg">
                        {message.text}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={message.id} className={cn("flex flex-col max-w-[80%] space-y-1", { "ml-auto items-end": isUser })}>
                    <span className="text-[9px] text-muted-foreground font-semibold">
                      {isUser ? 'You (Freelancer)' : replayClient.name}
                    </span>
                    <div className={cn("p-3 rounded-xl text-xs border shadow-sm leading-relaxed", {
                      "bg-primary text-primary-foreground border-transparent rounded-tr-none": isUser,
                      "bg-card text-foreground border-border rounded-tl-none": !isUser
                    })}>
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      {message.detectedIntent && isUser && (
                        <div className="mt-2 text-[8px] bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 px-1 py-0.5 rounded-full inline-block font-bold uppercase tracking-wider scale-90">
                          Intent: {message.detectedIntent.replace(/_/g, ' ')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setActiveReplaySession(null)}>Close Replay</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
