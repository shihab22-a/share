import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-60 max-w-sm flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl text-slate-100 text-xs font-medium backdrop-blur-md animate-fade-in">
      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
};
