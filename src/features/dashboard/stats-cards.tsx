'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ActiveClientState } from '@/types/client';
import { Target, Heart, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsCardsProps {
  clients: ActiveClientState[];
}

export const StatsCards = ({ clients }: StatsCardsProps) => {
  // Aggregate stats
  const activeClients = clients.filter(
    (c) => c.projectPipelineStage !== 'onboarding' && c.projectPipelineStage !== 'completed' && c.projectPipelineStage !== 'terminated'
  );

  const completedClients = clients.filter((c) => c.projectPipelineStage === 'completed');
  const totalCompleted = completedClients.length;

  const totalClients = clients.length;
  
  // Average health score
  const avgHealth = clients.length > 0 
    ? Math.round(clients.reduce((acc, curr) => acc + curr.healthScore, 0) / totalClients)
    : 0;

  // Active risk indicators count
  const activeRisks = clients.reduce((acc, c) => {
    // We would fetch brief risks, but since it's client-scoped, we can just aggregate active red flags or average patience
    const lowPatience = c.currentState.patience < 40 ? 1 : 0;
    return acc + lowPatience;
  }, 0);

  const successRate = totalCompleted > 0 
    ? Math.round((totalCompleted / clients.filter(c => c.projectPipelineStage === 'completed' || c.projectPipelineStage === 'terminated').length || 1) * 100)
    : 100;

  const stats = [
    {
      title: 'Average Health Score',
      value: `${avgHealth}%`,
      description: 'Overall client satisfaction',
      icon: Heart,
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      gradient: 'from-rose-500/5 to-transparent'
    },
    {
      title: 'Active Pipelines',
      value: activeClients.length.toString(),
      description: 'Conversations in progress',
      icon: Target,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      gradient: 'from-indigo-500/5 to-transparent'
    },
    {
      title: 'Simulation Success Rate',
      value: `${successRate}%`,
      description: 'Completed vs Terminated',
      icon: TrendingUp,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      gradient: 'from-emerald-500/5 to-transparent'
    },
    {
      title: 'Clients on Edge',
      value: activeRisks.toString(),
      description: 'Patience score under 40%',
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      gradient: 'from-amber-500/5 to-transparent'
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="relative overflow-hidden border-border bg-card/60 backdrop-blur-md">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {stat.title}
                </p>
                <p className="text-3xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
export default StatsCards;
