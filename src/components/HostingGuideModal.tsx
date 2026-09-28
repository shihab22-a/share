import React, { useState } from 'react';
import {
  X,
  BookOpen,
  HardDrive,
  Globe,
  Link as LinkIcon,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HostingGuideModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { language, showToast } = useApp();
  const isBn = language === 'bn';

  const [inputUrl, setInputUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Convert Google Drive sharing link to Direct Download Link
  const convertGoogleDriveUrl = (url: string) => {
    setInputUrl(url);
    if (!url.trim()) {
      setConvertedUrl('');
      return;
    }

    // Match file ID patterns: /d/FILE_ID/ or id=FILE_ID
    const matchD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const fileId = matchD ? matchD[1] : matchId ? matchId[1] : null;

    if (fileId) {
      // Direct download URL
      const direct = `https://drive.google.com/uc?export=download&id=${fileId}`;
      setConvertedUrl(direct);
    } else {
      setConvertedUrl('');
    }
  };

  const copyConverted = () => {
    if (!convertedUrl) return;
    navigator.clipboard.writeText(convertedUrl);
    setCopied(true);
    showToast(isBn ? 'ডাইরেক্ট ডাউনলোড লিংক কপি হয়েছে!' : 'Direct download link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
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
                <span>{isBn ? 'ফ্রী হোস্টিং ও গুগল ড্রাইভ সেটআপ গাইড' : 'Free Hosting & Google Drive Setup Guide'}</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">
                  Admin Guide
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isBn
                  ? 'SHARE VAULT BD · গুগল ড্রাইভ থেকে সরাসরি ডাউনলোড এবং Vercel/Netlify তে ফ্রী হোস্টিং গাইড'
                  : 'SHARE VAULT BD · Deploy on free hosting and serve files directly from Google Drive'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Section 1: Google Drive Direct Link Converter Tool */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-900/50 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <HardDrive className="w-4 h-4" />
              <span>{isBn ? 'টুল ১: গুগল ড্রাইভ ডাইরেক্ট ডাউনলোড লিংক জেনারেটর' : 'Tool 1: Google Drive Direct Link Generator'}</span>
            </div>
            <p className="text-slate-300">
              {isBn
                ? 'গুগল ড্রাইভে ফাইল আপলোড করে "Anyone with the link can view" করে শেয়ার লিংকটি এখানে পেস্ট করুন। এটি স্বয়ংক্রিয়ভাবে সরাসরি ডাউনলোড লিংক তৈরি করে দেবে:'
                : 'Paste your Google Drive public sharing link here to generate a 1-click direct download link:'}
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => convertGoogleDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/1a2b3c4d5e.../view?usp=sharing"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />

              {convertedUrl && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg space-y-1.5 animate-fade-in">
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                    <span>{isBn ? 'সরাসরি ডাউনলোড লিংক (Ready!):' : 'Direct Download URL:'}</span>
                    <button
                      onClick={copyConverted}
                      className="flex items-center gap-1 text-white bg-emerald-700 hover:bg-emerald-600 px-2 py-0.5 rounded cursor-pointer transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-200" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied!') : (isBn ? 'কপি করুন' : 'Copy')}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-emerald-200 select-all break-all">
                    {convertedUrl}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Step-by-Step for Google Drive */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-600 text-slate-950 flex items-center justify-center text-xs font-black">
                ১
              </span>
              <span>{isBn ? 'গুগল ড্রাইভে ফাইল আপলোড ও সেটআপ' : 'Google Drive Setup'}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-1">
                  {isBn ? 'ধাপ ১: ফাইল আপলোড' : 'Step 1: Upload File'}
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {isBn
                    ? 'আপনার Google Drive-এ সফটওয়্যার (.exe), অ্যাপ (.apk) বা মুভি ফাইল আপলোড করুন।'
                    : 'Upload your .exe, .apk, or media files to your Google Drive storage.'}
                </p>
              </div>

              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-1">
                  {isBn ? 'ধাপ ২: পারমিশন পাবলিক করা' : 'Step 2: Set Public'}
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {isBn
                    ? 'ফাইলের উপর রাইট ক্লিক করে Share সিলেক্ট করুন। General access-এ "Anyone with the link" এবং "Viewer" সেট করুন।'
                    : 'Right click file > Share > Change General access to "Anyone with the link" (Viewer).'}
                </p>
              </div>

              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-slate-200 block mb-1">
                  {isBn ? 'ধাপ ৩: ওয়েবসাইটে যুক্ত করা' : 'Step 3: Add to App'}
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {isBn
                    ? 'উপরের কনভার্টার টুল বা এডমিন প্যানেলে লিঙ্কটি দিন। ব্যবহারকারী ক্লিক করলে সরাসরি গুগল ড্রাইভ সার্ভার থেকে ডাউনলোড শুরু হবে।'
                    : 'Paste the direct download URL in our Admin Panel or Upload Modal.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Free Hosting Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-slate-950 flex items-center justify-center text-xs font-black">
                ২
              </span>
              <span>{isBn ? 'সেরা ৩টি সম্পূর্ণ ফ্রী হোস্টিং প্ল্যাটফর্ম' : 'Top 3 Free Hosting Platforms'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Vercel */}
              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-sm">Vercel</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                      ১০০% ফ্রী
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {isBn
                      ? 'React/Vite অ্যাপের জন্য বিশ্বের সবচেয়ে ফাস্ট ও জনপ্রিয় ফ্রী হোস্টিং। কাস্টম ডোমেইন (.com) ফ্রিতে যুক্ত করা যায়।'
                      : 'Fastest global CDN for React/Vite. Free custom domain & SSL.'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-400 font-mono">
                  vercel.com
                </div>
              </div>

              {/* Netlify */}
              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-sm">Netlify</span>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded">
                      সহজ ও ফ্রী
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {isBn
                      ? 'গিটহাব ছাড়া শুধু প্রজেক্টের "dist" ফোল্ডার ড্র্যাগ অ্যান্ড ড্রপ করলেই ১ সেকেন্ডে ওয়েবসাইট লাইভ হয়ে যায়।'
                      : 'Supports simple drag-and-drop build folder deployment.'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-400 font-mono">
                  netlify.com
                </div>
              </div>

              {/* Cloudflare Pages */}
              <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-sm">Cloudflare Pages</span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded">
                      সীমাহীন ব্যান্ডউইথ
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {isBn
                      ? 'কোনো ট্রাফিকের লিমিট নেই। লক্ষ লক্ষ ভিজিটর আসলেও সাইট কখনো ডাউন বা স্লো হবে না।'
                      : 'Unlimited bandwidth, DDoS protection and lightning fast.'}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-400 font-mono">
                  pages.cloudflare.com
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Live Deployment 3 Easy Steps */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-300">
              {isBn ? 'কীভাবে এই ওয়েবসাইটটি ফ্রী হোস্টিংয়ে লাইভ করবেন:' : 'How to Deploy in 3 Simple Steps:'}
            </h5>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>
                <strong className="text-white">GitHub এ আপলোড:</strong> আপনার এই কোডটি GitHub এর একটি ফ্রি রিপোজিটরিতে রাখুন।
              </li>
              <li>
                <strong className="text-white">Vercel বা Netlify তে কানেক্ট:</strong> Vercel/Netlify তে একটি ফ্রী একাউন্ট খুলে "Import from GitHub" এ ক্লিক করুন।
              </li>
              <li>
                <strong className="text-white">১ ক্লিকে ডিপ্লয়:</strong> Deploy বাটনে ক্লিক করলেই আপনার সাইটের একটি ফ্রী লাইভ লিঙ্ক (যেমন: <code className="text-cyan-300">your-site.vercel.app</code>) পেয়ে যাবেন।
              </li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {isBn ? 'হোস্টিং ফ্রী থাকবে এবং সব ফাইলের ব্যান্ডউইথ গুগল ড্রাইভ বহন করবে।' : 'Hosting is free; bandwidth is offloaded to Google Drive.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            {isBn ? 'বুঝেছি / সম্পন্ন' : 'Got it'}
          </button>
        </div>

      </div>
    </div>
  );
};
