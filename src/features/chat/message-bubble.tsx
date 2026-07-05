'use client';

import * as React from 'react';
import { ChatMessage } from '@/types/chat';
import { ActiveClientState } from '@/types/client';
import { cn } from '@/utils/tailwind';
import { Play, Pause, Volume2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { speechService } from '@/utils/speechService';

interface MessageBubbleProps {
  message: ChatMessage;
  client: ActiveClientState;
}

export const MessageBubble = ({ message, client }: MessageBubbleProps) => {
  const { sender, text, timestamp, detectedIntent, isVoiceNote, voiceNoteDuration } = message;
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Audio Playback visual simulation
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / (voiceNoteDuration || 15));
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, voiceNoteDuration]);

  // Cancel speech on unmount if currently playing
  React.useEffect(() => {
    return () => {
      if (isPlaying) {
        speechService.cancel();
      }
    };
  }, [isPlaying]);

  const handlePlayToggle = () => {
    if (isPlaying) {
      speechService.cancel();
      setIsPlaying(false);
      setProgress(0);
    } else {
      setIsPlaying(true);
      setProgress(0);

      // Dynamically adjust speed/pitch based on client identity and emotional state
      let speed = 1.0;
      let pitch = 1.0;

      const mood = client.currentState.activeMood;
      if (mood === 'furious') {
        speed = 1.2;
        pitch = 1.15;
      } else if (mood === 'anxious') {
        speed = 1.25;
        pitch = 1.1;
      } else if (mood === 'annoyed') {
        speed = 0.95;
        pitch = 0.9;
      } else if (client.id === 'kevin_cooper') {
        speed = 0.85; // Slower pace for the elderly baker
        pitch = 0.95;
      }

      speechService.speak(
        text,
        client.communicationStyle.preferredLanguage,
        speed,
        pitch,
        () => {
          setIsPlaying(false);
          setProgress(100);
        }
      );
    }
  };

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  if (sender === 'system') {
    return (
      <div className="flex justify-center my-3">
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs px-4 py-2 rounded-xl max-w-lg text-center font-medium shadow-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{text}</span>
        </div>
      </div>
    );
  }

  const isUser = sender === 'user';

  return (
    <div className={cn("flex gap-3 max-w-[80%] sm:max-w-[70%] my-2.5", {
      "ml-auto flex-row-reverse": isUser,
    })}>
      {/* Avatar (only for client) */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-indigo-500 text-xs font-bold text-primary-foreground shadow-sm overflow-hidden">
          {client.avatarUrl ? (
            <img src={client.avatarUrl} alt={client.name} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
      )}

      <div className="space-y-1 flex-1">
        {/* Header Metadata */}
        <div className={cn("flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold px-1", {
          "justify-end": isUser,
        })}>
          <span>{isUser ? 'You (Freelancer)' : client.name}</span>
          <span>•</span>
          <span>{formattedTime}</span>
        </div>

        {/* Message Content Bubble */}
        <div className={cn("rounded-2xl p-3.5 shadow-sm text-sm leading-relaxed relative border", {
          "bg-primary text-primary-foreground border-transparent rounded-tr-none ml-auto max-w-max": isUser,
          "bg-card text-foreground border-border rounded-tl-none": !isUser,
        })}>
          {isVoiceNote ? (
            /* Voice Note Simulation Visualizer */
            <div className="flex items-center gap-3 min-w-[200px]">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handlePlayToggle}
                className={cn("h-8 w-8 rounded-full border shrink-0 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800", {
                  "text-primary-foreground border-primary-foreground/20": isUser,
                  "text-foreground border-border": !isUser,
                })}
              >
                {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5 fill-current ml-0.5" />}
              </Button>

              <div className="flex-1 space-y-1">
                {/* Audio Wave Bars */}
                <div className="flex items-center gap-[3px] h-6">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const barHeight = Math.abs(Math.sin(i * 0.4)) * 16 + 4; // Mock waveform data
                    const isPlayed = progress > (i / 24) * 100;
                    return (
                      <div
                        key={i}
                        className={cn("w-[3px] rounded-full transition-colors", {
                          "bg-primary-foreground/40": isUser && !isPlayed,
                          "bg-primary-foreground": isUser && isPlayed,
                          "bg-muted-foreground/30": !isUser && !isPlayed,
                          "bg-primary": !isUser && isPlayed,
                        })}
                        style={{ height: `${barHeight}px` }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[9px] opacity-70">
                  <span>{isPlaying ? 'Playing Voice Note...' : 'Voice Note Playback'}</span>
                  <span>{voiceNoteDuration}s</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <p className="whitespace-pre-wrap flex-1">{text}</p>
              {!isUser && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayToggle}
                  className={cn("h-6 w-6 rounded-full shrink-0 p-0 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800", {
                    "text-primary bg-primary/10": isPlaying
                  })}
                  title="Listen to message"
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </Button>
              )}
            </div>
          )}

          {/* Training Mode: Detected Intent Helper Tag */}
          {detectedIntent && isUser && (
            <div className="absolute -bottom-2 -left-1 flex items-center gap-1 bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 border border-border text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm uppercase tracking-wider scale-90">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Intent: {detectedIntent.replace(/_/g, ' ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper alert icon used inside bubble
const AlertCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
export default MessageBubble;
