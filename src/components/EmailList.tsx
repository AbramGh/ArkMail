import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Paperclip, Archive, Trash2, Tag, MoreHorizontal, CheckSquare, Square } from 'lucide-react';
import { Email } from '../types/email';
import { cn } from '../lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useDragAndDrop } from '../hooks/useDragAndDrop';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onEmailSelect: (emailId: string) => void;
  onStarToggle: (emailId: string) => void;
  onArchive: (emailId: string) => void;
  onDelete: (emailId: string) => void;
  onBulkAction?: (action: string, emailIds: string[]) => void;
  hasMore?: boolean;
  onLoadMore?: () => Promise<void>;
  isLoading?: boolean;
  selectedEmails?: string[];
  onEmailSelectionToggle?: (emailId: string) => void;
  onSelectAll?: () => void;
  sortBy?: 'date' | 'sender' | 'subject';
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: 'date' | 'sender' | 'subject') => void;
}

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmailId,
  onEmailSelect,
  onStarToggle,
  onArchive,
  onDelete,
  onBulkAction,
  hasMore = false,
  onLoadMore,
  isLoading = false,
  selectedEmails = [],
  onEmailSelectionToggle,
  onSelectAll,
  sortBy = 'date',
  sortOrder = 'desc',
  onSort
}) => {
  const { currentTheme } = useTheme();
  const isLiquidGlass = currentTheme.id === 'liquid-glass';
  
  const { lastElementRef } = useInfiniteScroll(
    onLoadMore || (() => Promise.resolve()),
    hasMore,
    { enabled: !!onLoadMore }
  );

  const formatTime = (date: Date) => {
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

  const handleBulkAction = (action: string) => {
    if (selectedEmails.length > 0 && onBulkAction) {
      onBulkAction(action, selectedEmails);
    }
  };

  const allSelected = selectedEmails.length === emails.length && emails.length > 0;
  const someSelected = selectedEmails.length > 0 && selectedEmails.length < emails.length;

  return (
    <motion.div 
      className={cn(
        "flex-1 m-2 rounded-2xl overflow-hidden",
        isLiquidGlass ? "liquid-glass-card" : "glass-card"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Email List Header */}
      <div className="border-b border-cream/10 px-6 py-4 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onSelectAll}
            className="p-1 hover:bg-cream/10 rounded transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {allSelected ? (
              <CheckSquare size={16} className="text-cloud-blue" />
            ) : someSelected ? (
              <div className="w-4 h-4 bg-cloud-blue/50 rounded border-2 border-cloud-blue" />
            ) : (
              <Square size={16} className="text-cream/60" />
            )}
          </motion.button>
          
          <div className="flex gap-2">
            <motion.button
              onClick={() => handleBulkAction('archive')}
              disabled={selectedEmails.length === 0}
              className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Archive size={16} className="text-cream/70" />
            </motion.button>
            <motion.button
              onClick={() => handleBulkAction('delete')}
              disabled={selectedEmails.length === 0}
              className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 size={16} className="text-cream/70" />
            </motion.button>
            <motion.button
              onClick={() => handleBulkAction('label')}
              disabled={selectedEmails.length === 0}
              className="p-2 hover:bg-cream/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Tag size={16} className="text-cream/70" />
            </motion.button>
          </div>
          
          {selectedEmails.length > 0 && (
            <span className="text-sm text-cream/60 font-light">
              {selectedEmails.length} selected
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-cream/50 font-light">Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as ['date' | 'sender' | 'subject', 'asc' | 'desc'];
                onSort?.(field);
              }}
              className="text-xs bg-transparent border border-cream/20 rounded px-2 py-1 text-cream/80 focus:outline-none focus:border-cream/40"
            >
              <option value="date-desc">Date (newest)</option>
              <option value="date-asc">Date (oldest)</option>
              <option value="sender-asc">Sender (A-Z)</option>
              <option value="sender-desc">Sender (Z-A)</option>
              <option value="subject-asc">Subject (A-Z)</option>
              <option value="subject-desc">Subject (Z-A)</option>
            </select>
          </div>
          
          <span className="text-sm text-cream/60 font-light">
            {emails.length} emails
          </span>
        </div>
      </div>

      {/* Email List */}
      <div className="overflow-y-auto h-full">
        {emails.length === 0 ? (
          <motion.div 
            className="flex items-center justify-center h-64 text-cream/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <p className="text-lg font-light">No emails found</p>
              <p className="text-sm mt-2 font-light">Your selected folder is empty</p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {emails.map((email, index) => {
              const isSelected = selectedEmails.includes(email.id);
              const isEmailSelected = selectedEmailId === email.id;
              const isLastEmail = index === emails.length - 1;
              
              return (
                <EmailListItem
                  key={email.id}
                  email={email}
                  isSelected={isSelected}
                  isEmailSelected={isEmailSelected}
                  isLiquidGlass={isLiquidGlass}
                  onEmailSelect={onEmailSelect}
                  onStarToggle={onStarToggle}
                  onEmailSelectionToggle={onEmailSelectionToggle}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  index={index}
                  ref={isLastEmail && hasMore ? lastElementRef : undefined}
                />
              );
            })}
            
            {isLoading && (
              <motion.div
                className="flex items-center justify-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-cream/60 font-light">Loading more emails...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

// Separate EmailListItem component for better performance
interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  isEmailSelected: boolean;
  isLiquidGlass: boolean;
  onEmailSelect: (emailId: string) => void;
  onStarToggle: (emailId: string) => void;
  onEmailSelectionToggle?: (emailId: string) => void;
  onArchive: (emailId: string) => void;
  onDelete: (emailId: string) => void;
  index: number;
}

const EmailListItem = React.forwardRef<HTMLDivElement, EmailListItemProps>(({
  email,
  isSelected,
  isEmailSelected,
  isLiquidGlass,
  onEmailSelect,
  onStarToggle,
  onEmailSelectionToggle,
  onArchive,
  onDelete,
  index
}, ref) => {
  const { dragHandlers } = useDragAndDrop(
    { type: 'email', id: email.id },
    {
      onDragStart: (event: any) => console.log('Dragging email:', email.id)
    }
  );

  const formatTime = (date: Date) => {
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
    <div {...dragHandlers}>
      <motion.div
        ref={ref}
        className={cn(
          "border-b border-cream/5 px-6 py-4 cursor-pointer transition-all duration-300 group",
          isLiquidGlass ? "liquid-glass-email-item" : "email-item",
          isEmailSelected && "selected",
          !email.isRead && "unread",
          isSelected && "bg-cloud-blue/10 border-cloud-blue/20"
        )}
        onClick={() => onEmailSelect(email.id)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
        layout
      >
      <div className="flex items-start gap-4">
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onEmailSelectionToggle?.(email.id);
          }}
          className="mt-1 p-1 hover:bg-cream/10 rounded transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSelected ? (
            <CheckSquare size={16} className="text-cloud-blue" />
          ) : (
            <Square size={16} className="text-cream/40 group-hover:text-cream/60" />
          )}
        </motion.button>
        
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onStarToggle(email.id);
          }}
          className="mt-1 hover:bg-cream/10 rounded p-1 transition-colors"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
        >
          <Star
            size={16}
            className={email.isStarred ? 'text-yellow-400 fill-yellow-400' : 'text-cream/40 group-hover:text-cream/60'}
          />
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              {email.from.avatar && (
                <motion.img
                  src={email.from.avatar}
                  alt={email.from.name}
                  className="w-8 h-8 rounded-full object-cover border border-cream/20"
                  whileHover={{ scale: 1.1 }}
                />
              )}
              <span className={cn(
                "text-sm font-light text-cream/90",
                !email.isRead && "font-medium text-cream"
              )}>
                {email.from.name}
              </span>
              {email.isImportant && (
                <motion.span 
                  className="w-2 h-2 bg-gradient-to-r from-cloud-blue to-cloud-lavender rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cream/50 flex-shrink-0 font-light">
                {formatTime(email.timestamp)}
              </span>
              
              {/* Quick actions on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(email.id);
                  }}
                  className="p-1 hover:bg-cream/20 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Archive size={12} className="text-cream/60" />
                </motion.button>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(email.id);
                  }}
                  className="p-1 hover:bg-cream/20 rounded transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 size={12} className="text-cream/60" />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <h3 className={cn(
              "text-sm truncate font-light text-cream/85",
              !email.isRead && "font-medium text-cream"
            )}>
              {email.subject}
            </h3>
            {email.attachments && email.attachments.length > 0 && (
              <Paperclip size={12} className="text-cream/40 flex-shrink-0" />
            )}
          </div>

          <p className="text-sm text-cream/60 truncate font-light">
            {email.body.replace(/\n/g, ' ')}
          </p>

          {email.labels.length > 0 && (
            <motion.div 
              className="flex gap-2 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
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
        </div>
      </div>
    </motion.div>
    </div>
  );
});