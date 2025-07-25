import { EmailNotification } from '../types/email';

export class NotificationService {
  private static instance: NotificationService;
  private notifications: EmailNotification[] = [];
  private subscribers: Array<(notifications: EmailNotification[]) => void> = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async showNotification(notification: Omit<EmailNotification, 'id' | 'timestamp' | 'isRead'>): Promise<void> {
    const newNotification: EmailNotification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      isRead: false
    };

    this.notifications.unshift(newNotification);
    this.notifySubscribers();

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.emailId,
        requireInteraction: notification.type === 'important'
      });

      browserNotification.onclick = () => {
        window.focus();
        // Navigate to email or perform action
        browserNotification.close();
      };

      // Auto-close after 5 seconds for non-important notifications
      if (notification.type !== 'important') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }
  }

  getNotifications(): EmailNotification[] {
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.notifySubscribers();
    }
  }

  async markAllAsRead(): Promise<void> {
    this.notifications.forEach(n => n.isRead = true);
    this.notifySubscribers();
  }

  async removeNotification(notificationId: string): Promise<void> {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifySubscribers();
  }

  subscribe(callback: (notifications: EmailNotification[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const notificationService = NotificationService.getInstance();