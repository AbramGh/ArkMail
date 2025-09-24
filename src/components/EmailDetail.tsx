import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Archive, Trash2, Tag, Reply, ReplyAll, Forward, 
  MoreHorizontal, Paperclip, Download, Clock, ChevronDown,
  Send, Bold, Italic, Underline, Link, Image, Smile
} from 'lucide-react';
import { Email } from '../types/email';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/Button';
import GlassSurface from './GlassSurface';

interface EmailDetailProps {
  email: Email | null;
  onStarToggle: (emailId: string) => void;
  onArchive: (emailId: string) => void;
  onDelete: (emailId: string) => void;
  onReply: (emailId: string) => void;
  onForward: (emailId: string) => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({
  email,
  onStarToggle,
  onArchive,
  onDelete,
  onReply
}) => {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme.id === 'liquid-glass';
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  if (!email) {
    return (
      <motion.div 
        className={cn(
          "flex-1 flex items-center justify-center m-2 rounded-2xl",
          isLiquidGlass ? "liquid-glass-card" : "glass-card"
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="text-center text-cream/60">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-lg font-light">No email selected</p>
            <p className="text-sm mt-2 font-light">Choose an email from the list to view it here</p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      onReply(email.id);
      setReplyText('');
      setShowReply(false);
    }
  };

  return (
    <motion.div 
      className={cn(
        "flex-1 flex flex-col m-2 rounded-2xl overflow-hidden",
        isLiquidGlass ? "liquid-glass-card" : "glass-card"
      )}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Email Header */}
      <GlassSurface
        className="border-b border-cream/10 p-8"
        contentAlignment="left"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-light text-cream">{email.subject}</h1>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => onStarToggle(email.id)}
                className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Star
                  size={18}
                  className={email.isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-cream/60'}
                />
              </motion.button>
              <motion.button
                onClick={() => onArchive(email.id)}
                className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Archive size={18} className="text-cream/60" />
              </motion.button>
              <motion.button
                onClick={() => onDelete(email.id)}
                className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 size={18} className="text-cream/60" />
              </motion.button>
              <motion.button 
                className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Tag size={18} className="text-cream/60" />
              </motion.button>
              <motion.button 
                className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MoreHorizontal size={18} className="text-cream/60" />
              </motion.button>
            </div>
          </div>

          {/* From/To Info */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-4">
              {email.from.avatar && (
                <motion.img
                  src={email.from.avatar}
                  alt={email.from.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-cream/20"
                  whileHover={{ scale: 1.1 }}
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-cream">{email.from.name}</span>
                  <span className="text-sm text-cream/60 font-light">&lt;{email.from.email}&gt;</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-cream/50 mt-1 font-light">
                  <span>to {email.to.map(t => t.name).join(', ')}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(email.timestamp)}
                  </span>
                </div>
              </div>
              <motion.button 
                className="p-1 hover:bg-cream/10 rounded transition-colors"
                whileHover={{ rotate: 180 }}
              >
                <ChevronDown size={18} className="text-cream/60" />
              </motion.button>
            </div>

            {/* Labels */}
            {email.labels.length > 0 && (
              <motion.div 
                className="flex gap-2 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {email.labels.map((label) => (
                  <motion.span
                    key={label}
                    className="px-3 py-1 text-xs bg-cloud-blue/20 text-cream/80 rounded-full border border-cloud-blue/30 font-light"
                    whileHover={{ scale: 1.05 }}
                  >
                    {label}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </GlassSurface>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto">
        <motion.div 
          className="p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="prose max-w-none">
            {email.body.split('\n').map((paragraph, index) => (
              <motion.p 
                key={index} 
                className="mb-4 text-cream/85 leading-relaxed font-light"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 && (
            <motion.div 
              className="mt-8 border-t border-cream/10 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="font-medium text-cream mb-4 font-light">
                Attachments ({email.attachments.length})
              </h3>
              <div className="space-y-3">
                {email.attachments.map((attachment, index) => (
                  <motion.div
                    key={attachment.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl hover:bg-cream/5 transition-colors",
                      isLiquidGlass ? "liquid-glass-card" : "glass-card"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Paperclip size={18} className="text-cream/60" />
                    <div className="flex-1">
                      <p className="font-medium text-cream font-light">{attachment.name}</p>
                      <p className="text-sm text-cream/60 font-light">{formatFileSize(attachment.size)}</p>
                    </div>
                    <motion.button 
                      className="p-2 hover:bg-cream/10 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Download size={16} className="text-cream/60" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <GlassSurface
          className="border-t border-cream/10 px-8 py-6"
          contentAlignment="left"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex gap-4">
              <Button
                onClick={() => setShowReply(!showReply)}
                variant="primary"
                icon={<Reply size={16} />}
              >
                Reply
              </Button>
              <Button
                variant="secondary"
                icon={<ReplyAll size={16} />}
              >
                Reply All
              </Button>
              <Button
                variant="secondary"
                icon={<Forward size={16} />}
              >
                Forward
              </Button>
            </div>
          </motion.div>
        </GlassSurface>

        {/* Reply Compose */}
        <AnimatePresence>
          {showReply && (
            <motion.div 
              className="border-t border-cream/10 p-8 backdrop-blur-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={cn(
                "rounded-xl p-6",
                isLiquidGlass ? "liquid-glass-card" : "glass-card"
              )}>
                <div className="flex items-center gap-2 mb-4 text-sm text-cream/70 font-light">
                  <span>To: {email.from.name} {`<${email.from.email}>`}</span>
                </div>
                
                {/* Rich Text Toolbar */}
                <div className="flex items-center gap-2 border-b border-cream/10 pb-4 mb-4">
                  {[Bold, Italic, Underline, Link, Image, Smile].map((Icon, index) => (
                    <motion.button 
                      key={index}
                      className="p-2 hover:bg-cream/10 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon size={16} className="text-cream/60" />
                    </motion.button>
                  ))}
                </div>

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className={cn(
                    "w-full h-32 p-4 rounded-xl resize-none focus:outline-none font-light",
                    isLiquidGlass ? "liquid-glass-input" : "glass-input"
                  )}
                />
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-2">
                    <motion.button 
                      className="p-2 hover:bg-cream/10 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Paperclip size={16} className="text-cream/60" />
                    </motion.button>
                    <motion.button 
                      className="p-2 hover:bg-cream/10 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Image size={16} className="text-cream/60" />
                    </motion.button>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowReply(false)}
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendReply}
                      variant="primary"
                      icon={<Send size={16} />}
                      disabled={!replyText.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};