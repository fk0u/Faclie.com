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
  FileCode
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

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-1">
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
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-foreground tracking-tight">Milestones Progression</h3>
            <span className="text-[10px] font-bold text-muted-foreground">{progressPct}%</span>
          </div>
          <Progress value={progressPct} indicatorClassName="bg-primary" className="h-1.5 mt-2" />
        </CardHeader>
        <CardContent className="p-5 space-y-3">
          {activeMilestones.map((milestone) => {
            const isCompleted = milestone.status === 'completed';
            const isPending = milestone.status === 'pending';
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
    </div>
  );
};
export default ProjectBriefPanel;
