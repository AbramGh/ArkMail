import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Settings, Wifi, WifiOff, RefreshCw, Mail, 
  CheckCircle, AlertCircle, XCircle, User, Trash2
} from 'lucide-react';
import { EmailAccount } from '../types/email';
import { emailService } from '../services/emailService';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

interface AccountManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountManager: React.FC<AccountManagerProps> = ({ isOpen, onClose }) => {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme.id === 'liquid-glass';
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    provider: 'gmail' as const,
    password: '',
    imapServer: '',
    imapPort: 993,
    smtpServer: '',
    smtpPort: 587
  });

  useEffect(() => {
    if (isOpen) {
      loadAccounts();
    }
  }, [isOpen]);

  const loadAccounts = async () => {
    const accountList = emailService.getAccounts();
    setAccounts(accountList);
  };

  const handleAddAccount = async () => {
    try {
      const accountData = {
        name: newAccount.name,
        email: newAccount.email,
        provider: newAccount.provider,
        isDefault: accounts.length === 0,
        settings: {
          imapServer: newAccount.imapServer || getDefaultImapServer(newAccount.provider),
          imapPort: newAccount.imapPort,
          smtpServer: newAccount.smtpServer || getDefaultSmtpServer(newAccount.provider),
          smtpPort: newAccount.smtpPort,
          useSSL: true,
          useTLS: true
        }
      };

      await emailService.addAccount(accountData);
      await loadAccounts();
      setShowAddAccount(false);
      resetForm();
    } catch (error) {
      console.error('Failed to add account:', error);
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    try {
      await emailService.removeAccount(accountId);
      await loadAccounts();
    } catch (error) {
      console.error('Failed to remove account:', error);
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    try {
      await emailService.syncAccount(accountId);
      await loadAccounts();
    } catch (error) {
      console.error('Failed to sync account:', error);
    }
  };

  const resetForm = () => {
    setNewAccount({
      name: '',
      email: '',
      provider: 'gmail',
      password: '',
      imapServer: '',
      imapPort: 993,
      smtpServer: '',
      smtpPort: 587
    });
  };

  const getDefaultImapServer = (provider: string) => {
    const servers = {
      gmail: 'imap.gmail.com',
      outlook: 'outlook.office365.com',
      yahoo: 'imap.mail.yahoo.com',
      imap: '',
      exchange: ''
    };
    return servers[provider as keyof typeof servers] || '';
  };

  const getDefaultSmtpServer = (provider: string) => {
    const servers = {
      gmail: 'smtp.gmail.com',
      outlook: 'smtp.office365.com',
      yahoo: 'smtp.mail.yahoo.com',
      imap: '',
      exchange: ''
    };
    return servers[provider as keyof typeof servers] || '';
  };

  const getSyncStatusIcon = (status: EmailAccount['syncStatus']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'syncing':
        return <RefreshCw size={16} className="text-blue-400 animate-spin" />;
      case 'error':
        return <XCircle size={16} className="text-red-400" />;
      case 'offline':
        return <WifiOff size={16} className="text-gray-400" />;
      default:
        return <AlertCircle size={16} className="text-yellow-400" />;
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
              "rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col",
              isLiquidGlass ? "liquid-glass-card" : "glass-card"
            )}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream/10">
              <h2 className="text-xl font-light text-cream">Email Accounts</h2>
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setShowAddAccount(true)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl font-medium",
                    isLiquidGlass ? "liquid-glass-button" : "gradient-button"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={16} />
                  Add Account
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XCircle size={18} className="text-cream/70" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {showAddAccount ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-light text-cream">Add New Account</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-light text-cream/80 mb-2">Name</label>
                      <input
                        type="text"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                          isLiquidGlass ? "liquid-glass-input" : "glass-input"
                        )}
                        placeholder="Your Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-light text-cream/80 mb-2">Email</label>
                      <input
                        type="email"
                        value={newAccount.email}
                        onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                          isLiquidGlass ? "liquid-glass-input" : "glass-input"
                        )}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-light text-cream/80 mb-2">Provider</label>
                    <select
                      value={newAccount.provider}
                      onChange={(e) => setNewAccount({ ...newAccount, provider: e.target.value as any })}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                        isLiquidGlass ? "liquid-glass-input" : "glass-input"
                      )}
                    >
                      <option value="gmail">Gmail</option>
                      <option value="outlook">Outlook</option>
                      <option value="yahoo">Yahoo</option>
                      <option value="imap">Custom IMAP</option>
                    </select>
                  </div>

                  {newAccount.provider === 'imap' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-light text-cream/80 mb-2">IMAP Server</label>
                        <input
                          type="text"
                          value={newAccount.imapServer}
                          onChange={(e) => setNewAccount({ ...newAccount, imapServer: e.target.value })}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                            isLiquidGlass ? "liquid-glass-input" : "glass-input"
                          )}
                          placeholder="imap.example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-cream/80 mb-2">SMTP Server</label>
                        <input
                          type="text"
                          value={newAccount.smtpServer}
                          onChange={(e) => setNewAccount({ ...newAccount, smtpServer: e.target.value })}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl focus:outline-none font-light",
                            isLiquidGlass ? "liquid-glass-input" : "glass-input"
                          )}
                          placeholder="smtp.example.com"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleAddAccount}
                      className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-medium",
                        isLiquidGlass ? "liquid-glass-button" : "gradient-button"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add Account
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        setShowAddAccount(false);
                        resetForm();
                      }}
                      className="px-6 py-3 text-cream/70 hover:bg-cream/10 rounded-xl transition-colors font-light"
                      whileHover={{ scale: 1.02 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {accounts.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail size={48} className="text-cream/40 mx-auto mb-4" />
                      <p className="text-cream/60 font-light">No email accounts configured</p>
                      <p className="text-sm text-cream/40 font-light mt-2">Add an account to get started</p>
                    </div>
                  ) : (
                    accounts.map((account, index) => (
                      <motion.div
                        key={account.id}
                        className={cn(
                          "p-4 rounded-xl border transition-all duration-300",
                          isLiquidGlass ? "liquid-glass-card" : "glass-card"
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-cloud-blue to-cloud-lavender rounded-full flex items-center justify-center">
                              <User size={20} className="text-cream" />
                            </div>
                            <div>
                              <h3 className="font-medium text-cream">{account.name}</h3>
                              <p className="text-sm text-cream/60 font-light">{account.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {getSyncStatusIcon(account.syncStatus)}
                                <span className="text-xs text-cream/50 font-light capitalize">
                                  {account.syncStatus}
                                </span>
                                {account.unreadCount > 0 && (
                                  <span className="text-xs px-2 py-1 bg-cloud-blue/20 text-cream rounded-full">
                                    {account.unreadCount} unread
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => handleSyncAccount(account.id)}
                              className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              disabled={account.syncStatus === 'syncing'}
                            >
                              <RefreshCw 
                                size={16} 
                                className={`text-cream/60 ${account.syncStatus === 'syncing' ? 'animate-spin' : ''}`} 
                              />
                            </motion.button>
                            <motion.button
                              onClick={() => handleRemoveAccount(account.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};