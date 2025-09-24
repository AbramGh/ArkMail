import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Settings, Palette, Monitor, Moon, Sun, Volume2, Bell, 
  Shield, User, Mail, Keyboard, Download, Upload, Image, FileImage
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setTheme, availableThemes, customBackground, setCustomBackground } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');
  const [backgroundInput, setBackgroundInput] = useState(customBackground || '');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
  ];

  const handleBackgroundChange = () => {
    if (backgroundInput.trim()) {
      setCustomBackground(backgroundInput.trim());
    }
  };

  const handleBackgroundClear = () => {
    setBackgroundInput('');
    setCustomBackground('');
    setUploadedFile(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      
      // Create object URL for the file
      const fileUrl = URL.createObjectURL(file);
      const cssUrl = `url(${fileUrl})`;
      setBackgroundInput(cssUrl);
      setCustomBackground(cssUrl);
      
      // Clean up previous object URLs to prevent memory leaks
      if (customBackground && customBackground.startsWith('blob:')) {
        URL.revokeObjectURL(customBackground);
      }
    }
  };

  const triggerFileUpload = () => {
    const fileInput = document.getElementById('background-file-input') as HTMLInputElement;
    fileInput?.click();
  };
  const presetBackgrounds = [
    {
      name: 'Mountain Landscape',
      url: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      name: 'Ocean Waves',
      url: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      name: 'Forest Path',
      url: 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      name: 'City Skyline',
      url: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      name: 'Abstract Gradient',
      url: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
    },
    {
      name: 'Sunset Gradient',
      url: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
    }
  ];
  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-light text-cream mb-4">Theme Selection</h3>
        <div className="grid grid-cols-2 gap-4">
          {availableThemes.map((theme) => (
            <motion.button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                currentTheme.id === theme.id
                  ? 'border-current bg-current/10'
                  : 'border-cream/20 hover:border-cream/40'
              }`}
              style={{
                borderColor: currentTheme.id === theme.id ? theme.colors.primary : undefined,
                backgroundColor: currentTheme.id === theme.id ? `${theme.colors.primary}20` : undefined
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ background: theme.gradients.primary }}
                />
                <span className="font-light text-cream">{theme.name}</span>
              </div>
              <div className="flex gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-light text-cream mb-4 flex items-center gap-2">
          <Image size={20} />
          Custom Background
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              id="background-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={triggerFileUpload}
              variant="secondary"
              icon={<FileImage size={16} />}
            >
              Upload
            </Button>
            <input
              type="text"
              value={backgroundInput}
              onChange={(e) => setBackgroundInput(e.target.value)}
              placeholder="Enter image URL, CSS gradient, or upload file..."
              className="flex-1 px-4 py-3 rounded-xl bg-cream/10 border border-cream/20 text-cream placeholder-cream/50 focus:outline-none focus:border-cream/40 font-light"
              readOnly={!!uploadedFile}
            />
            <Button
              onClick={handleBackgroundChange}
              variant="primary"
              disabled={!backgroundInput.trim() && !uploadedFile}
            >
              Apply
            </Button>
            <Button
              onClick={handleBackgroundClear}
              variant="ghost"
            >
              Clear
            </Button>
          </div>
          
          <div className="text-sm text-cream/60 font-light">
            <p className="mb-2">Examples:</p>
            <ul className="space-y-1 text-xs">
              <li>• Upload: Click "Upload" to select from your files</li>
              <li>• Image: https://your-image.jpg</li>
              <li>• Gradient: linear-gradient(135deg, #667eea, #764ba2)</li>
              <li>• Pattern: radial-gradient(circle, #ff6b6b, #4ecdc4)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-light text-cream mb-3">Preset Backgrounds</h4>
          <div className="grid grid-cols-2 gap-3">
            {presetBackgrounds.map((preset, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  const isImage = preset.url.startsWith('http') || preset.url.startsWith('blob:');
                  const cssUrl = isImage ? `url(${preset.url})` : preset.url;
                  setBackgroundInput(cssUrl);
                  setCustomBackground(cssUrl);
                }}
                className="p-3 rounded-xl bg-cream/5 border border-cream/10 hover:border-cream/20 transition-all duration-300 text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="w-full h-16 rounded-lg mb-2"
                  style={{
                    background: preset.url.startsWith('http') ? `url(${preset.url})` : preset.url,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <span className="text-xs font-light text-cream/80">{preset.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        {customBackground && (
          <div className="mt-4 p-4 rounded-xl bg-cream/5 border border-cream/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm font-light text-cream">
                Active Background {uploadedFile ? `(${uploadedFile.name})` : ''}
              </span>
            </div>
            <div 
              className="w-full h-20 rounded-lg"
              style={{
                background: customBackground.startsWith('http') ? `url(${customBackground})` : customBackground,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg font-light text-cream mb-4">Display Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-light text-cream/80">Compact Mode</span>
            <motion.button 
              className="w-12 h-6 bg-cream/20 rounded-full relative"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-5 h-5 bg-current rounded-full absolute top-0.5 left-0.5"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
            </motion.button>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-light text-cream/80">Show Avatars</span>
            <motion.button 
              className="w-12 h-6 bg-current/30 rounded-full relative"
              style={{ backgroundColor: currentTheme.colors.primary }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="w-5 h-5 bg-cream rounded-full absolute top-0.5 right-0.5"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-light text-cream mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            'New email notifications',
            'Important email alerts',
            'Calendar reminders',
            'Desktop notifications'
          ].map((setting) => (
            <div key={setting} className="flex items-center justify-between">
              <span className="font-light text-cream/80">{setting}</span>
              <motion.button 
                className="w-12 h-6 bg-current/30 rounded-full relative"
                style={{ backgroundColor: currentTheme.colors.primary }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-5 h-5 bg-cream rounded-full absolute top-0.5 right-0.5"
                />
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return renderAppearanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'account':
        return <div className="text-cream/60 font-light">Account settings coming soon...</div>;
      case 'privacy':
        return <div className="text-cream/60 font-light">Privacy settings coming soon...</div>;
      case 'shortcuts':
        return <div className="text-cream/60 font-light">Keyboard shortcuts coming soon...</div>;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={cn(
              "rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex",
              currentTheme.id === 'liquid-glass' ? 'liquid-glass-card' : 'glass-card'
            )}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Sidebar */}
            <div className="w-64 border-r border-cream/10 p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-light text-cream">Settings</h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} className="text-cream/70" />
                </motion.button>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                        currentTheme.id === 'liquid-glass' ? 'liquid-glass-sidebar-item' : 'sidebar-item',
                        activeTab === tab.id && 'active'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <IconComponent size={18} />
                      <span className="font-light">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};