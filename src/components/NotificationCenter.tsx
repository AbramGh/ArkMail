import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, Check, Clock, Mail, Star, Archive, Trash2, 
  Settings, Filter, MoreHorizontal, CheckCircle, AlertCircle,
  Info, Calendar, User, FileText
} from 'lucide-react';
import { EmailNotification } from '../types/email';
import { notificationService } from '../services/notificationService';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme.id === 'liquid-glass';
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      
      // Subscribe to notification updates
      const unsubscribe = notificationService.subscribe((updatedNotifications) => {
        setNotifications(updatedNotifications);
      });
      
      return unsubscribe;
    }
  }, [isOpen]);

  const loadNotifications = () => {
    const allNotifications = notificationService.getNotifications();
    setNotifications(allNotifications);
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'important':
        return notification.type === 'important';
      default:
        return true;
    }
  });

  const handleMarkAsRead = async (notificationId: string) => {
    await notificationService.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
  };

  const handleRemoveNotification = async (notificationId: string) => {
    await notificationService.removeNotification(notificationId);
  };

  const getNotificationIcon = (type: EmailNotification['type']) => {
    switch (type) {
      case 'new_email':
        return <Mail size={16} className="text-blue-400" />;
      case 'reply':
        return <Mail size={16} className="text-green-400" />;
      case 'mention':
        return <User size={16} className="text-purple-400" />;
      case 'important':
        return <Star size={16} className="text-yellow-400" />;
      default:
        return <Bell size={16} className="text-cream/60" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
              "rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col",
              isLiquidGlass ? "liquid-glass-card" : "glass-card"
            )}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream/10">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-cream" />
                <h2 className="text-xl font-light text-cream">Notifications</h2>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                    {notifications.filter(n => !n.isRead).length} unread
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-cream/70 hover:text-cream transition-colors"
                >
                  Mark all read
                </Button>
                <Button
                  onClick={onClose}
                  className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                >
                  <X size={18} className="text-cream/70" />
                </Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-4 border-b border-cream/10">
              {['all', 'unread', 'important'].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setFilter(tab as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-light transition-colors",
                    filter === tab
                      ? "bg-cream/20 text-cream"
                      : "text-cream/60 hover:text-cream/80 hover:bg-cream/10"
                  )}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex items-center justify-center h-full text-cream/60">
                  <div className="text-center">
                    <Bell size={48} className="mx-auto mb-4 opacity-40" />
                    <p className="font-light">No notifications</p>
                    <p className="text-sm mt-2 opacity-60">You're all caught up!</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-300 group",
                        isLiquidGlass ? "liquid-glass-card" : "glass-card",
                        !notification.isRead && "border-blue-400/30 bg-blue-500/10"
                      )}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={cn(
                              "text-sm font-light text-cream",
                              !notification.isRead && "font-medium"
                            )}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-cream/50 flex-shrink-0">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-cream/70 font-light mb-3">
                            {notification.message}
                          </p>
                          
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex gap-2">
                              {notification.actions.map((action, actionIndex) => (
                                <Button
                                  key={actionIndex}
                                  variant="ghost"
                                  size="sm"
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <Button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 hover:bg-cream/20 rounded transition-colors"
                              title="Mark as read"
                            >
                              <Check size={14} className="text-cream/60" />
                            </Button>
                          )}
                          <Button
                            onClick={() => handleRemoveNotification(notification.id)}
                            className="p-1 hover:bg-cream/20 rounded transition-colors"
                            title="Remove"
                          >
                            <X size={14} className="text-cream/60" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-cream/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-cream/60 font-light">
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="ghost"
                  icon={<Settings size={14} />}
                >
                  Settings
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};