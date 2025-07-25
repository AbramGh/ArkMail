import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Mail, Send, Clock, Users, 
  Paperclip, Star, Archive, X, Calendar, Download,
  Filter, RefreshCw, Eye, MessageCircle
} from 'lucide-react';
import { EmailAnalytics as EmailAnalyticsType } from '../types/email';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';

interface EmailAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailAnalytics: React.FC<EmailAnalyticsProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme.id === 'liquid-glass';
  const [analytics, setAnalytics] = useState<EmailAnalyticsType | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen, timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    
    // Mock analytics data - in real app, fetch from service
    setTimeout(() => {
      const mockAnalytics: EmailAnalyticsType = {
        totalEmails: 1247,
        unreadCount: 23,
        sentToday: 8,
        receivedToday: 15,
        averageResponseTime: 2.5, // hours
        topSenders: [
          { email: 'sarah.johnson@company.com', name: 'Sarah Johnson', count: 45 },
          { email: 'notifications@github.com', name: 'GitHub', count: 38 },
          { email: 'team@slack.com', name: 'Slack', count: 32 },
          { email: 'john.smith@tech.com', name: 'John Smith', count: 28 },
          { email: 'support@notion.so', name: 'Notion', count: 24 }
        ],
        emailsByHour: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count: Math.floor(Math.random() * 20) + (i >= 9 && i <= 17 ? 10 : 2)
        })),
        attachmentStats: {
          totalSize: 2.4 * 1024 * 1024 * 1024, // 2.4 GB
          totalCount: 156,
          typeBreakdown: {
            'PDF': 45,
            'Image': 38,
            'Document': 32,
            'Spreadsheet': 24,
            'Archive': 17
          }
        }
      };
      
      setAnalytics(mockAnalytics);
      setIsLoading(false);
    }, 1000);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getMaxEmailCount = () => {
    if (!analytics) return 0;
    return Math.max(...analytics.emailsByHour.map(h => h.count));
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
              "rounded-2xl shadow-2xl w-full max-w-6xl h-[700px] flex flex-col",
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
                <BarChart3 size={20} className="text-cream" />
                <h2 className="text-xl font-light text-cream">Email Analytics</h2>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className={cn(
                    "px-3 py-2 rounded-lg focus:outline-none font-light text-sm",
                    isLiquidGlass ? "liquid-glass-input" : "glass-input"
                  )}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <motion.button
                  onClick={loadAnalytics}
                  className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isLoading}
                >
                  <RefreshCw size={16} className={`text-cream/70 ${isLoading ? 'animate-spin' : ''}`} />
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} className="text-cream/70" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <BarChart3 size={24} className="text-cream/60" />
                    </motion.div>
                    <span className="text-cream/60 font-light">Loading analytics...</span>
                  </div>
                </div>
              ) : analytics ? (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { 
                        label: 'Total Emails', 
                        value: analytics.totalEmails.toLocaleString(), 
                        icon: Mail, 
                        color: 'text-blue-400' 
                      },
                      { 
                        label: 'Unread', 
                        value: analytics.unreadCount.toString(), 
                        icon: Eye, 
                        color: 'text-orange-400' 
                      },
                      { 
                        label: 'Sent Today', 
                        value: analytics.sentToday.toString(), 
                        icon: Send, 
                        color: 'text-green-400' 
                      },
                      { 
                        label: 'Avg Response Time', 
                        value: `${analytics.averageResponseTime}h`, 
                        icon: Clock, 
                        color: 'text-purple-400' 
                      }
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        className={cn(
                          "p-4 rounded-xl",
                          isLiquidGlass ? "liquid-glass-card" : "glass-card"
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <metric.icon size={20} className={metric.color} />
                          <span className="text-sm font-light text-cream/80">{metric.label}</span>
                        </div>
                        <p className="text-2xl font-light text-cream">{metric.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Email Activity Chart */}
                  <motion.div
                    className={cn(
                      "p-6 rounded-xl",
                      isLiquidGlass ? "liquid-glass-card" : "glass-card"
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-lg font-light text-cream mb-4 flex items-center gap-2">
                      <TrendingUp size={18} />
                      Email Activity by Hour
                    </h3>
                    <div className="flex items-end gap-1 h-32">
                      {analytics.emailsByHour.map((hour, index) => (
                        <motion.div
                          key={hour.hour}
                          className="flex-1 bg-gradient-to-t from-blue-500/30 to-blue-400/60 rounded-t"
                          style={{ 
                            height: `${(hour.count / getMaxEmailCount()) * 100}%`,
                            minHeight: '4px'
                          }}
                          initial={{ height: 0 }}
                          animate={{ height: `${(hour.count / getMaxEmailCount()) * 100}%` }}
                          transition={{ delay: 0.5 + index * 0.02 }}
                          title={`${hour.hour}:00 - ${hour.count} emails`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-cream/50 mt-2">
                      <span>0:00</span>
                      <span>6:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                      <span>23:00</span>
                    </div>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Top Senders */}
                    <motion.div
                      className={cn(
                        "p-6 rounded-xl",
                        isLiquidGlass ? "liquid-glass-card" : "glass-card"
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-lg font-light text-cream mb-4 flex items-center gap-2">
                        <Users size={18} />
                        Top Senders
                      </h3>
                      <div className="space-y-3">
                        {analytics.topSenders.map((sender, index) => (
                          <motion.div
                            key={sender.email}
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-light text-cream truncate">{sender.name}</p>
                              <p className="text-xs text-cream/60 truncate">{sender.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-cream/20 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(sender.count / analytics.topSenders[0].count) * 100}%` }}
                                  transition={{ delay: 0.8 + index * 0.1 }}
                                />
                              </div>
                              <span className="text-sm font-light text-cream/80 w-8 text-right">
                                {sender.count}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Attachment Stats */}
                    <motion.div
                      className={cn(
                        "p-6 rounded-xl",
                        isLiquidGlass ? "liquid-glass-card" : "glass-card"
                      )}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-lg font-light text-cream mb-4 flex items-center gap-2">
                        <Paperclip size={18} />
                        Attachments
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-light text-cream/80">Total Size</span>
                          <span className="text-sm font-light text-cream">
                            {formatFileSize(analytics.attachmentStats.totalSize)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-light text-cream/80">Total Count</span>
                          <span className="text-sm font-light text-cream">
                            {analytics.attachmentStats.totalCount}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-light text-cream/80">By Type</p>
                          {Object.entries(analytics.attachmentStats.typeBreakdown).map(([type, count], index) => (
                            <motion.div
                              key={type}
                              className="flex items-center justify-between"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                            >
                              <span className="text-xs font-light text-cream/70">{type}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-12 h-1.5 bg-cream/20 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(count / Math.max(...Object.values(analytics.attachmentStats.typeBreakdown))) * 100}%` }}
                                    transition={{ delay: 0.9 + index * 0.1 }}
                                  />
                                </div>
                                <span className="text-xs font-light text-cream/80 w-6 text-right">
                                  {count}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-cream/60">
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-40" />
                    <p className="font-light">No analytics data available</p>
                    <p className="text-sm mt-2 opacity-60">Analytics will appear once you have email activity</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};