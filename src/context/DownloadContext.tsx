import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { DownloadTask, DownloadHistoryItem, AppFile } from '../types';
import { AD_REDIRECT_URL } from '../data/mockFiles';

interface DownloadContextType {
  activeDownloads: DownloadTask[];
  history: DownloadHistoryItem[];
  isManagerOpen: boolean;
  isHistoryOpen: boolean;
  activeCount: number;
  adProgressMap: Record<string, boolean>; // fileId -> boolean (whether step 1 ad was clicked)
  openManager: () => void;
  closeManager: () => void;
  openHistory: () => void;
  closeHistory: () => void;
  handleDownloadClick: (file: AppFile, customSpeedLimit?: number) => { isAdStep: boolean; task?: DownloadTask };
  pauseDownload: (taskId: string) => void;
  resumeDownload: (taskId: string) => void;
  cancelDownload: (taskId: string) => void;
  setTaskSpeedLimit: (taskId: string, limitKbps: number) => void;
  clearCompletedDownloads: () => void;
  clearHistory: () => void;
  removeHistoryItem: (id: string) => void;
  resetAdStep: (fileId: string) => void;
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

const HISTORY_STORAGE_KEY = 'sharevault_download_history';

export const DownloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDownloads, setActiveDownloads] = useState<DownloadTask[]>([]);
  const [history, setHistory] = useState<DownloadHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [adProgressMap, setAdProgressMap] = useState<Record<string, boolean>>({});

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Download simulation engine (supports speed limit throttling, pause/resume)
  const downloadsRef = useRef(activeDownloads);
  downloadsRef.current = activeDownloads;

  // Real browser file deliverer
  const triggerBrowserFileDownload = useCallback((task: DownloadTask) => {
    try {
      // If external downloadUrl (such as direct Google Drive uc?export=download link) is configured:
      if (task.downloadUrl && task.downloadUrl.startsWith('http')) {
        const a = document.createElement('a');
        a.href = task.downloadUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Fallback local safe verified bundle payload
        const content = `[ShareVault App Hub - Verified Download]\n` +
          `File Name: ${task.title}\n` +
          `File Type: ${task.fileType}\n` +
          `File Size: ${task.fileSize}\n` +
          `Platform: ${task.platform.toUpperCase()}\n` +
          `Downloaded via ShareVault Fast Accelerator\n` +
          `Timestamp: ${new Date().toISOString()}\n\n` +
          `Status: MD5 Verified & Virus-Free Clean File Package.\n` +
          `Enjoy your high-speed download!`;

        const blob = new Blob([content], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Clean filename
        const safeName = task.title.replace(/[^a-zA-Z0-9_-]/g, '_') + task.fileType;
        a.download = safeName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      // Celebrate with confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error('Failed to trigger browser download:', err);
    }
  }, []);

  // Timer loop for running downloads
  useEffect(() => {
    const interval = setInterval(() => {
      const currentList = downloadsRef.current;
      const hasDownloading = currentList.some((t) => t.status === 'downloading');
      if (!hasDownloading) return;

      const now = Date.now();
      const deltaSec = 0.3; // 300ms step

      setActiveDownloads((prevTasks) => {
        let changed = false;
        const updated = prevTasks.map((task) => {
          if (task.status !== 'downloading') return task;
          changed = true;

          // Determine speed in bytes per second
          // If speedLimitKbps == 0 (unlimited), simulate 8 - 14 MB/s
          let targetSpeedBps: number;
          if (task.speedLimitKbps > 0) {
            targetSpeedBps = task.speedLimitKbps * 1024;
          } else {
            // Realistic broadband fluctuation (approx 9 - 14 MB/s)
            targetSpeedBps = (9.5 + Math.sin(now / 1000) * 3) * 1024 * 1024;
          }

          // In demo simulation, scale smaller files so 1.45GB doesn't take 3 hours, but speed is tracked accurately
          const byteIncrement = targetSpeedBps * deltaSec * 2.5;
          const nextDownloaded = Math.min(task.fileSizeBytes, task.downloadedBytes + byteIncrement);
          const nextProgress = Math.min(100, Math.round((nextDownloaded / task.fileSizeBytes) * 100));

          if (nextDownloaded >= task.fileSizeBytes) {
            // Complete!
            triggerBrowserFileDownload(task);

            // Add to history
            const historyEntry: DownloadHistoryItem = {
              id: 'hist-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
              fileId: task.fileId,
              title: task.title,
              fileSize: task.fileSize,
              fileType: task.fileType,
              platform: task.platform,
              category: 'software',
              downloadDate: new Date().toLocaleString(),
              downloadedBytes: task.fileSizeBytes,
            };

            setHistory((prevHist) => [historyEntry, ...prevHist]);

            return {
              ...task,
              downloadedBytes: task.fileSizeBytes,
              progress: 100,
              status: 'completed' as const,
              speedBytesPerSec: 0,
              completedTime: now,
            };
          }

          return {
            ...task,
            downloadedBytes: nextDownloaded,
            progress: nextProgress,
            speedBytesPerSec: targetSpeedBps,
          };
        });

        return changed ? updated : prevTasks;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [triggerBrowserFileDownload]);

  // Click handler implementing the exact 1st click ad + 2nd click download logic
  const handleDownloadClick = useCallback(
    (file: AppFile, customSpeedLimit: number = 0): { isAdStep: boolean; task?: DownloadTask } => {
      const isAdDone = !!adProgressMap[file.id];

      if (!isAdDone) {
        // Step 1: Open the monetization ad link
        try {
          window.open(AD_REDIRECT_URL, '_blank', 'noopener,noreferrer');
        } catch {
          // fallback if blocked
          const link = document.createElement('a');
          link.href = AD_REDIRECT_URL;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.click();
        }

        // Mark file as ad-unlocked for 2nd click
        setAdProgressMap((prev) => ({ ...prev, [file.id]: true }));
        return { isAdStep: true };
      }

      // Step 2: 2nd click starts download!
      // Check if file is already downloading
      const existing = downloadsRef.current.find(
        (t) => t.fileId === file.id && (t.status === 'downloading' || t.status === 'paused')
      );

      if (existing) {
        setIsManagerOpen(true);
        return { isAdStep: false, task: existing };
      }

      const newTask: DownloadTask = {
        id: 'dl-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        fileId: file.id,
        title: file.title,
        fileSize: file.fileSize,
        fileSizeBytes: file.fileSizeBytes,
        downloadedBytes: 0,
        progress: 0,
        speedBytesPerSec: 0,
        status: 'downloading',
        speedLimitKbps: customSpeedLimit, // 0 = unlimited
        startTime: Date.now(),
        platform: file.platform,
        fileType: file.fileType,
        adStepCompleted: true,
        downloadUrl: file.downloadUrl,
      };

      setActiveDownloads((prev) => [newTask, ...prev]);
      setIsManagerOpen(true);

      return { isAdStep: false, task: newTask };
    },
    [adProgressMap]
  );

  const pauseDownload = useCallback((taskId: string) => {
    setActiveDownloads((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'paused', speedBytesPerSec: 0 } : t))
    );
  }, []);

  const resumeDownload = useCallback((taskId: string) => {
    setActiveDownloads((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'downloading' } : t))
    );
  }, []);

  const cancelDownload = useCallback((taskId: string) => {
    setActiveDownloads((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const setTaskSpeedLimit = useCallback((taskId: string, limitKbps: number) => {
    setActiveDownloads((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, speedLimitKbps: limitKbps } : t))
    );
  }, []);

  const clearCompletedDownloads = useCallback(() => {
    setActiveDownloads((prev) => prev.filter((t) => t.status !== 'completed'));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const resetAdStep = useCallback((fileId: string) => {
    setAdProgressMap((prev) => {
      const next = { ...prev };
      delete next[fileId];
      return next;
    });
  }, []);

  const activeCount = activeDownloads.filter((t) => t.status === 'downloading').length;

  return (
    <DownloadContext.Provider
      value={{
        activeDownloads,
        history,
        isManagerOpen,
        isHistoryOpen,
        activeCount,
        adProgressMap,
        openManager: () => setIsManagerOpen(true),
        closeManager: () => setIsManagerOpen(false),
        openHistory: () => setIsHistoryOpen(true),
        closeHistory: () => setIsHistoryOpen(false),
        handleDownloadClick,
        pauseDownload,
        resumeDownload,
        cancelDownload,
        setTaskSpeedLimit,
        clearCompletedDownloads,
        clearHistory,
        removeHistoryItem,
        resetAdStep,
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownload = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error('useDownload must be used within a DownloadProvider');
  }
  return context;
};
