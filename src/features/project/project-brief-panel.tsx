'use client';

import * as React from 'react';
import { ActiveClientState } from '@/types/client';
import { ProjectBrief, Milestone } from '@/types/project';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useProjectStore } from '@/store/useProjectStore';
import { handleUserMessage } from '@/services/chatEngine';
import { 
  Briefcase, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Sparkles,
  FileCode,
  User,
  Brain,
  Languages
} from 'lucide-react';
import { cn } from '@/utils/tailwind';

interface ProjectBriefPanelProps {
  client: ActiveClientState;
}

export const ProjectBriefPanel = ({ client }: ProjectBriefPanelProps) => {
  const { id } = client;
  const projectStore = useProjectStore();
  const brief = projectStore.briefs[id];
  const updateMilestoneStatus = projectStore.updateMilestoneStatus;

  const [activeTab, setActiveTab] = React.useState<'brief' | 'client'>('brief');

  // Initialize brief on load
  React.useEffect(() => {
    projectStore.initializeProject(id);
  }, [id, projectStore]);

  if (!brief) {
    return (
      <div className="flex items-center justify-center h-full text-center p-6 border border-border border-dashed rounded-2xl bg-card/20 text-muted-foreground text-xs font-semibold">
        Client onboarding in progress. Submit initial replies to trigger project brief generation.
      </div>
    );
  }

  // Handle Milestone Submission
  const handleMilestoneSubmit = async (milestone: Milestone) => {
    if (milestone.status !== 'pending') return;

    // Shift milestone status to active/completed in the store
    updateMilestoneStatus(id, milestone.id, 'completed');

    // Send mock submission text to Chat Engine
    const submissionText = `[SIMULATED WORK SUBMISSION: Here is the work draft for "${milestone.title}". Please check out the figma layout link.]`;
    await handleUserMessage(id, submissionText);
  };

  const activeMilestones = brief.milestones;
  const totalMilestones = activeMilestones.length;
  const completedMilestones = activeMilestones.filter(m => m.status === 'completed').length;
  const progressPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Helper to decode client memory tags into gamer impressions
  const getImpressionsList = (memory: Record<string, string | boolean | number>) => {
    const list: { key: string; label: string; description: string; type: 'success' | 'warning' | 'default' }[] = [];

    if (memory.denied_code_creep) {
      list.push({
        key: 'denied_code_creep',
        label: '🛡️ Batasan Scope Tegas',
        description: 'Anda berhasil menolak pengerjaan coding React tambahan tanpa biaya.',
        type: 'success',
      });
    } else if (memory.accepted_code_creep) {
      list.push({
        key: 'accepted_code_creep',
        label: '⚠️ Scope Creep Diterima',
        description: 'Anda setuju mengerjakan coding React tambahan secara cuma-cuma.',
        type: 'warning',
      });
    }

    if (memory.scope_creep_resisted) {
      list.push({
        key: 'scope_creep_resisted',
        label: '🛡️ Menolak Modifikasi Gratis',
        description: 'Anda menolak penambahan fitur popup media sosial tanpa ada kompensasi tambahan.',
        type: 'success',
      });
    } else if (memory.scope_creep_accepted) {
      list.push({
        key: 'scope_creep_accepted',
        label: '⚠️ Menyetujui Kerja Ekstra',
        description: 'Anda menerima revisi di luar kontrak awal (popup media sosial) tanpa biaya.',
        type: 'warning',
      });
    }

    if (memory.respected_boundaries) {
      list.push({
        key: 'respected_boundaries',
        label: '🔒 Teguh Terhadap Aturan DP',
        description: 'Anda tegas menolak pengerjaan draf sebelum ada pembayaran uang muka.',
        type: 'success',
      });
    } else if (memory.easy_target) {
      list.push({
        key: 'easy_target',
        label: '🎯 Target Negosiasi Mudah',
        description: 'Budi menganggap Anda mudah didekati dan ditekan karena mau membuat draf gratis.',
        type: 'warning',
      });
    }

    if (memory.lost_payout_money) {
      list.push({
        key: 'lost_payout_money',
        label: '💸 Memberikan Diskon Terpaksa',
        description: 'Anda setuju memotong 15% dari total invoice karena ditekan.',
        type: 'warning',
      });
    }

    if (memory.demanded_usdc) {
      list.push({
        key: 'demanded_usdc',
        label: '🪙 Cerdas Memilih Pembayaran',
        description: 'Anda menuntut stablecoin USDC sebagai bentuk proteksi finansial.',
        type: 'success',
      });
    } else if (memory.accepted_token_gamble) {
      list.push({
        key: 'accepted_token_gamble',
        label: '🎲 Berjudi dengan Token',
        description: 'Anda setuju dibayar 100% menggunakan token utilitas yang berisiko tinggi.',
        type: 'warning',
      });
    }

    if (memory.resisted_pivot_creep) {
      list.push({
        key: 'resisted_pivot_creep',
        label: '🛡️ Melindungi Kontrak Awal',
        description: 'Anda menolak mengganti scope dengan pengerjaan 3D model gratis.',
        type: 'success',
      });
    } else if (memory.accepted_pivot_creep) {
      list.push({
        key: 'accepted_pivot_creep',
        label: '⚠️ Menyetujui Pivot Total',
        description: 'Anda setuju merombak desain menjadi model 3D tanpa biaya tambahan.',
        type: 'warning',
      });
    }

    if (memory.ghosted_triggered) {
      list.push({
        key: 'ghosted_triggered',
        label: '👻 Pernah Meng-ghosting',
        description: 'Klien ini memiliki riwayat mengabaikan pesan Anda selama beberapa hari.',
        type: 'default',
      });
    }

    return list;
  };

  const impressions = getImpressionsList(client.memory);

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      {/* Tab Controls */}
      <div className="flex border border-border/80 bg-slate-900/10 dark:bg-slate-950/40 rounded-xl p-0.5 w-full shrink-0">
        <Button
          variant={activeTab === 'brief' ? 'secondary' : 'ghost'}
          onClick={() => setActiveTab('brief')}
          className="flex-1 gap-2 h-9 text-xs font-semibold rounded-lg"
        >
          <Briefcase className="h-4 w-4" />
          Project Spec
        </Button>
        <Button
          variant={activeTab === 'client' ? 'secondary' : 'ghost'}
          onClick={() => setActiveTab('client')}
          className="flex-1 gap-2 h-9 text-xs font-semibold rounded-lg"
        >
          <User className="h-4 w-4" />
          Client Persona
        </Button>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-6">
        {activeTab === 'brief' ? (
          <>
            {/* Overview Panel */}
            <Card className="border-border bg-card/30 backdrop-blur-sm shadow-sm">
              <CardHeader className="p-5 pb-0 flex flex-row items-center gap-2">
                <Briefcase className="h-4.5 w-4.5 text-primary" />
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">Project Spec Overview</h3>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-foreground">{brief.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{brief.overview}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 flex items-center justify-center shrink-0">
                      <DollarSign className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Budget</span>
                      <span className="text-xs font-bold text-foreground">
                        ${brief.currentBudget}{' '}
                        {brief.currentBudget > brief.originalBudget && (
                          <span className="text-[9px] text-emerald-500 font-extrabold">(+${brief.currentBudget - brief.originalBudget})</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/15 flex items-center justify-center shrink-0">
                      <Calendar className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Deadline</span>
                      <span className="text-xs font-bold text-foreground truncate max-w-[100px]">{brief.deadline}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scope Checklist */}
            <Card className="border-border bg-card/30 backdrop-blur-sm shadow-sm">
              <CardHeader className="p-5 pb-0 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4.5 w-4.5 text-primary" />
                  <h3 className="font-extrabold text-sm text-foreground tracking-tight">Scope of Work</h3>
                </div>
                <Badge variant="secondary" className="h-5 text-[9px] font-bold">
                  {brief.scopeOfWork.length} Items
                </Badge>
              </CardHeader>
              <CardContent className="p-5">
                <ul className="space-y-2.5 text-xs">
                  {brief.scopeOfWork.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground leading-relaxed">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Milestones Tracking */}
            <Card className="border-border bg-card/30 backdrop-blur-sm shadow-sm">
              <CardHeader className="p-5 pb-0">
                <div className="flex items-between justify-between">
                  <h3 className="font-extrabold text-sm text-foreground tracking-tight">Milestones Progression</h3>
                  <span className="text-[10px] font-bold text-muted-foreground">{progressPct}%</span>
                </div>
                <Progress value={progressPct} indicatorClassName="bg-primary" className="h-1.5 mt-2" />
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {activeMilestones.map((milestone) => {
                  const isCompleted = milestone.status === 'completed';
                  return (
                    <div 
                      key={milestone.id} 
                      className={cn("flex items-center justify-between p-3 border rounded-xl bg-slate-900/5 dark:bg-slate-950/20 transition-all", {
                        "border-emerald-500/20 bg-emerald-500/5": isCompleted,
                        "border-border": !isCompleted
                      })}
                    >
                      <div className="space-y-0.5 max-w-[70%]">
                        <h4 className={cn("text-xs font-bold text-foreground truncate", { "line-through text-muted-foreground": isCompleted })}>
                          {milestone.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground truncate">{milestone.description}</p>
                        <div className="flex items-center gap-1.5 text-[9px] font-bold mt-1 text-muted-foreground">
                          <span className="text-foreground">${milestone.payoutAmount}</span>
                          <span>•</span>
                          <span>{milestone.dueDate}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isCompleted ? (
                          <Badge variant="success" className="gap-1 px-2 h-6 text-[9px]">
                            <CheckCircle className="h-3 w-3" />
                            Paid
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleMilestoneSubmit(milestone)}
                            disabled={client.projectPipelineStage !== 'execution' && client.projectPipelineStage !== 'feedback'}
                            className="text-[10px] h-7 px-2.5 font-bold gap-1 bg-primary hover:bg-opacity-95 text-primary-foreground rounded-lg"
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            Submit
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Risk Alert Panel */}
            {brief.riskIndicators.length > 0 && (
              <Card className="border-red-500/20 bg-red-500/5 backdrop-blur-sm shadow-sm animate-pulse-subtle">
                <CardHeader className="p-4 pb-0 flex flex-row items-center gap-1.5 text-red-500">
                  <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                  <h3 className="font-extrabold text-xs tracking-tight uppercase">Simulated Risk Triggers</h3>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  {brief.riskIndicators.map((risk, i) => (
                    <div key={i} className="text-[11px] leading-relaxed border-b border-red-500/10 pb-2 last:border-b-0 last:pb-0">
                      <div className="font-bold text-red-500 dark:text-red-400 capitalize">{risk.title}</div>
                      <div className="text-muted-foreground">{risk.description}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Bio & Details Card */}
            <Card className="border-border bg-card/30 backdrop-blur-sm shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 overflow-hidden border border-border flex items-center justify-center shrink-0 shadow-md">
                    {client.avatarUrl ? (
                      <img src={client.avatarUrl} alt={client.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-lg font-black text-primary-foreground">{initials}</span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-md text-foreground">{client.name}</h3>
                    <p className="text-xs text-muted-foreground">{client.role} at {client.company}</p>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-extrabold mt-1 text-primary border-primary/20 bg-primary/5">
                      {client.difficulty} Difficulty
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 border-t border-border/40 pt-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Client Bio</span>
                    <p className="text-muted-foreground leading-relaxed">{client.bio}</p>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Company Background</span>
                    <p className="text-muted-foreground leading-relaxed">{client.companyBackground}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Psychological Profile */}
            <Card className="border-border bg-card/30 backdrop-blur-sm shadow-sm">
              <CardHeader className="p-5 pb-0 flex flex-row items-center gap-2">
                <Brain className="h-4.5 w-4.5 text-primary" />
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">Psychological Profile</h3>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-3.5 text-xs font-semibold text-muted-foreground">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Agreeableness (Kelembutan Hati)</span>
                      <span className="text-foreground">{client.traits.agreeableness}/100</span>
                    </div>
                    <Progress value={client.traits.agreeableness} indicatorClassName="bg-emerald-500" className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Neuroticism (Sensitivitas Stres)</span>
                      <span className="text-foreground">{client.traits.neuroticism}/100</span>
                    </div>
                    <Progress value={client.traits.neuroticism} indicatorClassName="bg-red-500" className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Conscientiousness (Keteraturan & Tanggung Jawab)</span>
                      <span className="text-foreground">{client.traits.conscientiousness}/100</span>
                    </div>
                    <Progress value={client.traits.conscientiousness} indicatorClassName="bg-indigo-500" className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Openness (Keterbukaan Ide Baru)</span>
                      <span className="text-foreground">{client.traits.openness}/100</span>
                    </div>
                    <Progress value={client.traits.openness} indicatorClassName="bg-violet-500" className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span>Extraversion (Keahlian Bersosialisasi)</span>
                      <span className="text-foreground">{client.traits.extraversion}/100</span>
                    </div>
                    <Progress value={client.traits.extraversion} indicatorClassName="bg-amber-500" className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Communication Preferences & Quirks */}
            <Card className="border-border bg-card/30 backdrop-blur-sm shadow-sm">
              <CardHeader className="p-5 pb-0 flex flex-row items-center gap-2">
                <Languages className="h-4.5 w-4.5 text-primary" />
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">Communication Preference</h3>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Preferred Tone</span>
                    <p className="text-foreground font-medium">{client.communicationStyle.baseTone}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground">Preferred Language</span>
                    <div className="flex gap-1.5 mt-0.5">
                      <Badge variant="secondary" className="text-[9px] font-bold">
                        {client.communicationStyle.preferredLanguage === 'mixed' && 'Indonesian & English (Jaksel)'}
                        {client.communicationStyle.preferredLanguage === 'id' && 'Indonesian'}
                        {client.communicationStyle.preferredLanguage === 'en' && 'English'}
                      </Badge>
                    </div>
                  </div>

                  {client.communicationStyle.favoriteEmojis.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground">Favorite Emojis</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {client.communicationStyle.favoriteEmojis.map((emoji, i) => (
                          <span key={i} className="text-base select-none">{emoji}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {client.quirks.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold text-muted-foreground">Behavioral Quirks</span>
                      <ul className="space-y-1 text-xs">
                        {client.quirks.map((quirk, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-primary text-[10px] mt-0.5">•</span>
                            <span>{quirk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {client.redFlags.length > 0 && (
                    <div className="space-y-1 pt-2.5 border-t border-border/40">
                      <span className="text-[9px] uppercase font-bold text-red-500">Notable Red Flags</span>
                      <ul className="space-y-1 text-xs text-red-650 dark:text-red-400">
                        {client.redFlags.map((flag, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[10px] mt-0.5">•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Impressions Card */}
            <Card className="border-border bg-card/30 backdrop-blur-sm shadow-sm">
              <CardHeader className="p-5 pb-0 flex flex-row items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <h3 className="font-extrabold text-sm text-foreground tracking-tight">Kesan Terhadap Anda</h3>
              </CardHeader>
              <CardContent className="p-5">
                {impressions.length === 0 ? (
                  <div className="text-xs text-muted-foreground leading-relaxed italic text-center py-4 bg-slate-900/5 dark:bg-slate-950/20 border border-border/60 rounded-xl">
                    🧠 Klien sedang menilai profesionalisme Anda. Belum ada kesan khusus yang tercatat.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {impressions.map((imp) => (
                      <div 
                        key={imp.key} 
                        className={cn("p-3 rounded-xl border text-xs space-y-0.5", {
                          "bg-emerald-500/5 border-emerald-500/10": imp.type === 'success',
                          "bg-amber-500/5 border-amber-500/10": imp.type === 'warning',
                          "bg-slate-900/5 border-border": imp.type === 'default',
                        })}
                      >
                        <div className={cn("font-bold", {
                          "text-emerald-500 dark:text-emerald-400": imp.type === 'success',
                          "text-amber-500 dark:text-amber-400": imp.type === 'warning',
                          "text-foreground": imp.type === 'default',
                        })}>
                          {imp.label}
                        </div>
                        <div className="text-muted-foreground text-[11px] leading-relaxed">{imp.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectBriefPanel;
