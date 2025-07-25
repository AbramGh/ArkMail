import { Email, EmailFolder, Contact } from '../types/email';

export const mockEmails: Email[] = [
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
    threadId: 'thread-1'
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
    folder: 'inbox'
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
    folder: 'inbox'
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
    folder: 'sent'
  }
];

export const mockFolders: EmailFolder[] = [
  { id: 'inbox', name: 'Inbox', icon: 'Inbox', count: 4 },
  { id: 'starred', name: 'Starred', icon: 'Star', count: 1 },
  { id: 'sent', name: 'Sent', icon: 'Send', count: 12 },
  { id: 'drafts', name: 'Drafts', icon: 'FileText', count: 3 },
  { id: 'trash', name: 'Trash', icon: 'Trash2', count: 8 },
  { id: 'spam', name: 'Spam', icon: 'Shield', count: 2 },
  { id: 'work', name: 'Work', icon: 'Briefcase', count: 15, color: '#1a73e8' },
  { id: 'personal', name: 'Personal', icon: 'User', count: 7, color: '#34a853' }
];

export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc.'
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@tech.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    phone: '+1 (555) 987-6543',
    company: 'Innovation Labs'
  },
  {
    id: '3',
    name: 'Michael Davis',
    email: 'michael.davis@client.com',
    phone: '+1 (555) 456-7890',
    company: 'Creative Agency'
  }
];