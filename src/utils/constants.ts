// UI Constants
export const SIDEBAR_WIDTH = 'w-64';
export const ANIMATION_DURATION = 0.3;
export const DEBOUNCE_DELAY = 300;

// Email Constants
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// Theme Constants
export const GLASS_BLUR_INTENSITY = 20;
export const ANIMATION_SPRING_CONFIG = {
  type: "spring",
  damping: 25,
  stiffness: 300
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  COMPOSE: 'c',
  REPLY: 'r',
  REPLY_ALL: 'a',
  FORWARD: 'f',
  ARCHIVE: 'e',
  DELETE: 'Delete',
  STAR: 's',
  SEARCH: '/',
  REFRESH: 'g',
  ESCAPE: 'Escape'
} as const;