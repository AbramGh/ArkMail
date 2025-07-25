export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: Array<{
    name: string;
    email: string;
  }>;
  cc?: Array<{
    name: string;
    email: string;
  }>;
  bcc?: Array<{
    name: string;
    email: string;
  }>;
  subject: string;
  body: string;
  htmlBody?: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  priority: 'low' | 'normal' | 'high';
  labels: string[];
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    preview?: string;
  }>;
  threadId?: string;
  isSpam?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | string;
  messageId: string;
  inReplyTo?: string;
  references?: string[];
  deliveryStatus?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface EmailAccount {
  id: string;
  name: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'yahoo' | 'imap' | 'exchange';
  isDefault: boolean;
  settings: {
    imapServer?: string;
    imapPort?: number;
    smtpServer?: string;
    smtpPort?: number;
    useSSL?: boolean;
    useTLS?: boolean;
  };
  syncStatus: 'connected' | 'syncing' | 'error' | 'offline';
  lastSync?: Date;
  unreadCount: number;
  avatar?: string;
}

export interface EmailDraft {
  id: string;
  accountId: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  htmlBody?: string;
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    data: string | File;
  }>;
  lastSaved: Date;
  isScheduled?: boolean;
  scheduledTime?: Date;
}

export interface EmailSearch {
  query: string;
  from?: string;
  to?: string;
  subject?: string;
  hasAttachment?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  folder?: string;
  labels?: string[];
  isUnread?: boolean;
  isStarred?: boolean;
}

export interface EmailNotification {
  id: string;
  emailId: string;
  type: 'new_email' | 'reply' | 'mention' | 'important';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actions?: Array<{
    label: string;
    action: string;
  }>;
}
export interface EmailFolder {
  id: string;
  name: string;
  icon: string;
  count: number;
  color?: string;
  isCustom?: boolean;
  parentId?: string;
  sortOrder?: number;
}

export interface EmailThread {
  id: string;
  subject: string;
  participants: Array<{
    name: string;
    email: string;
  }>;
  emails: Email[];
  lastActivity: Date;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface EmailFilter {
  search: string;
  folder: string;
  isUnread: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: 'low' | 'normal' | 'high';
  hasReminders?: boolean;
  isEncrypted?: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  htmlBody?: string;
  category: 'personal' | 'business' | 'marketing' | 'support';
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailSignature {
  id: string;
  name: string;
  content: string;
  htmlContent?: string;
  isDefault: boolean;
  accountId?: string;
}

export interface EmailRule {
  id: string;
  name: string;
  isActive: boolean;
  conditions: Array<{
    field: 'from' | 'to' | 'subject' | 'body' | 'attachment';
    operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'regex';
    value: string;
  }>;
  actions: Array<{
    type: 'move' | 'label' | 'star' | 'delete' | 'forward' | 'reply' | 'markRead';
    value?: string;
  }>;
  priority: number;
}

export interface EmailReminder {
  id: string;
  emailId: string;
  reminderTime: Date;
  message: string;
  isCompleted: boolean;
  createdAt: Date;
}

export interface EmailAnalytics {
  totalEmails: number;
  unreadCount: number;
  sentToday: number;
  receivedToday: number;
  averageResponseTime: number;
  topSenders: Array<{
    email: string;
    name: string;
    count: number;
  }>;
  emailsByHour: Array<{
    hour: number;
    count: number;
  }>;
  attachmentStats: {
    totalSize: number;
    totalCount: number;
    typeBreakdown: Record<string, number>;
  };
}