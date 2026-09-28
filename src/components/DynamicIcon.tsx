import React from 'react';
import {
  Download,
  Video,
  Film,
  PlaySquare,
  Gamepad2,
  Gamepad,
  Code2,
  Image as ImageIcon,
  Terminal,
  HardDrive,
  FileCode,
  Layers,
  Sparkles,
  Smartphone,
  Monitor,
  Package,
} from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  platform?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', platform }) => {
  switch (name?.toLowerCase()) {
    case 'download':
      return <Download className={className} />;
    case 'video':
      return <Video className={className} />;
    case 'film':
      return <Film className={className} />;
    case 'playsquare':
      return <PlaySquare className={className} />;
    case 'gamepad2':
    case 'gamepad':
      return <Gamepad2 className={className} />;
    case 'code2':
    case 'code':
      return <Code2 className={className} />;
    case 'image':
      return <ImageIcon className={className} />;
    case 'terminal':
      return <Terminal className={className} />;
    case 'harddrive':
      return <HardDrive className={className} />;
    case 'filecode':
      return <FileCode className={className} />;
    case 'smartphone':
      return <Smartphone className={className} />;
    case 'monitor':
      return <Monitor className={className} />;
    default:
      if (platform === 'android') return <Smartphone className={className} />;
      if (platform === 'windows') return <Monitor className={className} />;
      return <Package className={className} />;
  }
};
