import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Send, Paperclip, Image, Smile, Bold, Italic, Underline, 
  Link, MoreHorizontal, Minimize2, Maximize2, Upload, FileText, 
  Calendar, Clock, Save
} from 'lucide-react';
import { Email } from '../types/email';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    body: string;
    attachments?: File[];
    scheduledTime?: Date;
  }) => void;
  replyTo?: Email | null;
  forwardEmail?: Email | null;
  onSaveDraft?: (draft: any) => void;
}

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  onSend,
  replyTo,
  forwardEmail,
  onSaveDraft
}) => {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme.id === 'liquid-glass';
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [isDraft, setIsDraft] = useState(false);

  // Auto-save draft functionality
  React.useEffect(() => {
    if (!isOpen) return;
    
    const autoSaveInterval = setInterval(() => {
      if (to.trim() || subject.trim() || body.trim()) {
        handleSaveDraft();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [to, subject, body, isOpen]);

  // Initialize with reply/forward data
  React.useEffect(() => {
    if (replyTo) {
      setTo(replyTo.from.email);
      setSubject(replyTo.subject.startsWith('Re:') ? replyTo.subject : `Re: ${replyTo.subject}`);
      setBody(`\n\n--- Original Message ---\nFrom: ${replyTo.from.name} <${replyTo.from.email}>\nDate: ${replyTo.timestamp.toLocaleString()}\nSubject: ${replyTo.subject}\n\n${replyTo.body}`);
    } else if (forwardEmail) {
      setSubject(forwardEmail.subject.startsWith('Fwd:') ? forwardEmail.subject : `Fwd: ${forwardEmail.subject}`);
      setBody(`\n\n--- Forwarded Message ---\nFrom: ${forwardEmail.from.name} <${forwardEmail.from.email}>\nDate: ${forwardEmail.timestamp.toLocaleString()}\nSubject: ${forwardEmail.subject}\nTo: ${forwardEmail.to.map(t => t.email).join(', ')}\n\n${forwardEmail.body}`);
    }
  }, [replyTo, forwardEmail]);

  const handleSend = () => {
    if (to.trim() && subject.trim() && body.trim()) {
      onSend({
        to: to.trim(),
        cc: cc.trim() || undefined,
        bcc: bcc.trim() || undefined,
        subject: subject.trim(),
        body: body.trim(),
        attachments: attachments.length > 0 ? attachments : undefined,
        scheduledTime: isScheduled ? scheduledTime || undefined : undefined
      });
      
      // Reset form
      resetForm();
      onClose();
    }
  };

  const handleSaveDraft = () => {
    if (onSaveDraft && (to.trim() || subject.trim() || body.trim())) {
      onSaveDraft({
        to: to.trim(),
        cc: cc.trim(),
        bcc: bcc.trim(),
        subject: subject.trim(),
        body: body.trim(),
        attachments,
        lastSaved: new Date()
      });
      setIsDraft(true);
      setTimeout(() => setIsDraft(false), 2000);
    }
  };

  const resetForm = () => {
      setTo('');
      setCc('');
      setBcc('');
      setSubject('');
      setBody('');
      setShowCc(false);
      setShowBcc(false);
      setAttachments([]);
      setIsScheduled(false);
      setScheduledTime(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend();
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
              "rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col transition-all duration-300",
              isMinimized ? 'h-16' : 'h-[700px]',
              isLiquidGlass ? 'liquid-glass-card' : 'glass-card'
            )}
            onKeyDown={handleKeyDown}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream/10">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-light text-cream">
                  {replyTo ? 'Reply' : forwardEmail ? 'Forward' : 'New Message'}
                </h2>
                {isDraft && (
                  <motion.span
                    className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    Draft saved
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleSaveDraft}
                  className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Save draft"
                >
                  <Save size={16} className="text-cream/70" />
                </motion.button>
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMinimized ? <Maximize2 size={16} className="text-cream/70" /> : <Minimize2 size={16} className="text-cream/70" />}
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} className="text-cream/70" />
                </motion.button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Recipients */}
                <motion.div 
                  className="p-6 border-b border-cream/10 space-y-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-light text-cream/80 w-16">To:</label>
                    <input
                      type="email"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Recipients"
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl focus:outline-none font-light",
                        isLiquidGlass ? "liquid-glass-input" : "glass-input"
                      )}
                    />
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => setShowCc(!showCc)}
                        className="text-sm text-cloud-blue hover:text-cloud-lavender transition-colors font-light"
                        whileHover={{ scale: 1.05 }}
                      >
                        Cc
                      </motion.button>
                      <motion.button
                        onClick={() => setShowBcc(!showBcc)}
                        className="text-sm text-cloud-blue hover:text-cloud-lavender transition-colors font-light"
                        whileHover={{ scale: 1.05 }}
                      >
                        Bcc
                      </motion.button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showCc && (
                      <motion.div 
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="text-sm font-light text-cream/80 w-16">Cc:</label>
                        <input
                          type="email"
                          value={cc}
                          onChange={(e) => setCc(e.target.value)}
                          placeholder="Carbon copy recipients"
                          className={cn(
                            "flex-1 px-4 py-3 rounded-xl focus:outline-none font-light",
                            isLiquidGlass ? "liquid-glass-input" : "glass-input"
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showBcc && (
                      <motion.div 
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="text-sm font-light text-cream/80 w-16">Bcc:</label>
                        <input
                          type="email"
                          value={bcc}
                          onChange={(e) => setBcc(e.target.value)}
                          placeholder="Blind carbon copy recipients"
                          className={cn(
                            "flex-1 px-4 py-3 rounded-xl focus:outline-none font-light",
                            isLiquidGlass ? "liquid-glass-input" : "glass-input"
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-light text-cream/80 w-16">Subject:</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject"
                      className={cn(
                        "flex-1 px-4 py-3 rounded-xl focus:outline-none font-light",
                        isLiquidGlass ? "liquid-glass-input" : "glass-input"
                      )}
                    />
                  </div>

                  {/* Schedule Send */}
                  <AnimatePresence>
                    {isScheduled && (
                      <motion.div 
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="text-sm font-light text-cream/80 w-16">Send at:</label>
                        <input
                          type="datetime-local"
                          value={scheduledTime?.toISOString().slice(0, 16) || ''}
                          onChange={(e) => setScheduledTime(new Date(e.target.value))}
                          className={cn(
                            "flex-1 px-4 py-3 rounded-xl focus:outline-none font-light",
                            isLiquidGlass ? "liquid-glass-input" : "glass-input"
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Toolbar */}
                <motion.div 
                  className="flex items-center gap-2 p-6 border-b border-cream/10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {[Bold, Italic, Underline, Link].map((Icon, index) => (
                      <motion.button 
                        key={index}
                        className="p-2 hover:bg-cream/10 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon size={16} className="text-cream/60" />
                      </motion.button>
                    ))}
                    
                    <div className="w-px h-6 bg-cream/20 mx-2" />
                    
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <motion.button 
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="p-2 hover:bg-cream/10 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Paperclip size={16} className="text-cream/60" />
                    </motion.button>
                    
                    <motion.button 
                      className="p-2 hover:bg-cream/10 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Image size={16} className="text-cream/60" />
                    </motion.button>
                    
                    <motion.button 
                      className="p-2 hover:bg-cream/10 rounded transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Smile size={16} className="text-cream/60" />
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => setIsScheduled(!isScheduled)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-light",
                        isScheduled ? "bg-cloud-blue/20 text-cloud-blue" : "hover:bg-cream/10 text-cream/70"
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Clock size={14} />
                      Schedule
                    </motion.button>
                  </div>
                </motion.div>

                {/* Attachments */}
                {attachments.length > 0 && (
                  <motion.div 
                    className="px-6 py-4 border-b border-cream/10"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Paperclip size={16} className="text-cream/60" />
                      <span className="text-sm font-light text-cream/80">
                        {attachments.length} attachment{attachments.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <motion.div
                          key={index}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg",
                            isLiquidGlass ? "liquid-glass-card" : "glass-card"
                          )}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <FileText size={14} className="text-cream/60" />
                          <span className="text-sm font-light text-cream/80">{file.name}</span>
                          <span className="text-xs text-cream/50">({formatFileSize(file.size)})</span>
                          <motion.button
                            onClick={() => removeAttachment(index)}
                            className="p-1 hover:bg-cream/20 rounded transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X size={12} className="text-cream/60" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Body */}
                <motion.div 
                  className="flex-1 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Compose your message..."
                    className={cn(
                      "w-full h-full resize-none rounded-xl p-4 focus:outline-none font-light",
                      isLiquidGlass ? "liquid-glass-input" : "glass-input"
                    )}
                  />
                </motion.div>

                {/* Footer */}
                <motion.div 
                  className="flex items-center justify-between p-6 border-t border-cream/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-cream/50 font-light">
                      {isScheduled && scheduledTime ? `Scheduled for ${scheduledTime.toLocaleString()}` : 'Send now'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={onClose}
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveDraft}
                      variant="ghost"
                    >
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleSend}
                      disabled={!to.trim() || !subject.trim() || !body.trim()}
                      variant="primary"
                      icon={isScheduled ? <Clock size={16} /> : <Send size={16} />}
                    >
                      {isScheduled ? 'Schedule' : 'Send'}
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};