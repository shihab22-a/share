import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Bookmark,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  Calendar,
  Gauge,
  Copy,
  Check,
  Monitor,
  Smartphone,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDownload } from '../context/DownloadContext';
import { DynamicIcon } from './DynamicIcon';

export const FileDetailsModal: React.FC = () => {
  const {
    selectedFile,
    setSelectedFile,
    language,
    toggleBookmark,
    isBookmarked,
    openShareModal,
    recordAdClick,
    showToast,
  } = useApp();

  const { handleDownloadClick, adProgressMap } = useDownload();

  const [selectedSpeedLimit, setSelectedSpeedLimit] = useState<number>(0); // 0 = unlimited
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedFile) return null;

  const isBn = language === 'bn';
  const bookmarked = isBookmarked(selectedFile.id);
  const isAdStepDone = !!adProgressMap[selectedFile.id];

  const shareableUrl = `${window.location.origin}${window.location.pathname}?file=${selectedFile.slug}`;

  const copyFileLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    showToast(isBn ? 'ফাইলের আলাদা লিংক কপি করা হয়েছে!' : 'File direct link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleStartDownload = () => {
    const result = handleDownloadClick(selectedFile, selectedSpeedLimit);
    if (result.isAdStep) {
      recordAdClick();
      showToast(
        isBn
          ? 'ধাপ ১ সম্পন্ন: স্পনসর পেইজ খোলা হয়েছে। এখন ২য় ক্লিকে ডাউনলোড শুরু করুন!'
          : 'Step 1 complete: Sponsor page opened. Click Download again to start file download!'
      );
    } else {
      showToast(
        isBn
          ? `${selectedFile.title} ডাউনলোড শুরু হয়েছে!`
          : `${selectedFile.title} download started!`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>{isBn ? 'ফাইল বিশদ বিবরণ' : 'File Details'}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="uppercase text-cyan-400 font-bold">{selectedFile.platform}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="capitalize">{selectedFile.category}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleBookmark(selectedFile.id)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                bookmarked ? 'text-amber-400 bg-amber-950/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => openShareModal(selectedFile)}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Top Info Banner */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
              <DynamicIcon name={selectedFile.icon} platform={selectedFile.platform} className="w-8 h-8" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isBn && selectedFile.banglaTitle ? selectedFile.banglaTitle : selectedFile.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {selectedFile.title}
              </p>

              {/* Unboxed Metadata row */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 font-medium">
                <span className="text-cyan-400 font-semibold">{selectedFile.version}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{selectedFile.fileSize}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="uppercase text-slate-400">{selectedFile.fileType}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                {selectedFile.downloadUrl && (selectedFile.downloadUrl.includes('drive.google.com') || selectedFile.downloadUrl.includes('google')) ? (
                  <>
                    <span className="text-cyan-400 font-medium">Google Drive Cloud</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                  </>
                ) : null}
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isBn ? '১০০% স্ক্যানকৃত ও নিরাপদ' : '100% Scanned & Safe'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
              {isBn ? 'বিবরণ' : 'Description'}
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {isBn && selectedFile.banglaDescription ? selectedFile.banglaDescription : selectedFile.description}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2.5">
              {isBn ? 'মূল সুবিধাসমূহ' : 'Key Features'}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {(isBn && selectedFile.banglaFeatures ? selectedFile.banglaFeatures : selectedFile.features).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* System Requirements & Verification Checksum */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
              <span className="text-slate-400 font-medium block mb-1">
                {isBn ? 'সিস্টেম রিকোয়ারমেন্টস' : 'System Requirements'}
              </span>
              <span className="text-slate-200 font-semibold">{selectedFile.requirements}</span>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
              <span className="text-slate-400 font-medium block mb-1">
                MD5 Checksum Hash
              </span>
              <span className="font-mono text-slate-400 text-[11px] truncate block select-all">
                {selectedFile.md5Checksum}
              </span>
            </div>
          </div>

          {/* Individual Share Link Box (Requested Feature!) */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-medium">
                {isBn ? 'এই ফাইলের সরাসরি শেয়ার লিংক' : 'Direct Shareable Link for this File'}
              </span>
              <span className="text-[11px] text-cyan-400 font-mono">?file={selectedFile.slug}</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none select-all"
              />
              <button
                onClick={copyFileLink}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-white flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'কপি লিংক' : 'Copy')}</span>
              </button>
            </div>
          </div>

          {/* Speed Limit Selector & 2-Step Download Trigger */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            
            {/* Speed Limit setting */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">
                  {isBn ? 'ডাউনলোড স্পিড লিমিট:' : 'Download Speed Limit:'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { value: 0, label: isBn ? 'আনলিমিটেড (সর্বোচ্চ)' : 'Unlimited' },
                  { value: 5120, label: '5 MB/s' },
                  { value: 2048, label: '2 MB/s' },
                  { value: 1024, label: '1 MB/s' },
                  { value: 500, label: '500 KB/s' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedSpeedLimit(opt.value)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      selectedSpeedLimit === opt.value
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2-Step Download Action Button */}
            <div>
              <button
                onClick={handleStartDownload}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer ${
                  isAdStepDone
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 ring-2 ring-emerald-400/40 animate-pulse'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950/60'
                }`}
              >
                {isAdStepDone ? (
                  <>
                    <Download className="w-5 h-5" />
                    <span>
                      {isBn
                        ? 'ডাউনলোড শুরু করুন (ধাপ ২/২ - রেডি!)'
                        : 'Start Download Now (Step 2 of 2 - Ready!)'}
                    </span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5 text-cyan-200" />
                    <span>
                      {isBn
                        ? 'স্পনসর পেজ খুলুন ও ফাইল আনলক করুন (ধাপ ১/২)'
                        : 'Unlock File & View Sponsor (Step 1 of 2)'}
                    </span>
                  </>
                )}
              </button>

              {/* Informative text below the button */}
              <p className="mt-2 text-center text-[11px] text-slate-400">
                {isAdStepDone ? (
                  <span className="text-emerald-400 font-medium">
                    ✓ {isBn ? 'স্পনসর যাচাই সম্পন্ন হয়েছে! ক্লিক করলেই ডাউনলোডার চালু হবে এবং ফাইল সেভ হবে।' : 'Sponsor verified! Clicking will start downloader and save your file.'}
                  </span>
                ) : (
                  <span>
                    {isBn
                      ? '১ম ক্লিকে স্পনসর এডভার্টাইজমেন্ট পেজ নতুন ট্যাবে ওপেন হবে, এরপর ২য় ক্লিকে সরাসরি হাই-স্পিড ডাউনলোড শুরু হবে।'
                      : 'First click opens sponsor ad tab. Second click immediately triggers high-speed file download.'}
                  </span>
                )}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
