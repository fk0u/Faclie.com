'use client';

import { ActiveClientState } from '@/types/client';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useClientStore } from '@/store/useClientStore';
import { useChatStore } from '@/store/useChatStore';
import { useProjectStore } from '@/store/useProjectStore';
import Link from 'next/link';
import { 
  Flame, 
  Smile, 
  Meh, 
  Frown, 
  HelpCircle, 
  Ghost,
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';

interface ClientCardProps {
  client: ActiveClientState;
  isGridView: boolean;
}

export const ClientCard = ({ client, isGridView }: ClientCardProps) => {
  const adjustDifficulty = useClientStore((state) => state.adjustDifficulty);
  const resetClient = useClientStore((state) => state.resetClient);
  const clearSession = useChatStore((state) => state.clearSession);
  const resetProject = useProjectStore((state) => state.resetProject);

  const { id, name, role, company, difficulty, bio, currentState, healthScore, projectPipelineStage } = client;

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm(`Reset simulasi dengan ${name}? Seluruh riwayat chat akan dihapus.`)) {
      resetClient(id);
      clearSession(id);
      resetProject(id);
    }
  };

  const getDifficultyColor = (diff: typeof difficulty) => {
    switch (diff) {
      case 'easy': return 'success';
      case 'medium': return 'secondary';
      case 'hard': return 'warning';
      case 'nightmare': return 'destructive';
      default: return 'default';
    }
  };

  const getMoodIcon = (mood: typeof currentState.activeMood) => {
    const iconClass = "h-4 w-4 mr-1";
    switch (mood) {
      case 'pleased':
        return <span className="flex items-center text-emerald-500 font-semibold"><Smile className={iconClass} /> Pleased</span>;
      case 'neutral':
        return <span className="flex items-center text-slate-400 font-semibold"><Meh className={iconClass} /> Neutral</span>;
      case 'annoyed':
        return <span className="flex items-center text-amber-500 font-semibold"><Frown className={iconClass} /> Annoyed</span>;
      case 'anxious':
        return <span className="flex items-center text-indigo-400 font-semibold"><HelpCircle className={iconClass} /> Anxious</span>;
      case 'furious':
        return <span className="flex items-center text-red-500 font-semibold animate-pulse"><Flame className={iconClass} /> Furious</span>;
      case 'ghosting':
        return <span className="flex items-center text-violet-400 font-semibold"><Ghost className={iconClass} /> Ghosting</span>;
      default:
        return <span className="flex items-center text-slate-400"><Meh className={iconClass} /> Neutral</span>;
    }
  };

  const getHealthColor = (score: number) => {
    if (score > 75) return 'bg-emerald-500';
    if (score > 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Get initials for profile picture replacement
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const isNew = projectPipelineStage === 'onboarding';

  if (!isGridView) {
    // List View Layout
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-border rounded-xl bg-card/40 backdrop-blur-sm gap-4 transition-all hover:bg-card/70">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-500 font-bold text-primary-foreground shadow-inner">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-foreground">{name}</h3>
              <span className="text-xs text-muted-foreground">• {role} at {company}</span>
              <Badge variant={getDifficultyColor(difficulty)} className="capitalize">{difficulty}</Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1 max-w-xl">{bio}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
          <div className="flex flex-col gap-1 w-28 sm:w-32">
            <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
              <span>Client Health</span>
              <span>{healthScore}%</span>
            </div>
            <Progress value={healthScore} indicatorClassName={getHealthColor(healthScore)} className="h-1.5" />
          </div>

          <div className="text-xs">{getMoodIcon(currentState.activeMood)}</div>

          <div className="flex items-center gap-2">
            {isNew && (
              <select
                value={difficulty}
                onChange={(e) => adjustDifficulty(id, e.target.value as 'easy' | 'medium' | 'hard' | 'nightmare')}
                className="text-xs bg-secondary border border-border text-foreground rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="nightmare">Nightmare</option>
              </select>
            )}
            
            <Link href={`/simulator/${id}`} className="block">
              <Button size="sm" className="gap-1.5">
                <Play className="h-3 w-3 fill-current" />
                {isNew ? 'Start' : 'Resume'}
              </Button>
            </Link>

            {!isNew && (
              <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Reset Simulation">
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout
  return (
    <Card className="flex flex-col h-full border-border bg-card/30 backdrop-blur-sm transition-all hover:bg-card/50 hover:shadow-md group">
      <CardHeader className="p-5 pb-0 flex flex-row items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-500 font-extrabold text-primary-foreground shadow-md">
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-xs text-muted-foreground">{role}, {company}</p>
          </div>
        </div>
        <Badge variant={getDifficultyColor(difficulty)} className="capitalize shrink-0">{difficulty}</Badge>
      </CardHeader>

      <CardContent className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 min-h-[54px]">{bio}</p>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pipeline Stage</span>
              <div className="font-semibold text-foreground capitalize truncate">{projectPipelineStage}</div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Mood</span>
              <div className="font-semibold truncate">{getMoodIcon(currentState.activeMood)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 mt-5">
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Client Health Score</span>
            <span className="text-foreground">{healthScore}%</span>
          </div>
          <Progress value={healthScore} indicatorClassName={getHealthColor(healthScore)} className="h-1.5" />
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 border-t border-border/40 flex items-center justify-between gap-2 mt-auto bg-slate-900/5 dark:bg-slate-950/20 rounded-b-xl">
        {isNew ? (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>Diff:</span>
            <select
              value={difficulty}
              onChange={(e) => adjustDifficulty(id, e.target.value as 'easy' | 'medium' | 'hard' | 'nightmare')}
              className="bg-transparent border-none font-semibold text-foreground focus:outline-none cursor-pointer capitalize"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="nightmare">Nightmare</option>
            </select>
          </div>
        ) : (
          <div className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
            {healthScore < 40 && <AlertTriangle className="h-3 w-3 shrink-0" />}
            <span>{healthScore < 40 ? 'Critical' : 'In Progress'}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-3">
          {!isNew && (
            <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0" title="Reset Simulation">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          )}

          <Link href={`/simulator/${id}`} className="block">
            <Button size="sm" className="gap-1 px-3">
              <Play className="h-3 w-3 fill-current" />
              {isNew ? 'Start Sim' : 'Resume'}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
export default ClientCard;
