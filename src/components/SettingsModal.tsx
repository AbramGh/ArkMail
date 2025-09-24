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
  const { currentTheme, customBackground, setCustomBackground } = useTheme();
  const [backgroundInput, setBackgroundInput] = useState(customBackground || '');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
  // Default background placeholder - will be replaced by user's image
  const defaultBackground = 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1))';
  const renderLiquidGlassSettings = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-light text-cream mb-2">Liquid Glass Theme</h2>
        <p className="text-cream/60 font-light">Customize your background image</p>
      </div>

      <div>
        <h3 className="text-lg font-light text-cream mb-6 flex items-center justify-center gap-2">
          <Image size={20} />
          Background Image
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-3 justify-center">
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
              Upload Image
            </Button>
            <Button
              onClick={handleBackgroundClear}
              variant="ghost"
              disabled={!customBackground}
            >
              Reset to Default
            </Button>
          </div>
          
          <div className="text-center text-sm text-cream/60 font-light">
            <p>Upload your own background image to personalize the liquid glass theme</p>
          </div>
        </div>
        
        {/* Current Background Preview */}
        <div className="mt-6 p-6 rounded-2xl bg-cream/5 border border-cream/10">
          <div className="text-center mb-4">
            <span className="text-sm font-light text-cream/80">
              {customBackground ? 'Current Background' : 'Default Background'}
              {uploadedFile ? ` (${uploadedFile.name})` : ''}
            </span>
          </div>
          <div 
            className="w-full h-32 rounded-xl border border-cream/20"
            style={{
              background: customBackground || defaultBackground,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
      </div>
    </div>
  );


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
            className="liquid-glass-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream/10">
              <h2 className="text-2xl font-light text-cream">Settings</h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="text-cream/70" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(80vh-80px)]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderLiquidGlassSettings()}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};