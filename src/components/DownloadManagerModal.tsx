import React from 'react';
import {
  X,
  Play,
  Pause,
  Trash2,
  CheckCircle2,
  Gauge,
  ArrowDownCircle,
  Clock,
  History,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { useDownload } from '../context/DownloadContext';
import { useApp } from '../context/AppContext';

export const DownloadManagerModal: React.FC = () => {
  const {
    activeDownloads,
    isManagerOpen,
    closeManager,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    setTaskSpeedLimit,
    clearCompletedDownloads,
    openHistory,
  } = useDownload();

  const { language } = useApp();
  const isBn = language === 'bn';

  if (!isManagerOpen) return null;

  const formatSpeed = (bytesPerSec: number) => {
    if (bytesPerSec <= 0) return '0 KB/s';
    const mb = bytesPerSec / (1024 * 1024);
    if (mb >= 1) return mb.toFixed(1) + ' MB/s';
    const kb = bytesPerSec / 1024;
    return kb.toFixed(0) + ' KB/s';
  };

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) return (mb / 1024).toFixed(2) + ' GB';
    return mb.toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
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
                <span>{isBn ? 'ডাউনলোড ম্যানেজার' : 'Download Manager'}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400">
                  {activeDownloads.length} {isBn ? 'টি টাস্ক' : 'Tasks'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'ShareVault BD · স্পিড লিমিট নিয়ন্ত্রণ ও রিজুম সাপোর্ট' : 'ShareVault BD · Speed accelerator & resume engine'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeManager();
                openHistory();
              }}
              title={isBn ? 'ডাউনলোড হিস্টোরি' : 'Download History'}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={closeManager}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {activeDownloads.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-medium">
                {isBn ? 'বর্তমানে কোনো ডাউনলোড চালু নেই' : 'No active downloads in progress'}
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {isBn
                  ? 'যেকোনো সফটওয়্যার বা মুভি কার্ডে ২য় ক্লিকে ডাউনলোড শুরু হলে এখানে প্রগ্রেস দেখতে পাবেন।'
                  : 'Start a download from any file card to monitor and control its speed.'}
              </p>
            </div>
          ) : (
            activeDownloads.map((task) => {
              const isPaused = task.status === 'paused';
              const isCompleted = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-emerald-950/20 border-emerald-800/40'
                      : isPaused
                      ? 'bg-amber-950/20 border-amber-800/40'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  {/* Title & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">
                        {task.title}
                      </h4>
                      {/* Unboxed Metadata */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                        <span>{formatSize(task.downloadedBytes)} / {task.fileSize}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="uppercase text-slate-400">{task.fileType}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        {isCompleted ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isBn ? 'ডাউনলোড সম্পন্ন!' : 'Completed!'}
                          </span>
                        ) : isPaused ? (
                          <span className="text-amber-400 font-semibold">
                            {isBn ? 'সাময়িক স্থগিত (Paused)' : 'Paused'}
                          </span>
                        ) : (
                          <span className="text-cyan-400 font-semibold flex items-center gap-1">
                            <Gauge className="w-3.5 h-3.5" />
                            {formatSpeed(task.speedBytesPerSec)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons: Pause / Resume / Cancel */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isCompleted && (
                        <>
                          {isPaused ? (
                            <button
                              onClick={() => resumeDownload(task.id)}
                              title={isBn ? 'পুনরায় শুরু করুন (Resume)' : 'Resume Download'}
                              className="p-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                            >
                              <Play className="w-4 h-4 fill-emerald-400" />
                            </button>
                          ) : (
                            <button
                              onClick={() => pauseDownload(task.id)}
                              title={isBn ? 'স্থগিত করুন (Pause)' : 'Pause Download'}
                              className="p-1.5 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400 hover:bg-amber-600 hover:text-white transition-colors cursor-pointer"
                            >
                              <Pause className="w-4 h-4 fill-amber-400" />
                            </button>
                          )}
                        </>
                      )}

                      <button
                        onClick={() => cancelDownload(task.id)}
                        title={isBn ? 'বাতিল করুন' : 'Cancel Task'}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>{task.progress}%</span>
                      <span>
                        {isCompleted
                          ? (isBn ? 'ফাইল সেভ হয়েছে' : 'Saved to Downloads')
                          : isPaused
                          ? (isBn ? 'স্থগিত' : 'Paused')
                          : (isBn ? 'ডাউনলোড হচ্ছে...' : 'Downloading...')}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : isPaused
                            ? 'bg-amber-500'
                            : 'bg-gradient-to-r from-cyan-500 to-teal-400'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Speed Limit Throttling Controller */}
                  {!isCompleted && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                        {isBn ? 'স্পিড লিমিট:' : 'Speed Limit:'}
                      </span>

                      <div className="flex items-center gap-1">
                        {[
                          { val: 0, label: isBn ? 'আনলিমিটেড' : 'Max' },
                          { val: 5120, label: '5 MB/s' },
                          { val: 2048, label: '2 MB/s' },
                          { val: 1024, label: '1 MB/s' },
                          { val: 500, label: '500 KB' },
                        ].map((sp) => (
                          <button
                            key={sp.val}
                            onClick={() => setTaskSpeedLimit(task.id, sp.val)}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                              task.speedLimitKbps === sp.val
                                ? 'bg-cyan-500 text-slate-950 font-bold'
                                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {sp.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {activeDownloads.length > 0 && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {isBn ? 'ব্রাউজার সরাসরি ডাউনলোড পরিচালনা করছে' : 'Browser native acceleration enabled'}
            </span>
            <button
              onClick={clearCompletedDownloads}
              className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              {isBn ? 'সম্পন্নগুলো সাফ করুন' : 'Clear Completed'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
