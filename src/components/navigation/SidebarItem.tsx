import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="cursor-pointer mb-1"
      onClick={() => onSelect(folder.id)}
    >
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={16}
        borderWidth={0.07}
        brightness={50}
        opacity={0.93}
        blur={2}
        displace={0}
        backgroundOpacity={isSelected ? 0.15 : 0.08}
        saturation={1.1}
        distortionScale={-50}
        redOffset={0}
        greenOffset={3}
        blueOffset={6}
        xChannel="R"
        yChannel="G"
        mixBlendMode="difference"
        onClick={() => onSelect(folder.id)}
      >
        <div className="flex items-center gap-3 px-2 py-1.5">
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
    </motion.div>
  );
};