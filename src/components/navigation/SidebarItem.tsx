import React from 'react';
import { Button } from '../ui/Button';
import { EmailFolder } from '../../types/email';
import GlassSurface from '../GlassSurface';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  folder: EmailFolder;
  isSelected: boolean;
  onSelect: (folderId: string) => void;
  IconComponent: LucideIcon;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  folder,
  isSelected,
  onSelect,
  IconComponent
}) => {
  return (
    <GlassSurface
      width="100%"
      height="auto"
      borderRadius={8}
      borderWidth={0.07}
      brightness={50}
      opacity={0.93}
      blur={11}
      displace={0}
      backgroundOpacity={isSelected ? 0.15 : 0.08}
      saturation={1.1}
      distortionScale={-180}
      redOffset={0}
      greenOffset={10}
      blueOffset={20}
      xChannel="R"
      yChannel="G"
      mixBlendMode="difference"
      className="cursor-pointer mb-1"
      onClick={() => onSelect(folder.id)}
    >
      <div className="flex items-center gap-3 px-3 py-2">
        <IconComponent size={16} />
        <span className="flex-1 text-left text-sm font-light">
          {folder.name}
        </span>
        {folder.count > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full">
            {folder.count}
          </span>
        )}
      </div>
    </GlassSurface>
  );
};