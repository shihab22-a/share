import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  CheckCircle,
  Eye,
  FileText,
  DollarSign,
  HardDrive,
  DownloadCloud,
  LogOut,
  Search,
  Check,
  Globe,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppFile, Platform, Category } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    isAdmin,
    setIsAdmin,
    isAdminModalOpen,
    closeAdminModal,
    files,
    deleteFile,
    updateFile,
    resetCatalogToDefault,
    openUploadModal,
    openGuideModal,
    setSelectedFile,
    adClickCount,
    language,
    showToast,
  } = useApp();

  const isBn = language === 'bn';
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFile, setEditingFile] = useState<AppFile | null>(null);

  if (!isAdminModalOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === '@shihab258011@') {
      setIsAdmin(true);
      setErrorMsg('');
      showToast(isBn ? 'এডমিন হিসেবে লগইন সফল হয়েছে!' : 'Logged in as Admin successfully!');
    } else {
      setErrorMsg(isBn ? 'ভুল পাসওয়ার্ড! সঠিক এডমিন পাসওয়ার্ড দিন।' : 'Incorrect admin passcode!');
    }
  };

  // Handle Edit Save
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile) return;
    updateFile(editingFile.id, editingFile);
    setEditingFile(null);
    showToast(isBn ? 'ফাইল আপডেট সম্পন্ন হয়েছে!' : 'File updated successfully!');
  };

  // Stats
  const totalDownloads = files.reduce((acc, f) => acc + (f.downloadCount || 0), 0);
  const totalStorageBytes = files.reduce((acc, f) => acc + (f.fileSizeBytes || 0), 0);
  const totalStorageGB = (totalStorageBytes / (1024 * 1024 * 1024)).toFixed(2);

  // Filtered files in admin table
  const displayedFiles = files.filter(
    (f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.banglaTitle && f.banglaTitle.includes(searchQuery)) ||
      f.category.includes(searchQuery.toLowerCase()) ||
      f.platform.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl border border-cyan-500/40 bg-slate-900 p-0.5 shadow-md flex items-center justify-center overflow-hidden">
              <img
                src="/src/assets/images/sharevault_bd_logo_1790584102515.jpg"
                alt="ShareVault BD"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isBn ? 'এডমিন কন্ট্রোল প্যানেল' : 'Admin Control Panel'}</span>
                {isAdmin && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400">
                    {isBn ? 'অনুমোদিত' : 'Authorized'}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {isBn ? 'SHARE VAULT BD · ফাইল ম্যানেজমেন্ট ও সেটিংস' : 'SHARE VAULT BD · Control & Analytics'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  setIsAdmin(false);
                  showToast(isBn ? 'এডমিন লগআউট করা হয়েছে।' : 'Logged out of admin.');
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগআউট' : 'Logout'}</span>
              </button>
            )}
            <button
              onClick={closeAdminModal}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* If Not Logged In: Show Passcode Gate */}
          {!isAdmin ? (
            <div className="max-w-md mx-auto py-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-cyan-500/40 p-1.5 mx-auto mb-4 shadow-xl shadow-cyan-950/60 overflow-hidden flex items-center justify-center">
                  <img
                    src="/src/assets/images/sharevault_bd_logo_1790584102515.jpg"
                    alt="ShareVault BD Vault"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="text-xl font-black text-white tracking-tight">
                  SHARE <span className="text-cyan-400">VAULT</span> <span className="text-[#FF5722]">B</span><span className="text-[#006A4E]">D</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {isBn ? 'এডমিন ড্যাশবোর্ডে প্রবেশ করতে সিকিউরিটি পাসওয়ার্ড প্রদান করুন।' : 'Enter admin passcode to unlock the secure vault portal.'}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isBn ? 'এডমিন পাসওয়ার্ড' : 'Admin Passcode'}
                  </label>
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errorMsg && <p className="text-xs text-rose-400 mt-1.5">{errorMsg}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  {isBn ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Unlock Dashboard'}
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Stats Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                    <span>{isBn ? 'মোট ফাইল' : 'Total Files'}</span>
                    <FileText className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-white">{files.length}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                    <span>{isBn ? 'মোট ডাউনলোড' : 'Total Downloads'}</span>
                    <DownloadCloud className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-white">
                    {totalDownloads.toLocaleString()}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                    <span>{isBn ? 'অ্যাড ক্লিক সংখ্যা' : 'Ad Clicks'}</span>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-white">{adClickCount}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                    <span>{isBn ? 'হোস্টিং স্টোরেজ' : 'Storage Size'}</span>
                    <HardDrive className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-white">{totalStorageGB} GB</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isBn ? 'এডমিন টেবিলে খুঁজুন...' : 'Filter files...'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openGuideModal}
                    title={isBn ? 'ফ্রী হোস্টিং ও গুগল ড্রাইভ সেটআপ গাইড' : 'Free Hosting & Google Drive Guide'}
                    className="px-2.5 py-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 hover:text-white hover:bg-cyan-900/60 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isBn ? 'হোস্টিং গাইড' : 'Hosting Guide'}</span>
                  </button>

                  <button
                    onClick={openUploadModal}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isBn ? 'নতুন ফাইল যোগ করুন' : 'Add New File'}</span>
                  </button>

                  <button
                    onClick={resetCatalogToDefault}
                    title={isBn ? 'ডিফল্ট ডেটা রিস্টোর' : 'Reset to initial sample catalog'}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Files Management Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3 px-4">{isBn ? 'ফাইল নাম' : 'File Name'}</th>
                      <th className="py-3 px-3">OS</th>
                      <th className="py-3 px-3">{isBn ? 'ক্যাটাগরি' : 'Category'}</th>
                      <th className="py-3 px-3">{isBn ? 'সাইজ' : 'Size'}</th>
                      <th className="py-3 px-3">{isBn ? 'ভার্সন' : 'Version'}</th>
                      <th className="py-3 px-3">{isBn ? 'ডাউনলোড' : 'Downloads'}</th>
                      <th className="py-3 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {displayedFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white max-w-[220px] truncate">
                            {file.title}
                          </div>
                          {file.banglaTitle && (
                            <div className="text-[11px] text-slate-400 truncate">
                              {file.banglaTitle}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 uppercase font-medium text-cyan-400">
                          {file.platform}
                        </td>
                        <td className="py-3 px-3 capitalize text-slate-400">
                          {file.category}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {file.fileSize}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {file.version}
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-mono">
                          {file.downloadCount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                closeAdminModal();
                                setSelectedFile(file);
                              }}
                              className="p-1.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                              title={isBn ? 'প্রিভিউ দেখুন' : 'Preview'}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingFile({ ...file })}
                              className="p-1.5 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
                              title={isBn ? 'সম্পাদনা' : 'Edit'}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                              title={isBn ? 'মুছুন' : 'Delete'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </>
          )}

        </div>

      </div>

      {/* Nested Edit File Modal */}
      {editingFile && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h4 className="text-sm font-bold text-white">
                {isBn ? 'ফাইল সম্পাদনা' : 'Edit File Details'}
              </h4>
              <button
                onClick={() => setEditingFile(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Title</label>
                <input
                  type="text"
                  value={editingFile.title}
                  onChange={(e) => setEditingFile({ ...editingFile, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Bangla Title</label>
                <input
                  type="text"
                  value={editingFile.banglaTitle || ''}
                  onChange={(e) => setEditingFile({ ...editingFile, banglaTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Platform</label>
                  <select
                    value={editingFile.platform}
                    onChange={(e) =>
                      setEditingFile({ ...editingFile, platform: e.target.value as Platform })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="windows">Windows</option>
                    <option value="android">Android</option>
                    <option value="multi">Multi-OS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={editingFile.category}
                    onChange={(e) =>
                      setEditingFile({ ...editingFile, category: e.target.value as Category })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="software">Software</option>
                    <option value="movie">Movie</option>
                    <option value="game">Game</option>
                    <option value="utility">Utility</option>
                    <option value="mobile_app">Mobile App</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Version</label>
                  <input
                    type="text"
                    value={editingFile.version}
                    onChange={(e) => setEditingFile({ ...editingFile, version: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">File Size</label>
                  <input
                    type="text"
                    value={editingFile.fileSize}
                    onChange={(e) => setEditingFile({ ...editingFile, fileSize: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Google Drive / Direct Download URL
                </label>
                <input
                  type="text"
                  value={editingFile.downloadUrl || ''}
                  onChange={(e) => {
                    let val = e.target.value;
                    const matchD = val.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                    const matchId = val.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                    const fileId = matchD ? matchD[1] : matchId ? matchId[1] : null;
                    if (fileId && !val.includes('uc?export=download')) {
                      val = `https://drive.google.com/uc?export=download&id=${fileId}`;
                    }
                    setEditingFile({ ...editingFile, downloadUrl: val });
                  }}
                  placeholder="https://drive.google.com/uc?export=download&id=..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFile(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  {isBn ? 'সংরক্ষণ করুন' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
