'use client';

import { ActiveClientState } from '@/types/client';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageCircle, AlertCircle, CheckCircle2, Ban } from 'lucide-react';

interface PipelineBoardProps {
  clients: ActiveClientState[];
}

export const PipelineBoard = ({ clients }: PipelineBoardProps) => {
  // Columns definition
  const columns = [
    {
      id: 'briefing',
      title: 'Briefing',
      description: 'Requirements gathering',
      stages: ['onboarding', 'briefing'],
      color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500',
      icon: Sparkles
    },
    {
      id: 'negotiation',
      title: 'Negotiation',
      description: 'Pricing & agreements',
      stages: ['negotiation'],
      color: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
      icon: MessageCircle
    },
    {
      id: 'execution',
      title: 'Execution',
      description: 'Active design & build',
      stages: ['execution'],
      color: 'bg-sky-500/10 border-sky-500/20 text-sky-500',
      icon: AlertCircle
    },
    {
      id: 'review',
      title: 'Review & Invoice',
      description: 'Revisions & payout',
      stages: ['feedback', 'payment'],
      color: 'bg-purple-500/10 border-purple-500/20 text-purple-500',
      icon: CheckCircle2
    },
    {
      id: 'closed',
      title: 'Closed',
      description: 'Archived simulations',
      stages: ['completed', 'terminated'],
      color: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
      icon: Ban
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-5 overflow-x-auto pb-4">
      {columns.map((col) => {
        const ColIcon = col.icon;
        const colClients = clients.filter((c) => col.stages.includes(c.projectPipelineStage));

        return (
          <div key={col.id} className="flex flex-col min-w-[220px] rounded-xl border border-border bg-slate-950/10 dark:bg-slate-900/10 p-3 min-h-[300px]">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/40">
              <div className="flex items-center gap-1.5">
                <div className={`p-1 rounded-md border ${col.color}`}>
                  <ColIcon className="h-3.5 w-3.5" />
                </div>
                <h4 className="font-bold text-xs text-foreground tracking-tight">{col.title}</h4>
              </div>
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-bold">
                {colClients.length}
              </Badge>
            </div>
            
            <p className="text-[10px] text-muted-foreground mb-3 font-medium">
              {col.description}
            </p>

            {/* Client Cards inside Column */}
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[450px] pr-1">
              {colClients.length === 0 ? (
                <div className="flex flex-col items-center justify-center border border-dashed border-border/60 rounded-lg p-6 flex-1 text-[10px] text-muted-foreground font-medium">
                  No clients here
                </div>
              ) : (
                colClients.map((client) => {
                  const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  const healthColor = client.healthScore > 70 
                    ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' 
                    : client.healthScore > 40
                      ? 'border-amber-500/20 text-amber-500 bg-amber-500/5'
                      : 'border-red-500/20 text-red-500 bg-red-500/5 animate-pulse';

                  return (
                    <Link key={client.id} href={`/simulator/${client.id}`} className="block">
                      <Card className="p-3 border-border hover:border-primary/40 bg-card/60 hover:bg-card hover:shadow-sm transition-all cursor-pointer group">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {client.name}
                          </span>
                          <span className="text-[9px] text-muted-foreground shrink-0 capitalize">
                            {client.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-muted-foreground truncate mb-2">
                          {client.company}
                        </p>

                        <div className="flex items-center justify-between text-[9px] font-semibold">
                          <span className={`px-1.5 py-0.5 rounded border capitalize ${healthColor}`}>
                            Health: {client.healthScore}%
                          </span>
                          <span className="text-muted-foreground italic capitalize">
                            {client.currentState.activeMood}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default PipelineBoard;
