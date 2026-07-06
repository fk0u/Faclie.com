'use client';

import * as React from 'react';
import { ActiveClientState } from '@/types/client';
import { ChatSession, ChatMessage } from '@/types/chat';
import { useChatStore } from '@/store/useChatStore';
import { useClientStore } from '@/store/useClientStore';
import { useProjectStore } from '@/store/useProjectStore';
import { handleUserMessage } from '@/services/chatEngine';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { Button } from '@/components/ui/button';
import { exportChatToPDF } from '@/utils/pdfExporter';
import { audioService } from '@/utils/audioService';
import { 
  Send, 
  Mic, 
  VolumeX, 
  Volume2, 
  Download, 
  Sparkles, 
  AlertTriangle,
  RotateCcw,
  Play
} from 'lucide-react';
import { cn } from '@/utils/tailwind';
import Link from 'next/link';

interface ChatWindowProps {
  client: ActiveClientState;
}

export const ChatWindow = ({ client }: ChatWindowProps) => {
  const { id } = client;
  const session = useChatStore((state) => state.sessions[id]) || {
    clientId: id,
    messages: [],
    isTyping: false,
  };

  const updateClientState = useClientStore((state) => state.updateClientState);
  const triggerRiskIndicator = useProjectStore((state) => state.triggerRiskIndicator);
  const addMessage = useChatStore((state) => state.addMessage);
  
  const soundEnabled = useChatStore((state) => state.soundEnabled);
  const toggleSound = useChatStore((state) => state.toggleSound);

  const [inputText, setInputText] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages, session.isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const msg = inputText;
    setInputText('');

    if (soundEnabled) {
      audioService.playClick();
    }

    await handleUserMessage(id, msg);
  };

  // Simulated Voice Note: Types a freelancer transcription
  const handleSimulateVoiceNote = () => {
    setInputText('(Freelancer voice note: Halo Pak/Bu, saya sudah memperbarui wireframe halaman depannya. Tolong dicek di link figma yang baru ya.)');
  };

  // Surprise Event Handler
  const handleTriggerSurpriseEvent = () => {
    let surpriseMessage = "";
    let riskTitle = "";
    let riskDesc = "";

    if (id === 'linda_chen') {
      surpriseMessage = "Hey! 😅 VCs just looked at our logo, and they think it feels too old-school. Can we completely switch to a neon cyberpunk 3D grid layout by tomorrow morning? VCs will love it! 🚀";
      riskTitle = "Sudden VC Logo/Vibe Redesign";
      riskDesc = "Linda is demanding a total 3D cyberpunk overhaul based on sudden VC feedback.";
    } else if (id === 'budi_hartono') {
      surpriseMessage = "Halo. Toko saya kebanjiran semalam, jadi modalnya mau saya tarik dulu buat renovasi bangunan. Sisa pembayaran web ini pending dulu ya 2 bulan. Tapi codingannya tolong diluncurkan besok pagi biar usaha tetep jalan.";
      riskTitle = "Severe Payment Delay Request";
      riskDesc = "Budi requested a 2-month invoice delay while demanding launch release immediately.";
    } else if (id === 'sarah_jenkins') {
      surpriseMessage = "GM GM! 🚀 Crypto just pumped and Twitter is going wild for autonomous AI agents. Let's dump the landing page game list and build an AI chatbot layout that operates in 3D! LFG! 📈💎";
      riskTitle = "Crypto AI Trend Pivot";
      riskDesc = "Sarah demanded a major AI chatbot layout replacement matching Twitter hype.";
    } else {
      surpriseMessage = "Hi, our marketing team moved our campaign launch to this Friday. We need this completed in 48 hours instead of 2 weeks. Please prioritize, no extra budget though.";
      riskTitle = "Aggressive Launch Compression";
      riskDesc = "Client compressed project deadline to 48 hours without extra compensation.";
    }

    // Add Client message
    addMessage(id, {
      sender: 'client',
      text: surpriseMessage,
    });

    // Shift Client urgency to maximum and drop patience
    updateClientState(id, {
      urgency: 95,
      patience: Math.max(10, client.currentState.patience - 25),
    });

    // Trigger Risk Indicator
    triggerRiskIndicator(id, {
      title: riskTitle,
      description: riskDesc,
      severity: 'high',
    });

    // Optional ambient alert sound
    if (soundEnabled) {
      audioService.playAlert();
    }
  };

  const handleExportPDF = () => {
    exportChatToPDF(client, session.messages, session.scoreCard);
  };

  // Helper for rendering meter percentages
  const getMeterColor = (val: number, type: 'satisfaction' | 'patience' | 'urgency') => {
    if (type === 'urgency') {
      if (val > 80) return 'text-red-500 bg-red-500/10';
      if (val > 50) return 'text-amber-500 bg-amber-500/10';
      return 'text-emerald-500 bg-emerald-500/10';
    }
    // satisfaction or patience
    if (val > 75) return 'text-emerald-500 bg-emerald-500/10';
    if (val > 45) return 'text-amber-500 bg-amber-500/10';
    return 'text-red-500 bg-red-500/10 animate-pulse';
  };

  return (
    <div className="flex flex-col h-[650px] border border-border rounded-2xl bg-card/45 backdrop-blur-md overflow-hidden shadow-lg relative">
      {/* Header Info & Diagnostic Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border/80 bg-slate-900/10 dark:bg-slate-950/20 gap-3 shrink-0">
        <div>
          <h2 className="text-md font-bold text-foreground">{client.name}</h2>
          <p className="text-xs text-muted-foreground">{client.role} at {client.company}</p>
        </div>

        {/* Real-time Diagnostic Meters */}
        <div className="flex items-center gap-3 text-xs w-full sm:w-auto">
          <div className={cn("px-2.5 py-1 rounded-xl font-bold flex flex-col items-center min-w-[70px]", getMeterColor(client.currentState.satisfaction, 'satisfaction'))}>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Satisfaction</span>
            <span className="text-sm font-extrabold">{client.currentState.satisfaction}%</span>
          </div>
          <div className={cn("px-2.5 py-1 rounded-xl font-bold flex flex-col items-center min-w-[70px]", getMeterColor(client.currentState.patience, 'patience'))}>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Patience</span>
            <span className="text-sm font-extrabold">{client.currentState.patience}%</span>
          </div>
          <div className={cn("px-2.5 py-1 rounded-xl font-bold flex flex-col items-center min-w-[70px]", getMeterColor(client.currentState.urgency, 'urgency'))}>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Urgency</span>
            <span className="text-sm font-extrabold">{client.currentState.urgency}%</span>
          </div>
        </div>

        {/* Export & Controls */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleSound} className="h-8 w-8 text-muted-foreground" title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}>
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-1.5 text-xs font-semibold h-8">
            <Download className="h-3.5 w-3.5" />
            PDF Log
          </Button>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-900/5 dark:bg-slate-950/10">
        {session.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 p-8">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Mulai Percakapan</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Kirim sapaan awal untuk memicu briefing spesifikasi proyek dari klien.
            </p>
          </div>
        ) : (
          session.messages.map((message) => (
            <MessageBubble key={message.id} message={message} client={client} />
          ))
        )}

        {/* Dynamic Client Typing Bubble */}
        {session.isTyping && <TypingIndicator client={client} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Scorecard Overlay when completed */}
      {client.projectPipelineStage === 'completed' && session.scoreCard && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-5 animate-fade-in">
          <div className="bg-primary/20 border border-primary/40 rounded-full p-4 text-primary">
            <Sparkles className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold tracking-tight text-white">Simulation Completed!</h2>
            <p className="text-xs text-slate-400">Berikut penilaian performa negosiasi dan manajemen scope kerja Anda:</p>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-md bg-slate-900/50 p-4 border border-slate-800 rounded-xl text-white">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Professionalism</span>
              <span className="text-lg font-black text-indigo-400">{session.scoreCard.professionalism}%</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Scope Mgt</span>
              <span className="text-lg font-black text-amber-400">{session.scoreCard.scopeManagement}%</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Negotiation</span>
              <span className="text-lg font-black text-emerald-400">{session.scoreCard.negotiationSkill}%</span>
            </div>
          </div>

          <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-xl max-w-md text-xs text-slate-300 leading-relaxed text-left">
            <strong>Evaluasi:</strong> {session.scoreCard.feedbackText}
          </div>

          <Link href="/dashboard">
            <Button size="sm">Kembali ke Dashboard</Button>
          </Link>
        </div>
      )}

      {/* Input Action Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-border/80 bg-slate-900/10 dark:bg-slate-950/20 flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* Simulated Voice note text injector */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSimulateVoiceNote}
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
            title="Simulate sending a Voice Note transcription"
          >
            <Mic className="h-4.5 w-4.5" />
          </Button>

          {/* Core Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={client.projectPipelineStage === 'completed'}
            placeholder="Type your professional reply here... (e.g. Greeting, price proposal, draft links)"
            className="flex-1 bg-background border border-input rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring text-foreground disabled:opacity-50"
          />

          <Button type="submit" size="icon" disabled={!inputText.trim()} className="h-9 w-9 shrink-0 bg-primary hover:bg-opacity-95 text-primary-foreground rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Simulator controls: Surprise Event Injector */}
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-muted-foreground font-medium">
            Pro Tip: Gunakan kata kunci &quot;out of scope&quot; atau &quot;extra fee&quot; untuk menolak kerjaan tambahan.
          </span>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleTriggerSurpriseEvent}
            className="h-6 text-[10px] text-amber-500 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15 gap-1 shrink-0 font-bold"
          >
            <AlertTriangle className="h-3 w-3" />
            Trigger Surprise Event
          </Button>
        </div>
      </form>
    </div>
  );
};
export default ChatWindow;
