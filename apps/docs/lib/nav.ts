export interface NavItem {
  href: string;
  label: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavSection {
  title: string;
  /** Flat items rendered directly under the section (optional when groups cover it). */
  items?: NavItem[];
  /** Nested groups rendered as collapsible sub-sections (sidebar accordion). */
  groups?: NavGroup[];
}

/** First href in a section across items and groups — used by the mobile pills. */
export function sectionFirstHref(section: NavSection): string {
  return section.items?.[0]?.href ?? section.groups?.[0]?.items[0]?.href ?? '/docs';
}

/** Single source of truth for the docs sidebar, command palette, and pagination. */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { href: '/docs', label: 'Introduction' },
      { href: '/docs/installation', label: 'Installation' },
      { href: '/docs/theming', label: 'Theming' },
    ],
  },
  {
    title: 'AI-First',
    items: [
      { href: '/docs/ai-manifests', label: 'COMPONENT_MANIFEST' },
      { href: '/docs/cli', label: 'CLI' },
      { href: '/docs/patterns', label: 'Patterns' },
      { href: '/docs/templates', label: 'Templates' },
      { href: '/docs/mcp', label: 'MCP Server' },
    ],
  },
  {
    title: 'Guides',
    items: [
      { href: '/docs/guides/ai-chat-ui', label: 'AI chat UI' },
      { href: '/docs/guides/agent-integration', label: 'Agent integration' },
      { href: '/docs/guides/migrating-from-shadcn', label: 'Migrating from shadcn' },
    ],
  },
  {
    title: 'Components',
    items: [{ href: '/docs/components', label: 'Overview' }],
    groups: [
      {
        title: 'Actions',
        items: [
          { href: '/docs/components/button', label: 'Button' },
          { href: '/docs/components/command-palette', label: 'CommandPalette' },
        ],
      },
      {
        title: 'Forms',
        items: [
          { href: '/docs/components/input', label: 'Input' },
          { href: '/docs/components/textarea', label: 'Textarea' },
          { href: '/docs/components/label', label: 'Label' },
          { href: '/docs/components/form-field', label: 'FormField' },
          { href: '/docs/components/fieldset', label: 'Fieldset' },
          { href: '/docs/components/checkbox', label: 'Checkbox' },
          { href: '/docs/components/radio', label: 'Radio' },
          { href: '/docs/components/switch', label: 'Switch' },
          { href: '/docs/components/select', label: 'Select' },
          { href: '/docs/components/search', label: 'Search' },
          { href: '/docs/components/autocomplete', label: 'Autocomplete' },
        ],
      },
      {
        title: 'Feedback',
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
        items: [
          { href: '/docs/components/badge', label: 'Badge' },
          { href: '/docs/components/avatar', label: 'Avatar' },
          { href: '/docs/components/card', label: 'Card' },
          { href: '/docs/components/table', label: 'Table' },
          { href: '/docs/components/data-table', label: 'DataTable' },
          { href: '/docs/components/separator', label: 'Separator' },
        ],
      },
      {
        title: 'Overlays',
        items: [
          { href: '/docs/components/dialog', label: 'Dialog' },
          { href: '/docs/components/menu', label: 'Menu' },
          { href: '/docs/components/popover', label: 'Popover' },
        ],
      },
      {
        title: 'Navigation & disclosure',
        items: [
          { href: '/docs/components/breadcrumb', label: 'Breadcrumb' },
          { href: '/docs/components/pagination', label: 'Pagination' },
          { href: '/docs/components/tabs', label: 'Tabs' },
          { href: '/docs/components/accordion', label: 'Accordion' },
        ],
      },
      {
        title: 'AI chat',
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
