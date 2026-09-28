import React from 'react';
import {
  Download,
  Bookmark,
  History,
  ShieldCheck,
  Languages,
  Monitor,
  Smartphone,
  Film,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDownload } from '../context/DownloadContext';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    bookmarkedIds,
    setFilters,
    openAdminModal,
    isAdmin,
  } = useApp();

  const { activeCount, openManager, openHistory, activeDownloads } = useDownload();

  const isBn = language === 'bn';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setFilters({
                  search: '',
                  platform: 'all',
                  category: 'all',
                  onlyBookmarks: false,
                  sortBy: 'popular',
                });
              }}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="relative w-11 h-11 rounded-xl bg-slate-900 border border-cyan-500/40 p-1 shadow-lg shadow-cyan-950/60 group-hover:border-cyan-400 transition-all flex items-center justify-center overflow-hidden">
                <img
                  src="/src/assets/images/sharevault_bd_logo_1790584102515.jpg"
                  alt="ShareVault BD Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
                  <span>SHARE</span>
                  <span className="text-cyan-400">VAULT</span>
                  <span className="text-[#FF5722] font-black">B</span>
                  <span className="text-[#006A4E] font-black">D</span>
                </span>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  {isBn ? 'ইউর রিলায়্যাবল ডাউনলোড হাব' : 'Your Reliable Download Hub'}
                </p>
              </div>
            </button>
          </div>

          {/* Center Quick Platform Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setFilters((f) => ({ ...f, platform: 'windows', onlyBookmarks: false }))}
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span>Windows {isBn ? 'সফটওয়্যার' : 'PC'}</span>
            </button>
            <button
              onClick={() => setFilters((f) => ({ ...f, platform: 'android', onlyBookmarks: false }))}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors focus:outline-none cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Android {isBn ? 'অ্যাপস' : 'Apps'}</span>
            </button>
            <button
              onClick={() => setFilters((f) => ({ ...f, category: 'movie', onlyBookmarks: false }))}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors focus:outline-none cursor-pointer"
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>{isBn ? 'মুভিজ' : 'Movies'}</span>
            </button>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(isBn ? 'en' : 'bn')}
              title={isBn ? 'Switch to English' : 'বাংলায় দেখুন'}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isBn ? 'বাং / EN' : 'EN / বাং'}</span>
            </button>

            {/* Bookmarks Filter Button */}
            <button
              onClick={() => setFilters((f) => ({ ...f, onlyBookmarks: !f.onlyBookmarks }))}
              title={isBn ? 'সংরক্ষিত বুকমার্কস' : 'Saved Bookmarks'}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-all cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedIds.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>

            {/* Download History Modal Button */}
            <button
              onClick={openHistory}
              title={isBn ? 'ডাউনলোড হিস্টোরি' : 'Download History'}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-all cursor-pointer"
            >
              <History className="w-4 h-4" />
            </button>

            {/* Download Manager Drawer Button with Active Badge */}
            <button
              onClick={openManager}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold text-xs transition-all cursor-pointer ${
                activeCount > 0
                  ? 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300 shadow-md shadow-cyan-950 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${activeCount > 0 ? 'text-cyan-400 fill-cyan-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {isBn ? 'ডাউনলোডার' : 'Manager'}
              </span>
              {activeDownloads.length > 0 && (
                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                  {activeDownloads.length}
                </span>
              )}
            </button>

            {/* Admin Panel Button */}
            <button
              onClick={openAdminModal}
              title={isAdmin ? (isBn ? 'এডমিন ড্যাশবোর্ড' : 'Admin Dashboard') : (isBn ? 'এডমিন লগইন' : 'Admin Login')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                isAdmin
                  ? 'bg-indigo-950/80 border-indigo-500/60 text-indigo-300 hover:border-indigo-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">
                {isAdmin ? (isBn ? 'এডমিন' : 'Admin') : (isBn ? 'এডমিন লগইন' : 'Admin')}
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
