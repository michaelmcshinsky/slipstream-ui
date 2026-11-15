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

export type LabCopy = {
  eyebrow: string;
  title: string;
  description: string;
  footer: string;
  tabs: { data: string; forms: string; overlays: string; flow: string };
  data: {
    caption: string;
    activeRuns: string;
    thisWeek: string;
    selected: string;
    useTheCheckboxes: string;
    successRate: string;
    vsLastWeek: string;
    columns: { workflow: string; status: string; owner: string; seats: string };
    runs: {
      onboardingEmails: string;
      invoiceSync: string;
      churnScoring: string;
      weeklyDigest: string;
      leadEnrichment: string;
      accessReview: string;
    };
    statuses: { success: string; warning: string; info: string };
    archive: string;
    clear: string;
    archivedOne: string;
    archivedOther: string;
  };
  forms: {
    selectMenuCaption: string;
    inputGroupCaption: string;
    buttonGroupCaption: string;
    planLabel: string;
    domainLabel: string;
    viewModeLabel: string;
    views: { list: string; board: string; calendar: string };
    plans: {
      free: { label: string; description: string };
      pro: { label: string; description: string };
      team: { label: string; description: string };
    };
    planGroups: { individual: string; business: string };
    summary: string;
  };
  overlays: {
    deleteProject: string;
    openDrawer: string;
    description: string;
    confirmTitle: string;
    confirmDescription: string;
    confirm: string;
    deleted: string;
    savedTitle: string;
    savedBody: string;
    rateLimitedTitle: string;
    rateLimitedBody: string;
    headsUpTitle: string;
    headsUpBody: string;
    drawerTitle: string;
    drawerDescription: string;
    noteLabel: string;
    notePlaceholder: string;
    apply: string;
    applied: string;
    noNote: string;
  };
  flow: {
    steps: {
      basics: { label: string; description: string };
      access: { label: string; description: string };
      billing: { label: string; description: string };
      review: { label: string; description?: string };
    };
    summary: string;
    descriptionSuffix: string;
    back: string;
    next: string;
    states: { completed: string; current: string; upcoming: string };
  };
};

export type DemoCopy = {
  you: string;
  assistant: string;
  initialMessage: string;
  reply: string;
  anyMcpClient: string;
  transcriptLabel: string;
  responseComplete: string;
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
  /** Cell values for the comparison table, in the same order as `comparisonCapabilities`. */
  comparisonRows: {
    slipstream: string;
    shadcn: string;
    assistantUi: string;
    mui: string;
  }[];
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
  demo: DemoCopy;
  lab: LabCopy;
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
