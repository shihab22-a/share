import React, { useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AdNoticeBanner } from './components/AdNoticeBanner';
import { CategoryNav } from './components/CategoryNav';
import { FileCard } from './components/FileCard';
import { FileDetailsModal } from './components/FileDetailsModal';
import { DownloadManagerModal } from './components/DownloadManagerModal';
import { DownloadHistoryModal } from './components/DownloadHistoryModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FileUploadModal } from './components/FileUploadModal';
import { ShareModal } from './components/ShareModal';
import { HostingGuideModal } from './components/HostingGuideModal';
import { Toast } from './components/Toast';
import { AppProvider, useApp } from './context/AppContext';
import { DownloadProvider } from './context/DownloadContext';
import {
  Download,
  Shield,
  Zap,
  FolderSearch,
  Sparkles,
  Smartphone,
  Monitor,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { AD_REDIRECT_URL } from './data/mockFiles';

const MainContent: React.FC = () => {
  const { files, filters, setFilters, language, isBookmarked, isGuideOpen, closeGuideModal } = useApp();
  const isBn = language === 'bn';

  // Filter and sort files
  const filteredFiles = useMemo(() => {
    return files
      .filter((file) => {
        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchTitle = file.title.toLowerCase().includes(q);
          const matchBangla = file.banglaTitle?.toLowerCase().includes(q);
          const matchDesc = file.description.toLowerCase().includes(q);
          const matchTags = file.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchBangla && !matchDesc && !matchTags) {
            return false;
          }
        }

        // Only bookmarks filter
        if (filters.onlyBookmarks && !isBookmarked(file.id)) {
          return false;
        }

        // Platform filter
        if (filters.platform !== 'all') {
          if (file.platform !== filters.platform && file.platform !== 'multi') {
            return false;
          }
        }

        // Category filter
        if (filters.category !== 'all') {
          if (file.category !== filters.category) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'popular') {
          return b.downloadCount - a.downloadCount;
        }
        if (filters.sortBy === 'newest') {
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        }
        if (filters.sortBy === 'size_desc') {
          return b.fileSizeBytes - a.fileSizeBytes;
        }
        if (filters.sortBy === 'rating') {
          return b.rating - a.rating;
        }
        return 0;
      });
  }, [files, filters, isBookmarked]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />
      <AdNoticeBanner />
      <HeroBanner />
      <CategoryNav />

      {/* Main File Listing Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Results Count & Active Filter Indicator */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80 text-xs text-slate-400">
          <div>
            <span>
              {isBn ? 'মোট পাওয়া গেছে:' : 'Showing:'}{' '}
              <strong className="text-white font-semibold">{filteredFiles.length}</strong>{' '}
              {isBn ? 'টি ফাইল' : 'files'}
            </span>
            {filters.onlyBookmarks && (
              <span className="ml-2 text-amber-400 font-medium">
                ({isBn ? 'বুকমার্ক করা ফাইল' : 'Bookmarked Only'})
              </span>
            )}
            {filters.platform !== 'all' && (
              <span className="ml-2 text-cyan-400 uppercase font-medium">
                ({filters.platform})
              </span>
            )}
            {filters.category !== 'all' && (
              <span className="ml-2 text-emerald-400 capitalize font-medium">
                ({filters.category})
              </span>
            )}
          </div>

          {(filters.search || filters.platform !== 'all' || filters.category !== 'all' || filters.onlyBookmarks) && (
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  platform: 'all',
                  category: 'all',
                  onlyBookmarks: false,
                  sortBy: 'popular',
                })
              }
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
            >
              {isBn ? 'সব ফিল্টার ক্লিয়ার করুন' : 'Reset Filters'}
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl">
            <FolderSearch className="w-14 h-14 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">
              {isBn ? 'কোনো ফাইল খুঁজে পাওয়া যায়নি' : 'No matching files found'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {isBn
                ? 'অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন বা ফিল্টার রিসেট করে সব ফাইল দেখুন।'
                : 'Try searching with different terms or reset current filters.'}
            </p>
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  platform: 'all',
                  category: 'all',
                  onlyBookmarks: false,
                  sortBy: 'popular',
                })
              }
              className="mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 transition-colors cursor-pointer"
            >
              {isBn ? 'সব ফাইল দেখুন' : 'Show All Files'}
            </button>
          </div>
        ) : (
          /* Grid of Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFiles.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}

        {/* Sponsor Banner Box */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-emerald-950/40 border border-slate-800 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{isBn ? 'সাইটটি পছন্দ হয়েছে? আমাদের স্পনসর ভিজিট করুন' : 'Support ShareVault BD'}</span>
            </h4>
            <p className="text-xs text-slate-300">
              {isBn
                ? 'আমাদের ফাইলগুলো সম্পূর্ণ ফ্রিতে ডাউনলোড করার সুযোগ দিতে স্পনসর পার্টনার সাহায্য করে।'
                : 'Help us maintain ultra high-speed dedicated file servers by visiting our verified sponsors.'}
            </p>
            <div className="pt-1">
              <a
                href={AD_REDIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md shadow-cyan-950"
              >
                <span>{isBn ? 'স্পনসর পার্টনার পেইজ' : 'Visit Sponsor Network'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-500/40 bg-slate-900 p-0.5 shadow-md">
              <img
                src="/src/assets/images/sharevault_bd_logo_1790584102515.jpg"
                alt="ShareVault BD"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded"
              />
            </div>
            <div>
              <span className="text-slate-200 font-bold tracking-tight">
                SHARE <span className="text-cyan-400">VAULT</span>{' '}
                <span className="text-[#FF5722]">B</span>
                <span className="text-[#006A4E]">D</span>
              </span>
              <p className="text-[10px] text-slate-500">Your Reliable Software Download Hub</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Windows .EXE</span>
            <span aria-hidden="true" className="text-slate-800">·</span>
            <span>Android .APK</span>
            <span aria-hidden="true" className="text-slate-800">·</span>
            <span>Full HD Movies</span>
            <span aria-hidden="true" className="text-slate-800">·</span>
            <span>100% Virus Free</span>
          </div>

          <div>
            <span>© {new Date().getFullYear()} ShareVault BD. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* All Application Modals */}
      <FileDetailsModal />
      <DownloadManagerModal />
      <DownloadHistoryModal />
      <AdminDashboard />
      <FileUploadModal />
      <ShareModal />
      <HostingGuideModal isOpen={isGuideOpen} onClose={closeGuideModal} />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DownloadProvider>
        <MainContent />
      </DownloadProvider>
    </AppProvider>
  );
}
