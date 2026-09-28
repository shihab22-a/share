import React from 'react';
import {
  Download,
  Share2,
  Bookmark,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  Star,
  Monitor,
  Smartphone,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AppFile } from '../types';
import { useApp } from '../context/AppContext';
import { useDownload } from '../context/DownloadContext';
import { DynamicIcon } from './DynamicIcon';

interface FileCardProps {
  file: AppFile;
}

export const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const { language, toggleBookmark, isBookmarked, setSelectedFile, openShareModal, recordAdClick, showToast } =
    useApp();
  const { handleDownloadClick, adProgressMap } = useDownload();

  const isBn = language === 'bn';
  const bookmarked = isBookmarked(file.id);
  const isAdStepDone = !!adProgressMap[file.id];

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = handleDownloadClick(file);
    if (result.isAdStep) {
      recordAdClick();
      showToast(
        isBn
          ? 'ধাপ ১ সম্পন্ন: স্পনসর পেজ খোলা হয়েছে। এখন ২য় ক্লিকে ডাউনলোড শুরু হবে।'
          : 'Step 1 complete: Sponsor page opened. Click Download again to start!'
      );
    } else {
      showToast(
        isBn
          ? `${file.title} ডাউনলোড শুরু হয়েছে!`
          : `${file.title} download started!`
      );
    }
  };

  const formatDownloads = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div
      onClick={() => setSelectedFile(file)}
      className="group relative flex flex-col justify-between rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all duration-200 cursor-pointer overflow-hidden p-5 shadow-lg shadow-slate-950/40"
    >
      {/* Top Row: Icon, Platform & Actions */}
      <div>
        <div className="flex items-start justify-between gap-3">
          {/* App Icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:scale-105 transition-all shadow-inner">
              <DynamicIcon name={file.icon} platform={file.platform} className="w-6 h-6" />
            </div>

            <div>
              {/* Platform & Category (Unboxed quiet text metadata) */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                {file.platform === 'windows' && (
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Monitor className="w-3 h-3" />
                    <span>Windows</span>
                  </span>
                )}
                {file.platform === 'android' && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Smartphone className="w-3 h-3" />
                    <span>Android</span>
                  </span>
                )}
                {file.platform === 'multi' && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Layers className="w-3 h-3" />
                    <span>Multi-OS</span>
                  </span>
                )}
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="capitalize">{file.category}</span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mt-0.5">
                {isBn && file.banglaTitle ? file.banglaTitle : file.title}
              </h3>
            </div>
          </div>

          {/* Action buttons (Bookmark & Share) */}
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleBookmark(file.id)}
              title={bookmarked ? (isBn ? 'বুকমার্ক সরান' : 'Remove Bookmark') : (isBn ? 'বুকমার্ক করুন' : 'Bookmark')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                bookmarked
                  ? 'text-amber-400 hover:text-amber-300 bg-amber-950/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => openShareModal(file)}
              title={isBn ? 'আলাদা লিংক শেয়ার করুন' : 'Share Direct Link'}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Short Description */}
        <p className="mt-3 text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
          {isBn && file.banglaDescription ? file.banglaDescription : file.description}
        </p>

        {/* Unboxed Metadata (Strict Zero-Pill Compliance) */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <span>{file.version}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300 font-semibold">{file.fileSize}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="uppercase text-slate-400">{file.fileType}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Download className="w-3 h-3 text-slate-500" />
            <span>{formatDownloads(file.downloadCount)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Button: 2-Step Download Trigger */}
      <div className="mt-4 pt-2">
        <button
          onClick={handleDownload}
          className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
            isAdStepDone
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950 font-semibold animate-pulse'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950'
          }`}
        >
          {isAdStepDone ? (
            <>
              <Download className="w-4 h-4" />
              <span>{isBn ? 'ডাউনলোড শুরু করুন (Ready!)' : 'Download Now (Ready!)'}</span>
            </>
          ) : (
            <>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-200" />
              <span>{isBn ? 'ডাউনলোড লিংক (ধাপ ১/২)' : 'Download (Step 1 of 2)'}</span>
            </>
          )}
        </button>

        {/* Quiet Hint below button */}
        <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>
            {isAdStepDone
              ? (isBn ? 'স্পনসর আনলকড · ২য় ক্লিকে ডাউনলোড' : 'Sponsor unlocked · Click starts download')
              : (isBn ? '১ম ক্লিক স্পনসর · ২য় ক্লিকে ফাইল' : '1st click opens sponsor · 2nd downloads')}
          </span>
        </div>
      </div>
    </div>
  );
};
