import React from 'react';
import {
  X,
  History,
  Trash2,
  Download,
  Calendar,
  Monitor,
  Smartphone,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useDownload } from '../context/DownloadContext';
import { useApp } from '../context/AppContext';

export const DownloadHistoryModal: React.FC = () => {
  const { history, isHistoryOpen, closeHistory, clearHistory, removeHistoryItem } = useDownload();
  const { language, openFileBySlugOrId, files } = useApp();

  if (!isHistoryOpen) return null;

  const isBn = language === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl border border-cyan-500/40 bg-slate-950 p-0.5 shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <img
                src="/src/assets/images/sharevault_bd_logo_1790584102515.jpg"
                alt="ShareVault BD"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isBn ? 'ডাউনলোড হিস্টোরি' : 'Download History'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400">
                  {history.length} {isBn ? 'টি আইটেম' : 'Items'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'ShareVault BD · সম্পন্নকৃত ডাউনলোডের তালিকা' : 'ShareVault BD · Log of completed downloads'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                title={isBn ? 'হিস্টোরি মুছুন' : 'Clear All'}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeHistory}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-medium">
                {isBn ? 'এখনো কোনো ডাউনলোড হিস্টোরি নেই' : 'No download history yet'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isBn ? 'ফাইল ডাউনলোড সম্পন্ন হলে তা এখানে সংরক্ষিত থাকবে।' : 'Downloaded files will appear here.'}
              </p>
            </div>
          ) : (
            history.map((item) => {
              const matchedFile = files.find((f) => f.id === item.fileId);

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">
                      {item.title}
                    </h4>

                    {/* Unboxed Metadata */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-0.5">
                      <span>{item.fileSize}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="uppercase text-slate-400">{item.fileType}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.downloadDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {matchedFile && (
                      <button
                        onClick={() => {
                          closeHistory();
                          openFileBySlugOrId(matchedFile.id);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                        title={isBn ? 'ফাইল পেজ দেখুন' : 'View File Page'}
                      >
                        <span>{isBn ? 'আবার দেখুন' : 'View'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => removeHistoryItem(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title={isBn ? 'মুছুন' : 'Remove'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
