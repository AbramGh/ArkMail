import { useEffect, useCallback } from 'react';

export interface KeyboardShortcuts {
  onCompose?: () => void;
  onReply?: () => void;
  onReplyAll?: () => void;
  onForward?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onToggleStar?: () => void;
  onMarkAsRead?: () => void;
  onMarkAsUnread?: () => void;
  onNextEmail?: () => void;
  onPreviousEmail?: () => void;
  onSearch?: () => void;
  onRefresh?: () => void;
  onSelectAll?: () => void;
  onEscape?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts, enabled: boolean = true) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
    const isModifierPressed = ctrlKey || metaKey;

    // Prevent default for handled shortcuts
    let handled = false;

    switch (key.toLowerCase()) {
      // Compose new email
      case 'c':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onCompose?.();
          handled = true;
        }
        break;

      // Reply
      case 'r':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onReply?.();
          handled = true;
        }
        break;

      // Reply all
      case 'a':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onReplyAll?.();
          handled = true;
        }
        break;

      // Forward
      case 'f':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onForward?.();
          handled = true;
        }
        break;

      // Archive
      case 'e':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onArchive?.();
          handled = true;
        }
        break;

      // Delete
      case 'delete':
      case 'backspace':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onDelete?.();
          handled = true;
        }
        break;

      // Toggle star
      case 's':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onToggleStar?.();
          handled = true;
        }
        break;

      // Mark as read
      case 'i':
        if (shiftKey && !isModifierPressed && !altKey) {
          shortcuts.onMarkAsRead?.();
          handled = true;
        }
        break;

      // Mark as unread
      case 'u':
        if (shiftKey && !isModifierPressed && !altKey) {
          shortcuts.onMarkAsUnread?.();
          handled = true;
        }
        break;

      // Navigation
      case 'j':
      case 'arrowdown':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onNextEmail?.();
          handled = true;
        }
        break;

      case 'k':
      case 'arrowup':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onPreviousEmail?.();
          handled = true;
        }
        break;

      // Search
      case '/':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onSearch?.();
          handled = true;
        }
        break;

      // Refresh
      case 'g':
        if (!isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onRefresh?.();
          handled = true;
        }
        break;

      // Select all
      case 'a':
        if (isModifierPressed && !shiftKey && !altKey) {
          shortcuts.onSelectAll?.();
          handled = true;
        }
        break;

      // Escape
      case 'escape':
        shortcuts.onEscape?.();
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, enabled]);
};

// Hook for displaying keyboard shortcuts help
export const useKeyboardShortcutsHelp = () => {
  const shortcuts = [
    { key: 'C', description: 'Compose new email' },
    { key: 'R', description: 'Reply to email' },
    { key: 'A', description: 'Reply all' },
    { key: 'F', description: 'Forward email' },
    { key: 'E', description: 'Archive email' },
    { key: 'Delete', description: 'Delete email' },
    { key: 'S', description: 'Toggle star' },
    { key: 'Shift + I', description: 'Mark as read' },
    { key: 'Shift + U', description: 'Mark as unread' },
    { key: 'J / ↓', description: 'Next email' },
    { key: 'K / ↑', description: 'Previous email' },
    { key: '/', description: 'Search emails' },
    { key: 'G', description: 'Refresh' },
    { key: 'Ctrl/Cmd + A', description: 'Select all' },
    { key: 'Escape', description: 'Close modal/clear selection' }
  ];

  return shortcuts;
};