export type Platform = 'windows' | 'android' | 'multi' | 'mac' | 'web';

export type Category = 'software' | 'movie' | 'game' | 'utility' | 'mobile_app';

export interface AppFile {
  id: string;
  slug: string;
  title: string;
  banglaTitle?: string;
  category: Category;
  platform: Platform;
  fileType: string; // e.g., '.exe', '.apk', '.zip', '.mkv'
  fileSize: string; // e.g., '145 MB'
  fileSizeBytes: number; // For speed/progress calculations
  version: string;
  uploadDate: string;
  uploader: string;
  verified: boolean;
  downloadCount: number;
  rating: number; // e.g. 4.8
  ratingCount: number;
  description: string;
  banglaDescription: string;
  features: string[];
  banglaFeatures?: string[];
  changelog?: string[];
  icon: string; // Lucide icon key or image URL
  coverImage?: string;
  downloadUrl?: string; // external or internal
  tags: string[];
  requirements: string;
  md5Checksum: string;
  isFeatured?: boolean;
}

export type DownloadStatus = 'queued' | 'downloading' | 'paused' | 'completed' | 'cancelled' | 'error';

export interface DownloadTask {
  id: string;
  fileId: string;
  title: string;
  fileSize: string;
  fileSizeBytes: number;
  downloadedBytes: number;
  progress: number; // 0 - 100
  speedBytesPerSec: number;
  status: DownloadStatus;
  speedLimitKbps: number; // 0 = unlimited, 500, 1000, 2048, 5120, etc.
  startTime: number;
  completedTime?: number;
  platform: Platform;
  fileType: string;
  adStepCompleted: boolean;
  downloadUrl?: string;
}

export interface DownloadHistoryItem {
  id: string;
  fileId: string;
  title: string;
  fileSize: string;
  fileType: string;
  platform: Platform;
  category: Category;
  downloadDate: string;
  downloadedBytes: number;
}

export type Language = 'bn' | 'en';

export interface FilterOptions {
  search: string;
  platform: Platform | 'all';
  category: Category | 'all';
  onlyBookmarks: boolean;
  sortBy: 'popular' | 'newest' | 'size_desc' | 'rating';
}
