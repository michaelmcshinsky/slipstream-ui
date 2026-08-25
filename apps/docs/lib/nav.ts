export interface NavItem {
  href: string;
  label: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
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
    title: 'Components',
    items: [
      { href: '/docs/components', label: 'Overview' },
      { href: '/docs/components/button', label: 'Button' },
      { href: '/docs/components/input', label: 'Input' },
      { href: '/docs/components/badge', label: 'Badge' },
      { href: '/docs/components/avatar', label: 'Avatar' },
      { href: '/docs/components/spinner', label: 'Spinner' },
      { href: '/docs/components/message', label: 'Message' },
      { href: '/docs/components/response', label: 'Response' },
      { href: '/docs/components/code-block', label: 'CodeBlock' },
      { href: '/docs/components/conversation', label: 'Conversation' },
      { href: '/docs/components/prompt-input', label: 'PromptInput' },
      { href: '/docs/components/reasoning', label: 'Reasoning' },
      { href: '/docs/components/tool-call', label: 'ToolCall' },
      { href: '/docs/components/confirmation', label: 'Confirmation' },
      { href: '/docs/components/sources', label: 'Sources' },
      { href: '/docs/components/inline-citation', label: 'InlineCitation' },
      { href: '/docs/components/suggestions', label: 'Suggestions' },
      { href: '/docs/components/chain-thought', label: 'ChainThought' },
      { href: '/docs/components/streaming-indicator', label: 'StreamingIndicator' },
      { href: '/docs/components/branch', label: 'Branch' },
      { href: '/docs/components/attachment', label: 'Attachment' },
      { href: '/docs/components/message-actions', label: 'MessageActions' },
    ],
  },
];

/** Flat ordered list used for prev/next pagination across all docs pages. */
export const FLAT_NAV: NavItem[] = NAV_SECTIONS.flatMap((section) => section.items);

export function getNeighbors(href: string): { previous?: NavItem; next?: NavItem } {
  const index = FLAT_NAV.findIndex((item) => item.href === href);
  if (index === -1) return {};
  return {
    previous: index > 0 ? FLAT_NAV[index - 1] : undefined,
    next: index < FLAT_NAV.length - 1 ? FLAT_NAV[index + 1] : undefined,
  };
}
