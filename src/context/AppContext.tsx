import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppFile, FilterOptions, Language, Platform, Category } from '../types';
import { INITIAL_FILES } from '../data/mockFiles';

interface AppContextType {
  files: AppFile[];
  language: Language;
  filters: FilterOptions;
  bookmarkedIds: string[];
  selectedFile: AppFile | null;
  isAdmin: boolean;
  isAdminModalOpen: boolean;
  isUploadModalOpen: boolean;
  isShareModalOpen: boolean;
  isGuideOpen: boolean;
  shareTargetFile: AppFile | null;
  adClickCount: number;
  toastMessage: string | null;
  setLanguage: (lang: Language) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  toggleBookmark: (fileId: string) => void;
  isBookmarked: (fileId: string) => boolean;
  setSelectedFile: (file: AppFile | null) => void;
  openFileBySlugOrId: (identifier: string) => void;
  setIsAdmin: (status: boolean) => void;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  openShareModal: (file: AppFile) => void;
  closeShareModal: () => void;
  openGuideModal: () => void;
  closeGuideModal: () => void;
  addNewFile: (fileData: Omit<AppFile, 'id' | 'slug' | 'downloadCount' | 'rating' | 'ratingCount' | 'uploadDate'>) => AppFile;
  updateFile: (id: string, updated: Partial<AppFile>) => void;
  deleteFile: (id: string) => void;
  resetCatalogToDefault: () => void;
  recordAdClick: () => void;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const FILES_STORAGE_KEY = 'sharevault_files_catalog';
const BOOKMARKS_STORAGE_KEY = 'sharevault_bookmarks';
const LANG_STORAGE_KEY = 'sharevault_lang';
const AD_CLICKS_STORAGE_KEY = 'sharevault_ad_clicks';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<AppFile[]>(() => {
    try {
      const saved = localStorage.getItem(FILES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_FILES;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'bn' || saved === 'en') return saved;
    } catch {
      // fallback
    }
    return 'bn'; // Default to Bengali
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [adClickCount, setAdClickCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(AD_CLICKS_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 124;
    } catch {
      return 124;
    }
  });

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    platform: 'all',
    category: 'all',
    onlyBookmarks: false,
    sortBy: 'popular',
  });

  const [selectedFile, setSelectedFile] = useState<AppFile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [shareTargetFile, setShareTargetFile] = useState<AppFile | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync files to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
    } catch {
      // ignore
    }
  }, [files]);

  // Sync bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarkedIds));
    } catch {
      // ignore
    }
  }, [bookmarkedIds]);

  // Sync language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  // Toast handler
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  }, []);

  // Handle URL deep link (?file=slug_or_id) on mount and popstate
  useEffect(() => {
    const handleUrlQuery = () => {
      const params = new URLSearchParams(window.location.search);
      const fileSlugOrId = params.get('file');
      if (fileSlugOrId) {
        const found = files.find((f) => f.slug === fileSlugOrId || f.id === fileSlugOrId);
        if (found) {
          setSelectedFile(found);
        }
      }
    };

    handleUrlQuery();
    window.addEventListener('popstate', handleUrlQuery);
    return () => window.removeEventListener('popstate', handleUrlQuery);
  }, [files]);

  // Update URL query when selectedFile changes
  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    if (selectedFile) {
      currentUrl.searchParams.set('file', selectedFile.slug);
      window.history.replaceState({}, '', currentUrl.toString());
    } else {
      currentUrl.searchParams.delete('file');
      window.history.replaceState({}, '', currentUrl.toString());
    }
  }, [selectedFile]);

  const openFileBySlugOrId = useCallback(
    (identifier: string) => {
      const found = files.find((f) => f.slug === identifier || f.id === identifier);
      if (found) {
        setSelectedFile(found);
      }
    },
    [files]
  );

  const toggleBookmark = useCallback((fileId: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(fileId);
      const next = exists ? prev.filter((id) => id !== fileId) : [...prev, fileId];
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (fileId: string) => bookmarkedIds.includes(fileId),
    [bookmarkedIds]
  );

  const recordAdClick = useCallback(() => {
    setAdClickCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(AD_CLICKS_STORAGE_KEY, next.toString());
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const openShareModal = useCallback((file: AppFile) => {
    setShareTargetFile(file);
    setIsShareModalOpen(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false);
    setShareTargetFile(null);
  }, []);

  const addNewFile = useCallback(
    (fileData: Omit<AppFile, 'id' | 'slug' | 'downloadCount' | 'rating' | 'ratingCount' | 'uploadDate'>): AppFile => {
      const id = 'file-' + Date.now();
      const slug = fileData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const newFile: AppFile = {
        ...fileData,
        id,
        slug: slug || id,
        downloadCount: 0,
        rating: 5.0,
        ratingCount: 1,
        uploadDate: new Date().toISOString().split('T')[0],
      };

      setFiles((prev) => [newFile, ...prev]);
      showToast(language === 'bn' ? 'ফাইল সফলভাবে আপলোড হয়েছে!' : 'File successfully uploaded!');
      return newFile;
    },
    [language, showToast]
  );

  const updateFile = useCallback((id: string, updated: Partial<AppFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
  }, []);

  const deleteFile = useCallback(
    (id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      if (selectedFile?.id === id) {
        setSelectedFile(null);
      }
      showToast(language === 'bn' ? 'ফাইল মুছে ফেলা হয়েছে।' : 'File deleted successfully.');
    },
    [selectedFile, language, showToast]
  );

  const resetCatalogToDefault = useCallback(() => {
    setFiles(INITIAL_FILES);
    try {
      localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(INITIAL_FILES));
    } catch {
      // ignore
    }
    showToast(language === 'bn' ? 'ডিফল্ট ক্যাটালগ রিস্টোর করা হয়েছে।' : 'Default catalog restored.');
  }, [language, showToast]);

  return (
    <AppContext.Provider
      value={{
        files,
        language,
        filters,
        bookmarkedIds,
        selectedFile,
        isAdmin,
        isAdminModalOpen,
        isUploadModalOpen,
        isShareModalOpen,
        shareTargetFile,
        adClickCount,
        toastMessage,
        setLanguage,
        setFilters,
        toggleBookmark,
        isBookmarked,
        setSelectedFile,
        openFileBySlugOrId,
        setIsAdmin,
        openAdminModal: () => setIsAdminModalOpen(true),
        closeAdminModal: () => setIsAdminModalOpen(false),
        openUploadModal: () => setIsUploadModalOpen(true),
        closeUploadModal: () => setIsUploadModalOpen(false),
        openShareModal,
        closeShareModal,
        isGuideOpen,
        openGuideModal: () => setIsGuideOpen(true),
        closeGuideModal: () => setIsGuideOpen(false),
        addNewFile,
        updateFile,
        deleteFile,
        resetCatalogToDefault,
        recordAdClick,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
