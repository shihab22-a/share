import React from 'react';
import {
  Layers,
  Monitor,
  Smartphone,
  Film,
  Package,
  Gamepad2,
  Wrench,
  Bookmark,
  ArrowUpDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Platform, Category } from '../types';

export const CategoryNav: React.FC = () => {
  const { language, filters, setFilters, bookmarkedIds } = useApp();
  const isBn = language === 'bn';

  const platforms: { id: Platform | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: isBn ? 'সকল প্ল্যাটফর্ম' : 'All OS', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'windows', label: 'Windows (PC)', icon: <Monitor className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'android', label: 'Android (APK)', icon: <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> },
  ];

  const categories: { id: Category | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: isBn ? 'সব ক্যাটাগরি' : 'All Categories', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'software', label: isBn ? 'সফটওয়্যার' : 'Software', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'movie', label: isBn ? 'মুভিজ' : 'Movies', icon: <Film className="w-3.5 h-3.5" /> },
    { id: 'game', label: isBn ? 'গেমস' : 'Games', icon: <Gamepad2 className="w-3.5 h-3.5" /> },
    { id: 'utility', label: isBn ? 'টুলস ও ইউটিলিটি' : 'Utilities', icon: <Wrench className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="border-b border-slate-800 bg-slate-950 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Row 1: Platform Selector & Bookmarks & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Platform Segmented Control */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {platforms.map((p) => {
              const active = filters.platform === p.id && !filters.onlyBookmarks;
              return (
                <button
                  key={p.id}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      platform: p.id,
                      onlyBookmarks: false,
                    }))
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Bookmarks Toggle Tab */}
            <button
              onClick={() => setFilters((prev) => ({ ...prev, onlyBookmarks: !prev.onlyBookmarks }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                filters.onlyBookmarks
                  ? 'bg-amber-950/70 border-amber-600/70 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${filters.onlyBookmarks ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isBn ? 'বুকমার্কস' : 'Bookmarks'}</span>
              {bookmarkedIds.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>

            {/* Sort Options Dropdown */}
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="popular">{isBn ? 'জনপ্রিয়তা' : 'Most Popular'}</option>
                <option value="newest">{isBn ? 'নতুন আপলোড' : 'Newest'}</option>
                <option value="size_desc">{isBn ? 'ফাইল সাইজ' : 'File Size'}</option>
                <option value="rating">{isBn ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}</option>
              </select>
            </div>
          </div>

        </div>

        {/* Row 2: Category Filter Tabs */}
        {!filters.onlyBookmarks && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      category: cat.id,
                    }))
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-cyan-500/10 border border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
