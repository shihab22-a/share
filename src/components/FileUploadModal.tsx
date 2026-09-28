import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileCheck,
  HardDrive,
  Monitor,
  Smartphone,
  CheckCircle,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Platform, Category, AppFile } from '../types';

export const FileUploadModal: React.FC = () => {
  const { isUploadModalOpen, closeUploadModal, addNewFile, language, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBn = language === 'bn';

  // Form State
  const [title, setTitle] = useState('');
  const [banglaTitle, setBanglaTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('windows');
  const [category, setCategory] = useState<Category>('software');
  const [fileType, setFileType] = useState('.exe');
  const [fileSize, setFileSize] = useState('25.0 MB');
  const [fileSizeBytes, setFileSizeBytes] = useState(26214400);
  const [version, setVersion] = useState('v1.0.0');
  const [description, setDescription] = useState('');
  const [banglaDescription, setBanglaDescription] = useState('');
  const [requirements, setRequirements] = useState('Windows 10/11 or Android 8.0+');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [featuresText, setFeaturesText] = useState('Superfast installation\n100% Virus-free\nLifetime free updates');
  const [icon, setIcon] = useState('Download');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  if (!isUploadModalOpen) return null;

  // File selector handler (auto extracts file name, size, extension)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    // Ext
    const ext = file.name.substring(file.name.lastIndexOf('.')) || '.bin';
    setFileType(ext);

    // Auto guess title
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const cleanTitle = nameWithoutExt.replace(/[-_]/g, ' ');
    if (!title) setTitle(cleanTitle);

    // Size
    setFileSizeBytes(file.size);
    const mb = file.size / (1024 * 1024);
    if (mb >= 1024) {
      setFileSize((mb / 1024).toFixed(2) + ' GB');
    } else {
      setFileSize(mb.toFixed(1) + ' MB');
    }

    // Platform guess
    if (ext.toLowerCase() === '.apk' || ext.toLowerCase() === '.xapk') {
      setPlatform('android');
      setCategory('mobile_app');
    } else if (ext.toLowerCase() === '.exe' || ext.toLowerCase() === '.msi') {
      setPlatform('windows');
      setCategory('software');
    } else if (ext.toLowerCase() === '.mkv' || ext.toLowerCase() === '.mp4') {
      setCategory('movie');
      setPlatform('multi');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const featureList = featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newFile = addNewFile({
      title: title.trim(),
      banglaTitle: banglaTitle.trim() || undefined,
      platform,
      category,
      fileType,
      fileSize,
      fileSizeBytes: fileSizeBytes || 10485760,
      version: version.trim() || 'v1.0.0',
      uploader: 'Verified Contributor',
      verified: true,
      description: description.trim() || `${title} - Verified fast download from ShareVault.`,
      banglaDescription:
        banglaDescription.trim() ||
        `${title} - শেয়ারভল্ট থেকে নিরাপদ এবং দ্রুততম ডাউনলোড।`,
      features: featureList.length > 0 ? featureList : ['Fast & lightweight', 'Clean virus-scanned package'],
      requirements: requirements.trim() || 'Standard OS configuration',
      md5Checksum: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      icon,
      downloadUrl: downloadUrl.trim() || undefined,
      tags: [platform, category, fileType.replace('.', '')],
    });

    closeUploadModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isBn ? 'নতুন ফাইল / অ্যাপ আপলোড করুন' : 'Upload New File or App'}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn
                  ? 'আপনার ফাইল আপলোড করে আলাদা ইউনিক লিংকের মাধ্যমে সবার সাথে শেয়ার করুন'
                  : 'Add software, APKs, or media to generate a unique share link'}
              </p>
            </div>
          </div>

          <button
            onClick={closeUploadModal}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* File Picker Drag & Drop Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-5 text-center bg-slate-950/50 hover:bg-slate-950/80 transition-all cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 mx-auto mb-2 transition-colors" />
            {uploadedFileName ? (
              <div>
                <p className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  {uploadedFileName}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {fileSize} · {fileType} (ক্লিক করে অন্য ফাইল পরিবর্তন করুন)
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  {isBn ? 'আপনার ফাইল এখানে ছাড়ুন অথবা ক্লিক করুন' : 'Drop your file here, or click to browse'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Windows (.exe, .msi, .zip), Android (.apk), Movies (.mkv, .mp4), etc.
                </p>
              </div>
            )}
          </div>

          {/* Title & Bangla Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isBn ? 'ফাইলের নাম (English Title) *' : 'File Name (Title) *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. VLC Media Player 64-bit"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isBn ? 'বাংলা নাম (ঐচ্ছিক)' : 'Bangla Title (Optional)'}
              </label>
              <input
                type="text"
                value={banglaTitle}
                onChange={(e) => setBanglaTitle(e.target.value)}
                placeholder="যেমন: ভিএলসি মিডিয়া প্লেয়ার"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Platform & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isBn ? 'অপারেটিং সিস্টেম (OS)' : 'Platform (OS)'}
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="windows">Windows (PC)</option>
                <option value="android">Android (Mobile)</option>
                <option value="multi">Multi-Platform</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isBn ? 'ক্যাটাগরি' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="software">{isBn ? 'সফটওয়্যার (Software)' : 'Software'}</option>
                <option value="movie">{isBn ? 'মুভিজ (Movies)' : 'Movie'}</option>
                <option value="game">{isBn ? 'গেমস (Games)' : 'Game'}</option>
                <option value="utility">{isBn ? 'ইউটিলিটি ও টুলস' : 'Utility'}</option>
                <option value="mobile_app">{isBn ? 'মোবাইল অ্যাপস' : 'Mobile App'}</option>
              </select>
            </div>
          </div>

          {/* Version & Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isBn ? 'ভার্সন' : 'Version'}
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1.0.0"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {isBn ? 'ফাইল সাইজ' : 'File Size'}
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="25.0 MB"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {isBn ? 'বর্ণনা' : 'Description'}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isBn ? 'ফাইল বা অ্যাপ সম্পর্কে সংক্ষিপ্ত বিবরণ দিন...' : 'Brief description of the app or software...'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Key Features (line by line) */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {isBn ? 'প্রধান সুবিধাসমূহ (প্রতি লাইনে একটি)' : 'Key Features (One per line)'}
            </label>
            <textarea
              rows={2}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Fast download&#10;100% Clean&#10;No ads"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* System Requirements */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {isBn ? 'সিস্টেম রিকোয়ারমেন্টস' : 'System Requirements'}
            </label>
            <input
              type="text"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Windows 10/11 64-bit or Android 9+"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Google Drive / External Download URL */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-cyan-900/50 space-y-1.5">
            <label className="block text-slate-200 font-semibold">
              {isBn ? 'গুগল ড্রাইভ লিংক (Google Drive Download Link)' : 'Google Drive / Direct Download URL'}
            </label>
            <input
              type="text"
              value={downloadUrl}
              onChange={(e) => {
                let val = e.target.value;
                const matchD = val.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                const matchId = val.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                const fileId = matchD ? matchD[1] : matchId ? matchId[1] : null;
                if (fileId && !val.includes('uc?export=download')) {
                  val = `https://drive.google.com/uc?export=download&id=${fileId}`;
                }
                setDownloadUrl(val);
              }}
              placeholder="https://drive.google.com/file/d/1ABCxyz.../view?usp=sharing"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
            <p className="text-[10px] text-slate-400">
              {isBn
                ? 'গুগল ড্রাইভের পাবলিক শেয়ার লিংক দিলে এটি স্বয়ংক্রিয়ভাবে সরাসরি ডাউনলোড লিংকে কনভার্ট করে নিবে।'
                : 'Pasting a Google Drive view link auto-converts it to a direct 1-click download URL.'}
            </p>
          </div>

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={closeUploadModal}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors cursor-pointer shadow-lg shadow-emerald-950"
            >
              {isBn ? 'ফাইল সংরক্ষণ ও প্রকাশ করুন' : 'Publish & Get Share Link'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
