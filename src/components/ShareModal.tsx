import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Send,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShareModal: React.FC = () => {
  const { isShareModalOpen, closeShareModal, shareTargetFile, language, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isShareModalOpen || !shareTargetFile) return null;

  const isBn = language === 'bn';
  const directUrl = `${window.location.origin}${window.location.pathname}?file=${shareTargetFile.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    showToast(isBn ? 'শেয়ার লিংক কপি করা হয়েছে!' : 'Share link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(
    `Download ${shareTargetFile.title} (${shareTargetFile.fileSize}) for ${shareTargetFile.platform.toUpperCase()} on ShareVault:`
  );
  const encodedUrl = encodeURIComponent(directUrl);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodedUrl}&bgcolor=020617&color=38bdf8`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/40 bg-slate-950 p-0.5 shadow shrink-0">
              <img
                src="/src/assets/images/sharevault_bd_logo_1790584102515.jpg"
                alt="ShareVault BD"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{isBn ? 'ফাইলের আলাদা লিংক শেয়ার' : 'Share File Direct Link'}</span>
              </h3>
              <p className="text-[11px] text-cyan-300 truncate max-w-[200px]">
                {shareTargetFile.title}
              </p>
            </div>
          </div>

          <button
            onClick={closeShareModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Link Input Box with 1-Click Copy */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {isBn ? 'ইউনিক পার্মালিংক' : 'Unique Permalink'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={directUrl}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'কপি' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="pt-2">
            <span className="block text-xs text-slate-400 font-medium mb-2">
              {isBn ? 'সোশ্যাল মিডিয়ায় শেয়ার করুন:' : 'Share via Social Apps:'}
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/60 flex items-center justify-center gap-1.5 font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-sky-950/60 border border-sky-800/60 text-sky-300 hover:bg-sky-900/60 flex items-center justify-center gap-1.5 font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>

              <button
                onClick={() => setShowQr(!showQr)}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 font-medium transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>{isBn ? 'QR কোড' : 'QR Code'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          {showQr && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <p className="text-xs text-slate-300 mb-2">
                {isBn ? 'মোবাইল ক্যামেরা দিয়ে স্ক্যান করুন:' : 'Scan with mobile camera to download:'}
              </p>
              <div className="inline-block p-2 bg-slate-900 rounded-xl border border-cyan-800/50">
                <img
                  src={qrImageUrl}
                  alt="QR Code"
                  className="w-36 h-36 mx-auto rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
