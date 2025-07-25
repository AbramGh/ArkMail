import { Email, EmailAccount, EmailDraft, EmailSearch } from '../types/email';

export class EmailService {
  private static instance: EmailService;
  private accounts: EmailAccount[] = [];
  private emails: Email[] = [];
  private drafts: EmailDraft[] = [];

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
      // Initialize with mock data
      EmailService.instance.initializeWithMockData();
    }
    return EmailService.instance;
  }

  private initializeWithMockData() {
    // Add a default account
    this.accounts = [{
      id: 'default-account',
      name: 'Your Email',
      email: 'you@email.com',
      provider: 'gmail',
      isDefault: true,
      settings: {},
      syncStatus: 'connected',
      unreadCount: 4,
      lastSync: new Date()
    }];

    // Add mock emails
    this.emails = [
      {
        id: '1',
        from: { name: 'Sarah Johnson', email: 'sarah.johnson@company.com', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
        to: [{ name: 'You', email: 'you@email.com' }],
        subject: 'Q4 Marketing Campaign Review',
        body: 'Hi there,\n\nI wanted to follow up on the Q4 marketing campaign we discussed last week. The initial metrics look very promising, and I think we should schedule a review meeting to go over the detailed analytics.\n\nCould you let me know your availability for next week?\n\nBest regards,\nSarah',
        timestamp: new Date('2025-01-15T10:30:00'),
        isRead: false,
        isStarred: true,
        isImportant: true,
        labels: ['work', 'urgent'],
        folder: 'inbox',
        threadId: 'thread-1',
        priority: 'normal',
        messageId: this.generateMessageId()
      },
      {
        id: '2',
        from: { name: 'GitHub', email: 'noreply@github.com', avatar: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=400' },
        to: [{ name: 'You', email: 'you@email.com' }],
        subject: 'Security alert: New sign-in to your account',
        body: 'We noticed a new sign-in to your GitHub account from a new device or location.\n\nIf this was you, you can safely ignore this email. If not, please secure your account immediately.\n\nLocation: San Francisco, CA\nDevice: Chrome on macOS\nTime: January 15, 2025 at 9:15 AM PST',
        timestamp: new Date('2025-01-15T09:15:00'),
        isRead: false,
        isStarred: false,
        isImportant: false,
        labels: ['security'],
        folder: 'inbox',
        priority: 'normal',
        messageId: this.generateMessageId()
      },
      {
        id: '3',
        from: { name: 'Netflix', email: 'info@netflix.com', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
        to: [{ name: 'You', email: 'you@email.com' }],
        subject: 'New shows and movies this week',
        body: 'Check out what\'s new on Netflix this week! We\'ve got exciting new releases including:\n\n• The Crown Season 6\n• Stranger Things: Behind the Scenes\n• New documentary series\n\nStart watching now and discover your next favorite show!',
        timestamp: new Date('2025-01-15T08:00:00'),
        isRead: true,
        isStarred: false,
        isImportant: false,
        labels: ['entertainment'],
        folder: 'inbox',
        priority: 'normal',
        messageId: this.generateMessageId()
      },
      {
        id: '4',
        from: { name: 'John Smith', email: 'john.smith@tech.com', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' },
        to: [{ name: 'You', email: 'you@email.com' }],
        subject: 'Project proposal feedback',
        body: 'Thanks for sending over the project proposal. I\'ve reviewed it thoroughly and have some feedback:\n\n1. The timeline looks realistic\n2. Budget allocation needs minor adjustments\n3. Team structure is well-thought-out\n\nLet\'s schedule a call to discuss the details. I\'m available tomorrow afternoon.',
        timestamp: new Date('2025-01-14T16:45:00'),
        isRead: true,
        isStarred: false,
        isImportant: false,
        labels: ['work'],
        folder: 'inbox',
        priority: 'normal',
        messageId: this.generateMessageId(),
        attachments: [
          {
            id: 'att-1',
            name: 'proposal_feedback.pdf',
            size: 245000,
            type: 'application/pdf',
            url: '#'
          }
        ]
      },
      {
        id: '5',
        from: { name: 'You', email: 'you@email.com' },
        to: [{ name: 'Michael Davis', email: 'michael.davis@client.com' }],
        subject: 'Project update and next steps',
        body: 'Hi Michael,\n\nI wanted to provide you with an update on the project progress. We\'ve completed the initial phase and are ready to move to the next stage.\n\nKey accomplishments:\n• UI/UX design completed\n• Backend architecture finalized\n• Initial testing framework set up\n\nNext steps will be discussed in our meeting next week.\n\nBest regards',
        timestamp: new Date('2025-01-14T14:20:00'),
        isRead: true,
        isStarred: false,
        isImportant: false,
        labels: ['work', 'sent'],
        folder: 'sent',
        priority: 'normal',
        messageId: this.generateMessageId()
      }
    ];
  }

  // Account Management
  async addAccount(accountData: Omit<EmailAccount, 'id' | 'syncStatus' | 'unreadCount'>): Promise<EmailAccount> {
    const account: EmailAccount = {
      ...accountData,
      id: this.generateId(),
      syncStatus: 'connected',
      unreadCount: 0,
      lastSync: new Date()
    };

    this.accounts.push(account);
    await this.syncAccount(account.id);
    return account;
  }

  async removeAccount(accountId: string): Promise<void> {
    this.accounts = this.accounts.filter(acc => acc.id !== accountId);
    this.emails = this.emails.filter(email => !email.id.startsWith(accountId));
  }

  getAccounts(): EmailAccount[] {
    return this.accounts;
  }

  async syncAccount(accountId: string): Promise<void> {
    const account = this.accounts.find(acc => acc.id === accountId);
    if (!account) throw new Error('Account not found');

    account.syncStatus = 'syncing';
    
    try {
      // Simulate API call to email provider
      await this.fetchEmailsFromProvider(account);
      account.syncStatus = 'connected';
      account.lastSync = new Date();
    } catch (error) {
      account.syncStatus = 'error';
      throw error;
    }
  }

  private async fetchEmailsFromProvider(account: EmailAccount): Promise<void> {
    // This would integrate with actual email providers
    // For now, we'll simulate with mock data
    const mockEmails = await this.generateMockEmails(account.id);
    this.emails.push(...mockEmails);
    
    account.unreadCount = mockEmails.filter(email => !email.isRead).length;
  }

  // Email Operations
  async getEmails(accountId?: string, folder?: string): Promise<Email[]> {
    let filteredEmails = this.emails;

    if (accountId) {
      filteredEmails = filteredEmails.filter(email => email.id.startsWith(accountId));
    }

    if (folder) {
      filteredEmails = filteredEmails.filter(email => email.folder === folder);
    }

    return filteredEmails.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getEmail(emailId: string): Promise<Email | null> {
    return this.emails.find(email => email.id === emailId) || null;
  }

  async sendEmail(draft: EmailDraft): Promise<Email> {
    const account = this.accounts.find(acc => acc.id === draft.accountId);
    if (!account) throw new Error('Account not found');

    // Simulate sending email
    const sentEmail: Email = {
      id: this.generateId(),
      from: { name: account.name, email: account.email },
      to: draft.to.map(email => ({ name: email, email })),
      cc: draft.cc?.map(email => ({ name: email, email })),
      bcc: draft.bcc?.map(email => ({ name: email, email })),
      subject: draft.subject,
      body: draft.body,
      htmlBody: draft.htmlBody,
      timestamp: new Date(),
      isRead: true,
      isStarred: false,
      isImportant: false,
      priority: 'normal',
      labels: [],
      folder: 'sent',
      messageId: this.generateMessageId(),
      deliveryStatus: 'sent',
      attachments: draft.attachments.map(att => ({
        id: att.id,
        name: att.name,
        size: att.size,
        type: att.type,
        url: URL.createObjectURL(att.data as File)
      }))
    };

    this.emails.push(sentEmail);
    this.removeDraft(draft.id);
    
    return sentEmail;
  }

  async replyToEmail(originalEmail: Email, replyData: Partial<EmailDraft>): Promise<Email> {
    const account = this.accounts.find(acc => acc.email === originalEmail.to[0]?.email);
    if (!account) throw new Error('Account not found');

    const replyEmail: Email = {
      id: this.generateId(),
      from: { name: account.name, email: account.email },
      to: [originalEmail.from],
      subject: originalEmail.subject.startsWith('Re:') ? originalEmail.subject : `Re: ${originalEmail.subject}`,
      body: replyData.body || '',
      htmlBody: replyData.htmlBody,
      timestamp: new Date(),
      isRead: true,
      isStarred: false,
      isImportant: false,
      priority: 'normal',
      labels: [],
      folder: 'sent',
      messageId: this.generateMessageId(),
      inReplyTo: originalEmail.messageId,
      references: [...(originalEmail.references || []), originalEmail.messageId],
      threadId: originalEmail.threadId,
      deliveryStatus: 'sent'
    };

    this.emails.push(replyEmail);
    return replyEmail;
  }

  async forwardEmail(originalEmail: Email, forwardData: Partial<EmailDraft>): Promise<Email> {
    const account = this.accounts.find(acc => acc.email === originalEmail.to[0]?.email);
    if (!account) throw new Error('Account not found');

    const forwardEmail: Email = {
      id: this.generateId(),
      from: { name: account.name, email: account.email },
      to: forwardData.to?.map(email => ({ name: email, email })) || [],
      subject: originalEmail.subject.startsWith('Fwd:') ? originalEmail.subject : `Fwd: ${originalEmail.subject}`,
      body: `\n\n---------- Forwarded message ---------\nFrom: ${originalEmail.from.name} <${originalEmail.from.email}>\nDate: ${originalEmail.timestamp.toLocaleString()}\nSubject: ${originalEmail.subject}\nTo: ${originalEmail.to.map(t => t.email).join(', ')}\n\n${originalEmail.body}`,
      timestamp: new Date(),
      isRead: true,
      isStarred: false,
      isImportant: false,
      priority: 'normal',
      labels: [],
      folder: 'sent',
      messageId: this.generateMessageId(),
      attachments: originalEmail.attachments,
      deliveryStatus: 'sent'
    };

    this.emails.push(forwardEmail);
    return forwardEmail;
  }

  async deleteEmail(emailId: string): Promise<void> {
    const email = this.emails.find(e => e.id === emailId);
    if (email) {
      email.isDeleted = true;
      email.folder = 'trash';
    }
  }

  async archiveEmail(emailId: string): Promise<void> {
    const email = this.emails.find(e => e.id === emailId);
    if (email) {
      email.isArchived = true;
    }
  }

  async markAsRead(emailId: string, isRead: boolean = true): Promise<void> {
    const email = this.emails.find(e => e.id === emailId);
    if (email) {
      email.isRead = isRead;
      
      // Update account unread count
      const accountId = emailId.split('-')[0];
      const account = this.accounts.find(acc => acc.id === accountId);
      if (account) {
        const unreadEmails = this.emails.filter(e => 
          e.id.startsWith(accountId) && !e.isRead && !e.isDeleted
        );
        account.unreadCount = unreadEmails.length;
      }
    }
  }

  async toggleStar(emailId: string): Promise<void> {
    const email = this.emails.find(e => e.id === emailId);
    if (email) {
      email.isStarred = !email.isStarred;
    }
  }

  // Search functionality
  async searchEmails(searchParams: EmailSearch): Promise<Email[]> {
    let results = this.emails;

    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
      results = results.filter(email => 
        email.subject.toLowerCase().includes(query) ||
        email.body.toLowerCase().includes(query) ||
        email.from.name.toLowerCase().includes(query) ||
        email.from.email.toLowerCase().includes(query)
      );
    }

    if (searchParams.from) {
      results = results.filter(email => 
        email.from.email.toLowerCase().includes(searchParams.from!.toLowerCase())
      );
    }

    if (searchParams.to) {
      results = results.filter(email => 
        email.to.some(recipient => 
          recipient.email.toLowerCase().includes(searchParams.to!.toLowerCase())
        )
      );
    }

    if (searchParams.hasAttachment) {
      results = results.filter(email => 
        email.attachments && email.attachments.length > 0
      );
    }

    if (searchParams.dateRange) {
      results = results.filter(email => 
        email.timestamp >= searchParams.dateRange!.start &&
        email.timestamp <= searchParams.dateRange!.end
      );
    }

    if (searchParams.isUnread !== undefined) {
      results = results.filter(email => email.isRead !== searchParams.isUnread);
    }

    if (searchParams.isStarred !== undefined) {
      results = results.filter(email => email.isStarred === searchParams.isStarred);
    }

    return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Draft Management
  async saveDraft(draft: Partial<EmailDraft>): Promise<EmailDraft> {
    const existingDraft = this.drafts.find(d => d.id === draft.id);
    
    if (existingDraft) {
      Object.assign(existingDraft, { ...draft, lastSaved: new Date() });
      return existingDraft;
    } else {
      const newDraft: EmailDraft = {
        id: draft.id || this.generateId(),
        accountId: draft.accountId || this.accounts[0]?.id || '',
        to: draft.to || [],
        cc: draft.cc,
        bcc: draft.bcc,
        subject: draft.subject || '',
        body: draft.body || '',
        htmlBody: draft.htmlBody,
        attachments: draft.attachments || [],
        lastSaved: new Date(),
        isScheduled: draft.isScheduled,
        scheduledTime: draft.scheduledTime
      };
      
      this.drafts.push(newDraft);
      return newDraft;
    }
  }

  async getDrafts(): Promise<EmailDraft[]> {
    return this.drafts.sort((a, b) => b.lastSaved.getTime() - a.lastSaved.getTime());
  }

  async removeDraft(draftId: string): Promise<void> {
    this.drafts = this.drafts.filter(d => d.id !== draftId);
  }

  // Utility methods
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `${this.generateId()}@emailclient.local`;
  }

  private async generateMockEmails(accountId: string): Promise<Email[]> {
    // Generate some mock emails for demonstration
    const mockSenders = [
      { name: 'Sarah Johnson', email: 'sarah@company.com' },
      { name: 'GitHub', email: 'noreply@github.com' },
      { name: 'Netflix', email: 'info@netflix.com' },
      { name: 'John Smith', email: 'john@tech.com' }
    ];

    return mockSenders.map((sender, index) => ({
      id: `${accountId}-${this.generateId()}`,
      from: sender,
      to: [{ name: 'You', email: 'you@email.com' }],
      subject: `Sample Email ${index + 1}`,
      body: `This is a sample email body for testing purposes.`,
      timestamp: new Date(Date.now() - index * 3600000),
      isRead: index > 1,
      isStarred: index === 0,
      isImportant: index === 0,
      priority: 'normal' as const,
      labels: [],
      folder: 'inbox' as const,
      messageId: this.generateMessageId()
    }));
  }
}

export const emailService = EmailService.getInstance();