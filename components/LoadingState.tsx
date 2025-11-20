import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC<{ text?: string }> = ({ text = "Consulting the Fates..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
        <Loader2 size={64} className="text-emerald-400 animate-spin relative z-10" />
      </div>
      <h2 className="mt-8 text-2xl font-serif text-emerald-200/80 font-light tracking-widest uppercase">{text}</h2>
      <p className="mt-2 text-slate-500 text-sm">Analyzing boon synergies and hammer configurations</p>
    </div>
  );
};
