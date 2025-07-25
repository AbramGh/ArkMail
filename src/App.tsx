import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './contexts/ThemeContext';
import AnimatedBackground from './components/AnimatedBackground';
import { AdvancedGlassDemo } from './components/AdvancedGlassDemo';
import { Sidebar } from './components/Sidebar';
import { EmailList } from './components/EmailList';
import { EmailDetail } from './components/EmailDetail';
import { ComposeModal } from './components/ComposeModal';
import { SettingsModal } from './components/SettingsModal';
import { AccountManager } from './components/AccountManager';
import { SearchModal } from './components/SearchModal';
import { NotificationCenter } from './components/NotificationCenter';
import { TemplateManager } from './components/TemplateManager';
import { EmailAnalytics } from './components/EmailAnalytics';
import { mockEmails, mockFolders } from './data/mockData';
import { emailService } from './services/emailService';
import { notificationService } from './services/notificationService';
import { offlineService } from './services/offlineService';
import { useEmailData } from './hooks/useEmailData';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import type { Email, EmailFolder } from './types/email';

function App() {
  const { currentTheme } = useTheme();
  
  // Use custom hooks for data management
  const {
    emails,
    selectedEmail,
    selectedFolder,
    selectedAccount,
    isLoading,
    error,
    searchResults,
    unreadCount,
    selectEmail,
    selectFolder,
    selectAccount,
    searchEmails,
    markAsRead,
    toggleStar,
    archiveEmail,
    deleteEmail,
    refreshEmails
  } = useEmailData();
  
  // UI state
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccountManagerOpen, setIsAccountManagerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'sender' | 'subject'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [replyToEmail, setReplyToEmail] = useState<Email | null>(null);
  const [forwardEmail, setForwardEmail] = useState<Email | null>(null);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCompose: () => setIsComposeOpen(true),
    onReply: () => selectedEmail && handleReply(selectedEmail.id),
    onForward: () => selectedEmail && handleForward(selectedEmail.id),
    onArchive: () => selectedEmail && archiveEmail(selectedEmail.id),
    onDelete: () => selectedEmail && deleteEmail(selectedEmail.id),
    onToggleStar: () => selectedEmail && toggleStar(selectedEmail.id),
    onMarkAsRead: () => selectedEmail && markAsRead(selectedEmail.id, true),
    onMarkAsUnread: () => selectedEmail && markAsRead(selectedEmail.id, false),
    onSearch: () => setIsSearchOpen(true),
    onRefresh: refreshEmails,
    onEscape: () => {
      setIsComposeOpen(false);
      setIsSearchOpen(false);
      setIsSettingsOpen(false);
      setIsAccountManagerOpen(false);
      setIsNotificationsOpen(false);
      setIsTemplatesOpen(false);
      setIsAnalyticsOpen(false);
    }
  });

  // Initialize services
  React.useEffect(() => {
    // Request notification permission
    notificationService.requestPermission();
    
    // Load cached data if offline
    if (offlineService.isOffline()) {
      loadOfflineData();
    }
  }, []);

  const loadOfflineData = async () => {
    try {
      const cachedEmails = await offlineService.getCachedEmails();
      // This would be handled by the useEmailData hook
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const filteredEmails = emails.filter(email => {
    if (!email) return false;
    
    const matchesFolder = selectedFolder === 'inbox' ? !email.isArchived && !email.isDeleted && email.folder === 'inbox' :
                         selectedFolder === 'sent' ? email.folder === 'sent' :
                         selectedFolder === 'drafts' ? email.folder === 'drafts' :
                         selectedFolder === 'trash' ? email.isDeleted :
                         selectedFolder === 'archive' ? email.isArchived :
                         selectedFolder === 'starred' ? email.isStarred :
                         email.folder === selectedFolder;
    
    return matchesFolder;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.timestamp.getTime() - b.timestamp.getTime();
        break;
      case 'sender':
        comparison = a.from.name.localeCompare(b.from.name);
        break;
      case 'subject':
        comparison = a.subject.localeCompare(b.subject);
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const handleEmailSelectionToggle = (emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === filteredEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredEmails.map(email => email.id));
    }
  };

  const handleBulkAction = async (action: string, emailIds: string[]) => {
    try {
      switch (action) {
        case 'archive':
          for (const emailId of emailIds) {
            await archiveEmail(emailId);
          }
          break;
        case 'delete':
          for (const emailId of emailIds) {
            await deleteEmail(emailId);
          }
          break;
        case 'star':
          for (const emailId of emailIds) {
            await toggleStar(emailId);
          }
          break;
        case 'mark_read':
          for (const emailId of emailIds) {
            await markAsRead(emailId, true);
          }
          break;
        case 'mark_unread':
          for (const emailId of emailIds) {
            await markAsRead(emailId, false);
          }
          break;
      }
      setSelectedEmails([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const handleReply = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      setReplyToEmail(email);
      setIsComposeOpen(true);
    }
  };

  const handleForward = (emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    if (email) {
      setForwardEmail(email);
      setIsComposeOpen(true);
    }
  };

  const handleSort = (field: 'date' | 'sender' | 'subject') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSend = (emailData: {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    body: string;
    attachments?: File[];
    scheduledTime?: Date;
  }) => {
    // This would be handled by the email service
    console.log('Sending email:', emailData);
    setIsComposeOpen(false);
    setReplyToEmail(null);
    setForwardEmail(null);
    
    // Queue action if offline
    if (offlineService.isOffline()) {
      offlineService.queueAction('send', emailData);
    }
  };

  const handleSaveDraft = (draftData: any) => {
    // This would be handled by the email service
    console.log('Saving draft:', draftData);
  };

  const handleSearchEmailSelect = (email: Email) => {
    selectEmail(email.id);
    // Mark as read when selected
    if (!email.isRead) {
      markAsRead(email.id, true);
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-cream">
        <div className="text-center">
          <h2 className="text-xl font-light mb-2">Something went wrong</h2>
          <p className="text-cream/60 mb-4">{error}</p>
          <button 
            onClick={refreshEmails}
            className="px-4 py-2 bg-cloud-blue/20 rounded-lg hover:bg-cloud-blue/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex h-screen text-cream font-light overflow-hidden"
      style={{
        // background: currentTheme.gradients.background, // VERWIJDERD zodat custom backgrounds werken
        color: currentTheme.colors.foreground
      }}
    >
      <AnimatedBackground />
      
      {/* SVG Filter for Glass Distortion */}
      <svg className="fixed inset-0 pointer-events-none" style={{ width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence 
              type="turbulence" 
              baseFrequency="0.008" 
              numOctaves={2} 
              result="noise"
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale="77"
            />
          </filter>
          <filter id="glass-blur" x="0%" y="0%" width="100%" height="100%">
            <feGaussianBlur 
              in="SourceGraphic" 
              stdDeviation="8"
            />
            <feColorMatrix 
              type="saturate" 
              values="1.8"
            />
          </filter>
        </defs>
      </svg>
      
      <Sidebar
        folders={mockFolders}
        selectedFolder={selectedFolder}
        onFolderSelect={selectFolder}
        onCompose={() => setIsComposeOpen(true)}
        onSettings={() => setIsSettingsOpen(true)}
        onSearch={() => setIsSearchOpen(true)}
        onAccountManager={() => setIsAccountManagerOpen(true)}
        onNotifications={() => setIsNotificationsOpen(true)}
        onAnalytics={() => setIsAnalyticsOpen(true)}
        onTemplates={() => setIsTemplatesOpen(true)}
      />

      <motion.div 
        className="flex-1 flex min-w-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <EmailList
          emails={filteredEmails}
          selectedEmailId={selectedEmail?.id || null}
          onEmailSelect={selectEmail}
          onStarToggle={toggleStar}
          onArchive={archiveEmail}
          onDelete={deleteEmail}
          onBulkAction={handleBulkAction}
          selectedEmails={selectedEmails}
          onEmailSelectionToggle={handleEmailSelectionToggle}
          onSelectAll={handleSelectAll}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          isLoading={isLoading}
        />

        <AnimatePresence mode="wait">
          {selectedEmail && (
            <EmailDetail
              email={selectedEmail}
              onStarToggle={toggleStar}
              onArchive={archiveEmail}
              onDelete={deleteEmail}
              onReply={handleReply}
              onForward={handleForward}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isComposeOpen && (
          <ComposeModal
            isOpen={isComposeOpen}
            onClose={() => setIsComposeOpen(false)}
            onSend={handleSend}
            replyTo={replyToEmail}
            forwardEmail={forwardEmail}
            onSaveDraft={handleSaveDraft}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAccountManagerOpen && (
          <AccountManager
            isOpen={isAccountManagerOpen}
            onClose={() => setIsAccountManagerOpen(false)}
          />
        )}
      </AnimatePresence>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onEmailSelect={handleSearchEmailSelect}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <TemplateManager
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={(template) => {
          // Handle template selection for compose
          console.log('Selected template:', template);
        }}
      />

      <EmailAnalytics
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  );
}

export default App;