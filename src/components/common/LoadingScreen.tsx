import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-paper z-50">
      <div className="relative flex items-center justify-center w-16 h-16 bg-surface border border-ink shadow-sm animate-pulse-soft">
        <Loader2 className="w-8 h-8 text-ink animate-spin stroke-[1px]" />
      </div>

      <div className="mt-8 text-center animate-fade-in">
        <h2 className="text-sm font-serif text-ink tracking-[0.4em] uppercase font-light opacity-80">
          Mnemo<span className="font-bold">AI</span>
        </h2>
        <p className="mt-2 text-ink-mute text-[9px] font-medium tracking-[0.2em] uppercase opacity-40">
          Loading
        </p>
      </div>
    </div>
  );
}
