'use client';

import * as React from 'react';
import { ActiveClientState } from '@/types/client';

interface TypingIndicatorProps {
  client: ActiveClientState;
}

export const TypingIndicator = ({ client }: TypingIndicatorProps) => {
  const initials = client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex gap-3 max-w-[70%] my-3 items-end">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-indigo-500 text-xs font-bold text-primary-foreground shadow-sm">
        {initials}
      </div>

      <div className="space-y-1">
        <div className="text-[10px] text-muted-foreground font-semibold px-1">
          {client.name} is typing
        </div>
        
        <div className="rounded-2xl p-3.5 bg-card border border-border rounded-tl-none shadow-sm flex items-center gap-1.5 h-9">
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
        </div>
      </div>
    </div>
  );
};
export default TypingIndicator;
