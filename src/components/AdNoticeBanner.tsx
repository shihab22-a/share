import React, { useState } from 'react';
import { ExternalLink, Info, X, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdNoticeBanner: React.FC = () => {
  const { language } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const isBn = language === 'bn';

  if (dismissed) return null;

  return (
    <div className="bg-slate-900/90 border-y border-cyan-900/40 px-4 py-2.5 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-slate-300">
          <div className="p-1 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 shrink-0">
            <Info className="w-3.5 h-3.5" />
          </div>
          <div>
            {isBn ? (
              <span>
                <strong className="text-cyan-300 font-semibold">ডাউনলোড নির্দেশিকা:</strong> প্রথম ক্লিকে স্পনসর এডভার্টাইজমেন্ট ওপেন হবে, যা সাইটের সার্ভার ব্যয় বহন করতে সাহায্য করে। এরপর <strong className="text-emerald-400 font-semibold">২য় ক্লিকে</strong> ফাইল সরাসরি হাই-স্পিডে ডাউনলোড শুরু হবে।
              </span>
            ) : (
              <span>
                <strong className="text-cyan-300 font-semibold">Download Guide:</strong> 1st click opens our sponsor page to keep hosting free. Then <strong className="text-emerald-400 font-semibold">2nd click</strong> immediately starts your file download with resume support.
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 shrink-0 cursor-pointer"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
