import { Email, EmailDraft } from '../types/email';

export class OfflineService {
  private static instance: OfflineService;
  private isOnline: boolean = navigator.onLine;
  private pendingActions: Array<{
    id: string;
    type: 'send' | 'delete' | 'archive' | 'mark_read' | 'star';
    data: any;
    timestamp: Date;
  }> = [];

  static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
      OfflineService.instance.init();
    }
    return OfflineService.instance;
  }

  private init(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processPendingActions();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Load pending actions from localStorage
    this.loadPendingActions();
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  // Cache management
  async cacheEmails(emails: Email[]): Promise<void> {
    try {
      localStorage.setItem('cached_emails', JSON.stringify(emails));
    } catch (error) {
      console.error('Failed to cache emails:', error);
    }
  }

  async getCachedEmails(): Promise<Email[]> {
    try {
      const cached = localStorage.getItem('cached_emails');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to load cached emails:', error);
      return [];
    }
  }

  async cacheDrafts(drafts: EmailDraft[]): Promise<void> {
    try {
      localStorage.setItem('cached_drafts', JSON.stringify(drafts));
    } catch (error) {
      console.error('Failed to cache drafts:', error);
    }
  }

  async getCachedDrafts(): Promise<EmailDraft[]> {
    try {
      const cached = localStorage.getItem('cached_drafts');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to load cached drafts:', error);
      return [];
    }
  }

  // Offline action queuing
  async queueAction(type: string, data: any): Promise<void> {
    const action = {
      id: this.generateId(),
      type: type as any,
      data,
      timestamp: new Date()
    };

    this.pendingActions.push(action);
    this.savePendingActions();
  }

  private async processPendingActions(): Promise<void> {
    if (this.pendingActions.length === 0) return;

    console.log(`Processing ${this.pendingActions.length} pending actions...`);

    const actionsToProcess = [...this.pendingActions];
    this.pendingActions = [];

    for (const action of actionsToProcess) {
      try {
        await this.executeAction(action);
        console.log(`Successfully processed action: ${action.type}`);
      } catch (error) {
        console.error(`Failed to process action ${action.type}:`, error);
        // Re-queue failed actions
        this.pendingActions.push(action);
      }
    }

    this.savePendingActions();
  }

  private async executeAction(action: any): Promise<void> {
    // This would integrate with the actual email service
    // For now, we'll just simulate the actions
    switch (action.type) {
      case 'send':
        // Send queued email
        console.log('Sending queued email:', action.data);
        break;
      case 'delete':
        // Delete email
        console.log('Deleting email:', action.data);
        break;
      case 'archive':
        // Archive email
        console.log('Archiving email:', action.data);
        break;
      case 'mark_read':
        // Mark as read
        console.log('Marking as read:', action.data);
        break;
      case 'star':
        // Toggle star
        console.log('Toggling star:', action.data);
        break;
    }
  }

  private loadPendingActions(): void {
    try {
      const saved = localStorage.getItem('pending_actions');
      if (saved) {
        this.pendingActions = JSON.parse(saved).map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  }

  private savePendingActions(): void {
    try {
      localStorage.setItem('pending_actions', JSON.stringify(this.pendingActions));
    } catch (error) {
      console.error('Failed to save pending actions:', error);
    }
  }

  getPendingActionsCount(): number {
    return this.pendingActions.length;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const offlineService = OfflineService.getInstance();