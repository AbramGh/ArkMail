import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Calendar, Paperclip, Star, User, 
  Filter, Clock, Tag, Mail
} from 'lucide-react';
import { Email, EmailSearch } from '../types/email';
import { emailService } from '../services/emailService';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSelect: (email: Email) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ 
  isOpen, 
  onClose, 
  onEmailSelect 
}) => {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme.id === 'liquid-glass';
  const [searchParams, setSearchParams] = useState<EmailSearch>({
    query: '',
    from: '',
    to: '',
    subject: '',
    hasAttachment: false,
    isUnread: false,
    isStarred: false
  });
  const [searchResults, setSearchResults] = useState<Email[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Focus search input when modal opens
      setTimeout(() => {
        const input = document.getElementById('search-input');
        input?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchParams.query.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchParams]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const results = await emailService.searchEmails(searchParams);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEmailClick = (email: Email) => {
    onEmailSelect(email);
    onClose();
  };

  const clearSearch = () => {
    setSearchParams({
      query: '',
      from: '',
      to: '',
      subject: '',
      hasAttachment: false,
      isUnread: false,
      isStarred: false
    });
    setSearchResults([]);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={cn(
              "rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col",
              isLiquidGlass ? "liquid-glass-card" : "glass-card"
            )}
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Search Header */}
            <div className="p-6 border-b border-cream/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cream/60" size={20} />
                  <input
                    id="search-input"
                    type="text"
                    value={searchParams.query}
                    onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
                    placeholder="Search emails..."
                    className={cn(
                      "w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none text-lg font-light",
                      isLiquidGlass ? "liquid-glass-input" : "glass-input"
                    )}
                  />
                </div>
                <Button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  variant={showAdvanced ? 'primary' : 'secondary'}
                  icon={<Filter size={16} />}
                >
                  Advanced
                </Button>
                <motion.button
                  onClick={onClose}
                  className="p-4 hover:bg-cream/10 rounded-xl transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} className="text-cream/70" />
                </motion.button>
              </div>

              {/* Advanced Search */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-light text-cream/80 mb-2">From</label>
                        <input
                          type="text"
                          value={searchParams.from || ''}
                          onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                          placeholder="sender@email.com"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                            isLiquidGlass ? "liquid-glass-input" : "glass-input"
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-light text-cream/80 mb-2">To</label>
                        <input
                          type="text"
                          value={searchParams.to || ''}
                          onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                          placeholder="recipient@email.com"
                          className={cn(
                            "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                            isLiquidGlass ? "liquid-glass-input" : "glass-input"
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-light text-cream/80 mb-2">Subject</label>
                      <input
                        type="text"
                        value={searchParams.subject || ''}
                        onChange={(e) => setSearchParams({ ...searchParams, subject: e.target.value })}
                        placeholder="Email subject"
                        className={cn(
                          "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                          isLiquidGlass ? "liquid-glass-input" : "glass-input"
                        )}
                      />
                    </div>

                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={searchParams.hasAttachment || false}
                          onChange={(e) => setSearchParams({ ...searchParams, hasAttachment: e.target.checked })}
                          className="rounded bg-transparent border-cream/30 text-cloud-blue focus:ring-cloud-blue/50"
                        />
                        <Paperclip size={16} className="text-cream/60" />
                        <span className="text-sm font-light text-cream/80">Has attachments</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={searchParams.isUnread || false}
                          onChange={(e) => setSearchParams({ ...searchParams, isUnread: e.target.checked })}
                          className="rounded bg-transparent border-cream/30 text-cloud-blue focus:ring-cloud-blue/50"
                        />
                        <Mail size={16} className="text-cream/60" />
                        <span className="text-sm font-light text-cream/80">Unread only</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={searchParams.isStarred || false}
                          onChange={(e) => setSearchParams({ ...searchParams, isStarred: e.target.checked })}
                          className="rounded bg-transparent border-cream/30 text-cloud-blue focus:ring-cloud-blue/50"
                        />
                        <Star size={16} className="text-cream/60" />
                        <span className="text-sm font-light text-cream/80">Starred only</span>
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={performSearch}
                        variant="primary"
                        icon={<Search size={16} />}
                      >
                        Search
                      </Button>
                      <Button
                        onClick={clearSearch}
                        variant="ghost"
                      >
                        Clear
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto">
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Search size={20} className="text-cream/60" />
                    </motion.div>
                    <span className="text-cream/60 font-light">Searching...</span>
                  </div>
                </div>
              ) : searchResults.length === 0 && searchParams.query ? (
                <div className="text-center py-12">
                  <Search size={48} className="text-cream/40 mx-auto mb-4" />
                  <p className="text-cream/60 font-light">No emails found</p>
                  <p className="text-sm text-cream/40 font-light mt-2">Try adjusting your search criteria</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search size={48} className="text-cream/40 mx-auto mb-4" />
                  <p className="text-cream/60 font-light">Start typing to search emails</p>
                  <p className="text-sm text-cream/40 font-light mt-2">Search by sender, subject, or content</p>
                </div>
              ) : (
                <div className="p-6 space-y-2">
                  <div className="text-sm text-cream/60 font-light mb-4">
                    Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                  </div>
                  {searchResults.map((email, index) => (
                    <motion.div
                      key={email.id}
                      onClick={() => handleEmailClick(email)}
                      className={cn(
                        "p-4 rounded-xl cursor-pointer transition-all duration-300 hover:bg-cream/5",
                        isLiquidGlass ? "liquid-glass-email-item" : "email-item"
                      )}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "text-sm font-light text-cream/90",
                                !email.isRead && "font-medium text-cream"
                              )}>
                                {email.from.name}
                              </span>
                              {email.isStarred && (
                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                              )}
                              {email.attachments && email.attachments.length > 0 && (
                                <Paperclip size={14} className="text-cream/40" />
                              )}
                            </div>
                            <span className="text-xs text-cream/50 flex-shrink-0 font-light">
                              {formatDate(email.timestamp)}
                            </span>
                          </div>

                          <h3 className={cn(
                            "text-sm truncate font-light text-cream/85 mb-1",
                            !email.isRead && "font-medium text-cream"
                          )}>
                            {email.subject}
                          </h3>

                          <p className="text-sm text-cream/60 truncate font-light">
                            {email.body.replace(/\n/g, ' ')}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};