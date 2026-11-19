/**
 * @slipstream-ui/newsletter
 * Newsletter automation package for daily/weekly digests
 */

// Types
export * from './types';

// Content sources
export {
  ContentSourceRegistry,
  createDefaultRegistry,
  AuditLogContentSource,
  ReleaseContentSource,
  GitHubContentSource,
  CustomContentSource,
} from './lib/content-sources';

// Preferences
export {
  getNewsletterPreferences,
  updateNewsletterPreferences,
  subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getNewsletterSubscriptions,
  isSubscribed,
  getAvailableContentTypes,
  getAvailableFrequencies,
} from './lib/preferences';

// Unsubscribe tokens (HMAC-signed, no-login email links)
export {
  newsletterUnsubscribeToken,
  newsletterUnsubscribeUrl,
  verifyNewsletterUnsubscribeToken,
} from './lib/unsubscribe-token';
export type { NewsletterUnsubscribeType } from './lib/unsubscribe-token';

// Generation
export {
  NewsletterGenerator,
  createNewsletterGenerator,
  queueNewsletterDeliveries,
  processQueuedDeliveries,
} from './generators/newsletter';

// Templates
export {
  generateHtmlEmail,
  generateTextEmail,
  generateSubject,
  generatePreheader,
} from './templates/email';