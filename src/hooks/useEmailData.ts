import { useState, useEffect, useCallback } from 'react';
import { Email, EmailAccount, EmailFolder, EmailSearch } from '../types/email';
import { emailService } from '../services/emailService';

export interface UseEmailDataReturn {
  emails: Email[];
  accounts: EmailAccount[];
  folders: EmailFolder[];
  selectedEmail: Email | null;
  selectedFolder: string;
  selectedAccount: string | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  searchResults: Email[];
  unreadCount: number;
  
  // Actions
  selectEmail: (emailId: string) => void;
  selectFolder: (folderId: string) => void;
  selectAccount: (accountId: string) => void;
  searchEmails: (query: string, filters?: Partial<EmailSearch>) => void;
  markAsRead: (emailId: string, isRead?: boolean) => void;
  toggleStar: (emailId: string) => void;
  archiveEmail: (emailId: string) => void;
  deleteEmail: (emailId: string) => void;
  refreshEmails: () => void;
}

export const useEmailData = (): UseEmailDataReturn => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [folders, setFolders] = useState<EmailFolder[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Email[]>([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load emails when folder or account changes
  useEffect(() => {
    if (selectedFolder) {
      loadEmails();
    }
  }, [selectedFolder, selectedAccount]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [emailData, accountData] = await Promise.all([
        emailService.getEmails(),
        emailService.getAccounts()
      ]);
      
      setEmails(emailData);
      setAccounts(accountData);
      
      // Set default account if available
      if (accountData.length > 0 && !selectedAccount) {
        setSelectedAccount(accountData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const emailData = await emailService.getEmails(selectedAccount || undefined, selectedFolder);
      setEmails(emailData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load emails');
    } finally {
      setIsLoading(false);
    }
  };

  const selectEmail = useCallback((emailId: string) => {
    const email = emails.find(e => e.id === emailId);
    setSelectedEmail(email || null);
    
    // Mark as read when selected
    if (email && !email.isRead) {
      markAsRead(emailId, true);
    }
  }, [emails]);

  const selectFolder = useCallback((folderId: string) => {
    setSelectedFolder(folderId);
    setSelectedEmail(null);
  }, []);

  const selectAccount = useCallback((accountId: string) => {
    setSelectedAccount(accountId);
    setSelectedEmail(null);
  }, []);

  const searchEmails = useCallback(async (query: string, filters?: Partial<EmailSearch>) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const searchParams: EmailSearch = {
        query,
        ...filters
      };
      
      const results = await emailService.searchEmails(searchParams);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    }
  }, []);

  const markAsRead = useCallback(async (emailId: string, isRead: boolean = true) => {
    try {
      await emailService.markAsRead(emailId, isRead);
      
      // Update local state
      setEmails(prevEmails => 
        prevEmails.map(email => 
          email.id === emailId ? { ...email, isRead } : email
        )
      );
      
      // Update selected email if it's the same
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(prev => prev ? { ...prev, isRead } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update email');
    }
  }, [selectedEmail]);

  const toggleStar = useCallback(async (emailId: string) => {
    try {
      await emailService.toggleStar(emailId);
      
      // Update local state
      setEmails(prevEmails => 
        prevEmails.map(email => 
          email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
        )
      );
      
      // Update selected email if it's the same
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(prev => prev ? { ...prev, isStarred: !prev.isStarred } : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle star');
    }
  }, [selectedEmail]);

  const archiveEmail = useCallback(async (emailId: string) => {
    try {
      await emailService.archiveEmail(emailId);
      
      // Remove from current view if not in archive folder
      if (selectedFolder !== 'archive') {
        setEmails(prevEmails => prevEmails.filter(email => email.id !== emailId));
      }
      
      // Clear selection if archived email was selected
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive email');
    }
  }, [selectedFolder, selectedEmail]);

  const deleteEmail = useCallback(async (emailId: string) => {
    try {
      await emailService.deleteEmail(emailId);
      
      // Remove from current view if not in trash folder
      if (selectedFolder !== 'trash') {
        setEmails(prevEmails => prevEmails.filter(email => email.id !== emailId));
      }
      
      // Clear selection if deleted email was selected
      if (selectedEmail?.id === emailId) {
        setSelectedEmail(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete email');
    }
  }, [selectedFolder, selectedEmail]);

  const refreshEmails = useCallback(() => {
    loadEmails();
  }, [selectedFolder, selectedAccount]);

  // Calculate unread count
  const unreadCount = emails.filter(email => !email.isRead && !email.isDeleted).length;

  return {
    emails,
    accounts,
    folders,
    selectedEmail,
    selectedFolder,
    selectedAccount,
    isLoading,
    error,
    searchQuery,
    searchResults,
    unreadCount,
    
    // Actions
    selectEmail,
    selectFolder,
    selectAccount,
    searchEmails,
    markAsRead,
    toggleStar,
    archiveEmail,
    deleteEmail,
    refreshEmails
  };
};