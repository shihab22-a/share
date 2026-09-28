import React from 'react';
import { Search, X, CheckCircle2, Shield, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { language, filters, setFilters, files } = useApp();
  const isBn = language === 'bn';

  return (
    <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-36 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-48 h-48 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {isBn ? (
            <>
              সেরা সফটওয়্যার, অ্যাপ ও মুভি{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                হাই-স্পিড ডাউনলোড
              </span>
            </>
          ) : (
            <>
              Verified Software, Android Apps & Movies{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Supercharged Downloads
              </span>
            </>
          )}
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          {isBn
            ? 'উইন্ডোজ এবং অ্যান্ড্রয়েডের জন্য প্রয়োজনীয় সব ফাইল। স্পিড লিমিট নিয়ন্ত্রণ, বিরতি ও রিজুম সুবিধাসহ সহজে ডাউনলোড করুন।'
            : 'Explore, share and download verified files with pause/resume support, speed throttling, and individual shareable links.'}
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder={
                isBn
                  ? 'সফটওয়্যার, অ্যান্ড্রয়েড অ্যাপ, গেম অথবা মুভির নাম দিয়ে খুঁজুন...'
                  : 'Search by file name, software, APK, movie, or tags...'
              }
              className="w-full pl-12 pr-10 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 shadow-xl shadow-slate-950/60 transition-all"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((f) => ({ ...f, search: '' }))}
                className="absolute right-3.5 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Anti-Slop Clean Metadata (No static pills!) */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{files.length} {isBn ? 'টি ভেরিফায়েড ফাইল' : 'Verified Files'}</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1 text-cyan-300">
            <Zap className="w-3.5 h-3.5" />
            <span>{isBn ? 'স্পিড লিমিট ও রিজুম সাপোর্ট' : 'Resume & Speed Limiter'}</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isBn ? '১০০% ভাইরাস-মুক্ত স্ক্যান' : 'Malware Scanned'}</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>{isBn ? 'প্রতিটি ফাইলের আলাদা লিংক' : 'Direct Share Links'}</span>
        </div>

      </div>
    </div>
  );
};
