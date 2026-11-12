import type { Locale } from '@slipstream-ui/i18n';

export type RichBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'code'; text: string };

export type MarketingSection = { heading: string; blocks: RichBlock[] };

export type LegalPageCopy = {
  title: string;
  description: string;
  updated: string;
  sections: MarketingSection[];
};

export type AboutCopy = LegalPageCopy;
export type AccessibilityCopy = LegalPageCopy;
export type PrivacyCopy = LegalPageCopy;
export type TermsCopy = LegalPageCopy;

export type ContactCopy = {
  title: string;
  description: string;
  emailHeading: string;
  issuesHeading: string;
  issuesBody: string;
  addressHeading: string;
  formHeading: string;
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  send: string;
  privacyNote: string;
  honeypotLabel: string;
};

export type HomeCopy = {
  whatsNew: string;
  aiFirstBadge: string;
  reactBadge: string;
  heroTitleLead: string;
  heroTitleHighlight: string;
  heroDescription: string;
  getStarted: string;
  starOnGithub: string;
  copy: string;
  copied: string;
  liveDemoNote: string;
  welcomeTitle: string;
  welcomeSuggestions: string[];
  promptPlaceholder: string;
  send: string;
  agentStripLabel: string;
  stats: string[];
  featuresHeading: string;
  featuresIntro: string;
  features: { title: string; body: string }[];
  howHeading: string;
  howIntro: string;
  steps: { title: string; body: string }[];
  validatorHeading: string;
  validatorIntroBefore: string;
  validatorIntroAfter: string;
  validatorCards: { title: string; note: string }[];
  themesHeading: string;
  themesIntro: string;
  comparisonHeading: string;
  comparisonIntro: string;
  comparisonCapability: string;
  comparisonCapabilities: string[];
  comparisonFootnote: string;
  comparisonCards: { title: string; body: string }[];
  templatesHeading: string;
  templatesIntro: string;
  browseTemplates: string;
  templates: { name: string; body: string }[];
  agentPathTitle: string;
  agentPathBody: string;
  productPathTitle: string;
  productPathBody: string;
  ctaHeading: string;
  ctaBody: string;
  startBuilding: string;
};

export type MarketingCopy = {
  home: HomeCopy;
  about: AboutCopy;
  contact: ContactCopy;
  accessibility: AccessibilityCopy;
  privacy: PrivacyCopy;
  terms: TermsCopy;
};

export type MarketingCopyByLocale = Record<Locale, MarketingCopy>;
