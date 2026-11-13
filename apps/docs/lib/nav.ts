import type { MessageKey } from '@slipstream-ui/i18n';

export type NavItem = {
  href: string;
  label: string;
  /** Catalog key for the translated label; absent for proper nouns like component names. */
  labelKey?: MessageKey;
};

export type NavGroup = {
  title: string;
  titleKey?: MessageKey;
  items: NavItem[];
};

export type NavSection = {
  title: string;
  titleKey?: MessageKey;
  /** Flat items rendered directly under the section (optional when groups cover it). */
  items?: NavItem[];
  /** Nested groups rendered as collapsible sub-sections (sidebar accordion). */
  groups?: NavGroup[];
};

/** First href in a section across items and groups — used by the mobile pills. */
export function sectionFirstHref(section: NavSection): string {
  return section.items?.[0]?.href ?? section.groups?.[0]?.items[0]?.href ?? '/docs';
}

/** Translated label for a nav entry, falling back to the English label. */
export function navItemLabel(item: NavItem, t: (key: MessageKey) => string): string {
  return item.labelKey ? t(item.labelKey) : item.label;
}

/** Translated title for a sidebar section. */
export function navSectionLabel(section: NavSection, t: (key: MessageKey) => string): string {
  return section.titleKey ? t(section.titleKey) : section.title;
}

/** Translated title for a sidebar group. */
export function navGroupLabel(group: NavGroup, t: (key: MessageKey) => string): string {
  return group.titleKey ? t(group.titleKey) : group.title;
}

/** Single source of truth for the docs sidebar, command palette, and pagination. */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Getting Started',
    titleKey: 'nav.sections.gettingStarted',
    items: [
      { href: '/docs', label: 'Introduction', labelKey: 'nav.items.introduction' },
      { href: '/docs/getting-started', label: 'Quickstart', labelKey: 'nav.items.quickstart' },
      { href: '/docs/installation', label: 'Installation', labelKey: 'nav.items.installation' },
      { href: '/docs/tailwind-v4', label: 'Tailwind v4', labelKey: 'nav.items.tailwindV4' },
      { href: '/docs/compatibility', label: 'Compatibility', labelKey: 'nav.items.compatibility' },
      { href: '/docs/theming', label: 'Theming', labelKey: 'nav.items.theming' },
      { href: '/docs/roadmap', label: 'Roadmap', labelKey: 'nav.items.roadmap' },
    ],
  },
  {
    title: 'AI-First',
    titleKey: 'nav.sections.aiFirst',
    items: [
      { href: '/docs/ai-first', label: 'Overview', labelKey: 'nav.items.overview' },
      { href: '/docs/ai-manifests', label: 'COMPONENT_MANIFEST' },
      { href: '/docs/cli', label: 'CLI' },
      { href: '/docs/patterns', label: 'Patterns', labelKey: 'nav.items.patterns' },
      { href: '/docs/templates', label: 'Templates', labelKey: 'nav.items.templates' },
      { href: '/docs/mcp', label: 'MCP Server', labelKey: 'nav.items.mcpServer' },
    ],
  },
  {
    title: 'Guides',
    titleKey: 'nav.sections.guides',
    items: [
      { href: '/docs/guides/ai-chat-ui', label: 'AI chat UI', labelKey: 'nav.items.aiChatUi' },
      { href: '/docs/guides/streaming', label: 'Streaming', labelKey: 'nav.items.streaming' },
      { href: '/docs/guides/state-threads', label: 'State & threads', labelKey: 'nav.items.stateThreads' },
      { href: '/docs/guides/vercel-ai-sdk', label: 'Vercel AI SDK', labelKey: 'nav.items.vercelAiSdk' },
      { href: '/docs/guides/accessibility-ai', label: 'Accessibility', labelKey: 'nav.items.accessibility' },
      { href: '/docs/guides/agent-integration', label: 'Agent integration', labelKey: 'nav.items.agentIntegration' },
      { href: '/docs/guides/ide-setup', label: 'IDE setup (Claude/Cursor)', labelKey: 'nav.items.ideSetup' },
      { href: '/docs/guides/testing', label: 'Testing', labelKey: 'nav.items.testing' },
      { href: '/docs/guides/react-hook-form', label: 'React Hook Form', labelKey: 'nav.items.reactHookForm' },
      { href: '/docs/guides/migrating-from-shadcn', label: 'Migrating from shadcn', labelKey: 'nav.items.migratingFromShadcn' },
    ],
  },
  {
    title: 'Components',
    titleKey: 'nav.sections.components',
    items: [{ href: '/docs/components', label: 'Overview', labelKey: 'nav.items.overview' }],
    groups: [
      {
        title: 'Actions',
        titleKey: 'nav.groups.actions',
        items: [
          { href: '/docs/components/button', label: 'Button' },
          { href: '/docs/components/button-group', label: 'ButtonGroup' },
          { href: '/docs/components/command-palette', label: 'CommandPalette' },
        ],
      },
      {
        title: 'Typography',
        titleKey: 'nav.groups.typography',
        items: [
          { href: '/docs/components/heading', label: 'Heading' },
          { href: '/docs/components/text', label: 'Text' },
          { href: '/docs/components/section-heading', label: 'SectionHeading' },
          { href: '/docs/components/link', label: 'Link' },
          { href: '/docs/components/prose', label: 'Prose' },
        ],
      },
      {
        title: 'Layout',
        titleKey: 'nav.groups.layout',
        items: [
          { href: '/docs/components/flex', label: 'Flex' },
          { href: '/docs/components/grid', label: 'Grid' },
          { href: '/docs/components/block', label: 'Block' },
          { href: '/docs/components/container', label: 'Container' },
          { href: '/docs/components/section', label: 'Section' },
          { href: '/docs/components/page-header', label: 'PageHeader' },
          { href: '/docs/components/auth-layout', label: 'AuthLayout' },
        ],
      },
      {
        title: 'Marketing',
        titleKey: 'nav.groups.marketing',
        items: [
          { href: '/docs/components/hero', label: 'Hero' },
          { href: '/docs/components/stat-band', label: 'StatBand' },
          { href: '/docs/components/logo-cloud', label: 'LogoCloud' },
          { href: '/docs/components/feature-grid', label: 'FeatureGrid' },
          { href: '/docs/components/feature-row', label: 'FeatureRow' },
          { href: '/docs/components/testimonial', label: 'Testimonial' },
          { href: '/docs/components/process-steps', label: 'ProcessSteps' },
          { href: '/docs/components/cta-section', label: 'CTASection' },
          { href: '/docs/components/comparison-table', label: 'ComparisonTable' },
        ],
      },
      {
        title: 'Content',
        titleKey: 'nav.groups.content',
        items: [
          { href: '/docs/components/article-card', label: 'ArticleCard' },
          { href: '/docs/components/newsletter', label: 'Newsletter' },
          { href: '/docs/components/contact-strip', label: 'ContactStrip' },
          { href: '/docs/components/announcement-bar', label: 'AnnouncementBar' },
        ],
      },
      {
        title: 'Marketplace',
        titleKey: 'nav.groups.marketplace',
        items: [
          { href: '/docs/components/deal-card', label: 'DealCard' },
          { href: '/docs/components/entity-card', label: 'EntityCard' },
          { href: '/docs/components/tombstone-card', label: 'TombstoneCard' },
          { href: '/docs/components/document-card', label: 'DocumentCard' },
          { href: '/docs/components/load-more', label: 'LoadMore' },
        ],
      },
      {
        title: 'Forms',
        titleKey: 'nav.groups.forms',
        items: [
          { href: '/docs/components/input', label: 'Input' },
          { href: '/docs/components/input-group', label: 'InputGroup' },
          { href: '/docs/components/password-input', label: 'PasswordInput' },
          { href: '/docs/components/date-picker', label: 'DatePicker' },
          { href: '/docs/components/time-picker', label: 'TimePicker' },
          { href: '/docs/components/stepper', label: 'Stepper' },
          { href: '/docs/components/file-upload', label: 'FileUpload' },
          { href: '/docs/components/textarea', label: 'Textarea' },
          { href: '/docs/components/label', label: 'Label' },
          { href: '/docs/components/form-field', label: 'FormField' },
          { href: '/docs/components/fieldset', label: 'Fieldset' },
          { href: '/docs/components/form', label: 'Form' },
          { href: '/docs/components/form-layout', label: 'FormLayout' },
          { href: '/docs/components/checkbox', label: 'Checkbox' },
          { href: '/docs/components/checkbox-group', label: 'CheckboxGroup' },
          { href: '/docs/components/radio', label: 'Radio' },
          { href: '/docs/components/switch', label: 'Switch' },
          { href: '/docs/components/select', label: 'Select' },
          { href: '/docs/components/select-menu', label: 'SelectMenu' },
          { href: '/docs/components/search', label: 'Search' },
          { href: '/docs/components/autocomplete', label: 'Autocomplete' },
          { href: '/docs/components/segmented-control', label: 'SegmentedControl' },
          { href: '/docs/components/range-slider', label: 'RangeSlider' },
          { href: '/docs/components/multi-select', label: 'MultiSelect' },
          { href: '/docs/components/date-range-picker', label: 'DateRangePicker' },
        ],
      },
      {
        title: 'Feedback',
        titleKey: 'nav.groups.feedback',
        items: [
          { href: '/docs/components/alert', label: 'Alert' },
          { href: '/docs/components/toast', label: 'Toast' },
          { href: '/docs/components/spinner', label: 'Spinner' },
          { href: '/docs/components/progress', label: 'Progress' },
          { href: '/docs/components/skeleton', label: 'Skeleton' },
          { href: '/docs/components/tooltip', label: 'Tooltip' },
        ],
      },
      {
        title: 'Data display',
        titleKey: 'nav.groups.dataDisplay',
        items: [
          { href: '/docs/components/badge', label: 'Badge' },
          { href: '/docs/components/avatar', label: 'Avatar' },
          { href: '/docs/components/card', label: 'Card' },
          { href: '/docs/components/list', label: 'List' },
          { href: '/docs/components/empty-state', label: 'EmptyState' },
          { href: '/docs/components/metric-card', label: 'MetricCard' },
          { href: '/docs/components/filter-bar', label: 'FilterBar' },
          { href: '/docs/components/filter-chips', label: 'FilterChips' },
          { href: '/docs/components/filter-panel', label: 'FilterPanel' },
          { href: '/docs/components/applied-filters', label: 'AppliedFilters' },
          { href: '/docs/components/timeline', label: 'Timeline' },
          { href: '/docs/components/table', label: 'Table' },
          { href: '/docs/components/data-table', label: 'DataTable' },
          { href: '/docs/components/table-card', label: 'TableCard' },
          { href: '/docs/components/separator', label: 'Separator' },
        ],
      },
      {
        title: 'Overlays',
        titleKey: 'nav.groups.overlays',
        items: [
          { href: '/docs/components/dialog', label: 'Dialog' },
          { href: '/docs/components/drawer', label: 'Drawer' },
          { href: '/docs/components/menu', label: 'Menu' },
          { href: '/docs/components/popover', label: 'Popover' },
          { href: '/docs/components/confirm-dialog', label: 'ConfirmDialog' },
        ],
      },
      {
        title: 'Navigation & disclosure',
        titleKey: 'nav.groups.navigationDisclosure',
        items: [
          { href: '/docs/components/app-shell', label: 'AppShell' },
          { href: '/docs/components/bottom-nav', label: 'BottomNav' },
          { href: '/docs/components/site-header', label: 'SiteHeader' },
          { href: '/docs/components/site-footer', label: 'SiteFooter' },
          { href: '/docs/components/table-of-contents', label: 'TableOfContents' },
          { href: '/docs/components/breadcrumb', label: 'Breadcrumb' },
          { href: '/docs/components/pagination', label: 'Pagination' },
          { href: '/docs/components/tabs', label: 'Tabs' },
          { href: '/docs/components/link-tabs', label: 'LinkTabs' },
          { href: '/docs/components/theme-toggle', label: 'ThemeToggle' },
          { href: '/docs/components/accordion', label: 'Accordion' },
        ],
      },
      {
        title: 'AI chat',
        titleKey: 'nav.groups.aiChat',
        items: [
          { href: '/docs/components/conversation', label: 'Conversation' },
          { href: '/docs/components/prompt-input', label: 'PromptInput' },
          { href: '/docs/components/message', label: 'Message' },
          { href: '/docs/components/response', label: 'Response' },
          { href: '/docs/components/code-block', label: 'CodeBlock' },
          { href: '/docs/components/message-actions', label: 'MessageActions' },
          { href: '/docs/components/streaming-indicator', label: 'StreamingIndicator' },
          { href: '/docs/components/branch', label: 'Branch' },
          { href: '/docs/components/attachment', label: 'Attachment' },
        ],
      },
      {
        title: 'AI agent',
        titleKey: 'nav.groups.aiAgent',
        items: [
          { href: '/docs/components/reasoning', label: 'Reasoning' },
          { href: '/docs/components/tool-call', label: 'ToolCall' },
          { href: '/docs/components/confirmation', label: 'Confirmation' },
          { href: '/docs/components/chain-thought', label: 'ChainThought' },
          { href: '/docs/components/sources', label: 'Sources' },
          { href: '/docs/components/inline-citation', label: 'InlineCitation' },
          { href: '/docs/components/suggestions', label: 'Suggestions' },
        ],
      },
    ],
  },
];

/** Flat ordered list used for prev/next pagination across all docs pages. */
export const FLAT_NAV: NavItem[] = NAV_SECTIONS.flatMap((section) => [
  ...(section.items ?? []),
  ...(section.groups ?? []).flatMap((group) => group.items),
]);

export function getNeighbors(href: string): { previous?: NavItem; next?: NavItem } {
  const index = FLAT_NAV.findIndex((item) => item.href === href);
  if (index === -1) return {};
  return {
    previous: index > 0 ? FLAT_NAV[index - 1] : undefined,
    next: index < FLAT_NAV.length - 1 ? FLAT_NAV[index + 1] : undefined,
  };
}
// trigger ci
