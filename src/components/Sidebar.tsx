import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Star, Send, FileText, Trash2, Shield, Briefcase, User, Plus, Settings, Search, Archive, Tag, Users, Calendar, MoreHorizontal, Mail, UserPlus, Bell, BarChart3, BookTemplate as Template, Filter, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { SidebarItem } from './navigation/SidebarItem';
import { EmailFolder } from '../types/email';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import GlassSurface from './GlassSurface';

interface SidebarProps {
  folders: EmailFolder[];
  selectedFolder: string;
  onFolderSelect: (folderId: string) => void;
  onCompose: () => void;
  onSettings: () => void;
  onSearch: () => void;
  onAccountManager: () => void;
  onNotifications?: () => void;
  onAnalytics?: () => void;
  onTemplates?: () => void;
  onRules?: () => void;
}

const iconMap = {
  Inbox,
  Star,
  Send,
  FileText,
  Trash2,
  Shield,
  Briefcase,
  User,
  Archive,
  Tag,
  Users,
  Calendar
};

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  selectedFolder,
  onFolderSelect,
  onCompose,
  onSettings,
  onSearch,
  onAccountManager,
  onNotifications,
  onAnalytics,
  onTemplates,
  onRules
}) => {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme.id === 'liquid-glass';

  return (
    <motion.div 
      className="w-64 h-full flex flex-col m-2"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Compose Button */}
      <div className="p-4">
        <motion.div
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="cursor-pointer"
          onClick={onCompose}
        >
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={16}
            brightness={50}
            opacity={0.93}
            displace={0}
            backgroundOpacity={0.15}
            saturation={1.3}
            distortionScale={-50}
            redOffset={0}
            greenOffset={3}
            blueOffset={6}
            xChannel="R"
            yChannel="G"
            mixBlendMode="difference"
          >
            <div className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium">
              <Plus size={16} />
              Compose
            </div>
          </GlassSurface>
        </motion.div>
      </div>

      {/* Search */}
      <div className="px-4 pb-4">
        <motion.div
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="cursor-pointer"
          onClick={onSearch}
        >
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={16}
            brightness={50}
            opacity={0.93}
            displace={0}
            backgroundOpacity={0.1}
            saturation={1.2}
            distortionScale={-50}
            redOffset={0}
            greenOffset={3}
            blueOffset={6}
            xChannel="R"
            yChannel="G"
            mixBlendMode="difference"
          >
            <div className="relative flex items-center px-2 py-1.5">
              <Search size={16} />
              <span className="ml-2 text-sm font-light">Search mail</span>
            </div>
          </GlassSurface>
        </motion.div>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto px-4">
        <nav className="space-y-1">
          {folders
            .filter(folder => folder.name !== 'Work' && folder.name !== 'Personal')
            .map((folder, index) => {
            const IconComponent = iconMap[folder.icon as keyof typeof iconMap] || Inbox;
            
            return (
              <SidebarItem
                key={folder.id}
                folder={folder}
                isSelected={selectedFolder === folder.id}
                onSelect={onFolderSelect}
                IconComponent={IconComponent}
              />
            );
          })}
        </nav>

        {/* Labels Section */}
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between px-4 py-2 text-xs font-light mb-2">
            <span>Labels</span>
            <MoreHorizontal size={14} />
          </div>
          
          <div className="space-y-1">
            {['Important', 'Work', 'Personal', 'Travel'].map((label, index) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <GlassSurface
                  width="100%"
                  height="auto"
                  borderRadius={16}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 px-2 py-1.5">
                    <div className="w-2 h-2 rounded-full"></div>
                    <span className="flex-1 text-left text-xs font-light">{label}</span>
                  </div>
                </GlassSurface>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Features */}
      <motion.div 
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {onAnalytics && (
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="mb-2 cursor-pointer"
            onClick={onAnalytics}
          >
            <GlassSurface
              width="100%"
              height="auto"
              borderRadius={16}
              brightness={50}
              opacity={0.93}
              displace={0}
              backgroundOpacity={0.08}
              saturation={1.1}
              distortionScale={-50}
              redOffset={0}
              greenOffset={3}
              blueOffset={6}
              xChannel="R"
              yChannel="G"
              mixBlendMode="difference"
            >
              <div className="flex items-center gap-3 px-2 py-1.5">
                <BarChart3 size={16} />
                <span className="text-sm font-light">Analytics</span>
              </div>
            </GlassSurface>
          </motion.div>
        )}
        
        <motion.div
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="mb-2 cursor-pointer"
          onClick={onAccountManager}
        >
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={16}
            brightness={50}
            opacity={0.93}
            displace={0}
            backgroundOpacity={0.08}
            saturation={1.1}
            distortionScale={-50}
            redOffset={0}
            greenOffset={3}
            blueOffset={6}
            xChannel="R"
            yChannel="G"
            mixBlendMode="difference"
          >
            <div className="flex items-center gap-3 px-2 py-1.5">
              <UserPlus size={16} />
              <span className="text-sm font-light">Accounts</span>
            </div>
          </GlassSurface>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="cursor-pointer"
          onClick={onSettings}
        >
          <GlassSurface
            width="100%"
            height="auto"
            borderRadius={16}
            brightness={50}
            opacity={0.93}
            displace={0}
            backgroundOpacity={0.08}
            saturation={1.1}
            distortionScale={-50}
            redOffset={0}
            greenOffset={3}
            blueOffset={6}
            xChannel="R"
            yChannel="G"
            mixBlendMode="difference"
          >
            <div className="flex items-center gap-3 px-2 py-1.5">
              <Settings size={16} />
              <span className="text-sm font-light">Settings</span>
            </div>
          </GlassSurface>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};