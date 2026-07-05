'use client';

import * as React from 'react';
import { useClientStore } from '@/store/useClientStore';
import { StatsCards } from '@/features/dashboard/stats-cards';
import { ClientCard } from '@/features/dashboard/client-card';
import { PipelineBoard } from '@/features/dashboard/pipeline-board';
import { Button } from '@/components/ui/button';
import { Grid, List, Layers, Users, Sparkles, UserPlus } from 'lucide-react';
import Navbar from '@/components/shared/navbar';
import { ClientCreator } from '@/features/clients/client-creator';

export default function DashboardPage() {
  const { clients, initializeClients } = useClientStore();
  const [viewType, setViewType] = React.useState<'grid' | 'list'>('grid');
  const [dashboardTab, setDashboardTab] = React.useState<'clients' | 'pipeline'>('clients');
  const [isCreatorOpen, setIsCreatorOpen] = React.useState(false);

  // Trigger client data initialization on mount
  React.useEffect(() => {
    initializeClients();
  }, [initializeClients]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-slate-900/5 dark:bg-slate-900/40 p-6 sm:p-8">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="h-40 w-40 text-primary" />
          </div>
          <div className="max-w-2xl space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Welcome back, Freelancer.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Selamat datang di Faclie Simulator. Asah kemampuan negosiasi, kelola batasan scope kerja, 
              dan hadapi berbagai tipe red flags klien dalam simulasi interaktif yang realistis.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <StatsCards clients={clients} />

        {/* Dashboard Tabs & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/80 pb-4 gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={dashboardTab === 'clients' ? 'secondary' : 'ghost'}
              onClick={() => setDashboardTab('clients')}
              className="gap-2 h-9 text-xs sm:text-sm font-semibold"
            >
              <Users className="h-4 w-4" />
              Clients Personas
            </Button>
            <Button
              variant={dashboardTab === 'pipeline' ? 'secondary' : 'ghost'}
              onClick={() => setDashboardTab('pipeline')}
              className="gap-2 h-9 text-xs sm:text-sm font-semibold"
            >
              <Layers className="h-4 w-4" />
              Pipeline Board
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsCreatorOpen(true)}
              className="gap-2 h-9 text-xs sm:text-sm font-bold border-dashed border-primary/45 hover:border-primary text-primary hover:bg-primary/5 ml-auto sm:ml-2"
            >
              <UserPlus className="h-4 w-4" />
              Create Custom Client
            </Button>
          </div>

          {/* Grid/List View Toggles (Only relevant for Clients tab) */}
          {dashboardTab === 'clients' && (
            <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 self-end sm:self-auto">
              <Button
                variant={viewType === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewType('grid')}
                className="h-8 w-8 rounded-md"
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewType('list')}
                className="h-8 w-8 rounded-md"
                title="List View"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Dynamic Display Area */}
        {dashboardTab === 'clients' ? (
          viewType === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {clients.map((client) => (
                <ClientCard key={client.id} client={client} isGridView={true} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {clients.map((client) => (
                <ClientCard key={client.id} client={client} isGridView={false} />
              ))}
            </div>
          )
        ) : (
          <PipelineBoard clients={clients} />
        )}
      </main>

      <ClientCreator isOpen={isCreatorOpen} onClose={() => setIsCreatorOpen(false)} />
    </div>
  );
}
