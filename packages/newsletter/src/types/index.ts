/**
 * Newsletter automation types
 * Shared types for daily/weekly newsletter generation and delivery
 */

export type NewsletterFrequency = 'daily' | 'weekly' | 'both';

export type NewsletterContentType =
  | 'audit_log'
  | 'release'
  | 'github'
  | 'custom';

export type NewsletterStatus = 'active' | 'unsubscribed' | 'bounced';

export type NewsletterDeliveryStatus = 'QUEUED' | 'SENT' | 'FAILED';

export interface NewsletterContentItem {
  id: string;
  type: NewsletterContentType;
  title: string;
  summary: string;
  url?: string;
  metadata?: Record<string, unknown>;
  publishedAt: Date;
  createdAt: Date;
}

export interface NewsletterPreferences {
  dailyEnabled: boolean;
  weeklyEnabled: boolean;
  contentTypes: NewsletterContentType[];
  frequency: NewsletterFrequency;
  timezone: string;
}

export interface NewsletterSubscription {
  id: string;
  userId: string;
  type: 'daily' | 'weekly';
  status: NewsletterStatus;
  unsubscribedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsletterDelivery {
  id: string;
  userId: string;
  subscriptionId: string;
  type: 'daily' | 'weekly';
  subject: string;
  htmlContent: string;
  textContent: string;
  status: NewsletterDeliveryStatus;
  sentAt?: Date;
  error?: string;
  createdAt: Date;
}

export interface UserWithPreferences {
  id: string;
  email: string;
  name?: string | null;
  preferences?: NewsletterPreferences | null;
  subscriptions: NewsletterSubscription[];
}

export interface GeneratedNewsletter {
  subject: string;
  htmlContent: string;
  textContent: string;
  itemCount: number;
  contentTypes: NewsletterContentType[];
}

export interface NewsletterGenerationOptions {
  frequency: 'daily' | 'weekly';
  userId?: string; // If provided, generate for specific user with their preferences
  contentTypes?: NewsletterContentType[];
  since?: Date; // For daily: last 24h, for weekly: last 7 days
  until?: Date;
}

export interface ContentSource {
  fetchContent(options: NewsletterGenerationOptions): Promise<NewsletterContentItem[]>;
  getContentType(): NewsletterContentType;
}

export interface EmailTemplateData {
  preheader: string;
  title: string;
  items: NewsletterContentItem[];
  frequency: 'daily' | 'weekly';
  date: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
  siteUrl: string;
}