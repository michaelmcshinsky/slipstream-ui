export interface SearchEntry {
  title: string;
  href: string;
  /** Keywords/content used for full-text matching. */
  content: string;
  /** Section grouping shown in the palette. */
  group: string;
}

export const SEARCH_INDEX: SearchEntry[] = [
  { title: 'Introduction', href: '/docs', content: 'what makes slipstream different component manifest AI-first agents', group: 'Getting Started' },
  { title: 'Installation', href: '/docs/installation', content: 'install setup npx init pnpm add core ai quick start shadcn registry', group: 'Getting Started' },
  { title: 'Theming', href: '/docs/theming', content: 'css variables createTheme presets dark mode violet zinc colors radius switcher', group: 'Getting Started' },
  { title: 'COMPONENT_MANIFEST', href: '/docs/ai-manifests', content: 'manifest schema props anti-patterns accessibility composition rules json spec', group: 'AI-First' },
  { title: 'CLI', href: '/docs/cli', content: 'slipstream-ui init add list command terminal detection', group: 'AI-First' },
  { title: 'Patterns', href: '/docs/patterns', content: 'recipes chat interface agent activity composed examples', group: 'AI-First' },
  { title: 'Templates', href: '/docs/templates', content: 'examples streaming chat agent dashboard rag citations copy-paste', group: 'AI-First' },
  { title: 'MCP Server', href: '/docs/mcp', content: 'model context protocol claude cursor tools list_components get_manifest validate_usage', group: 'AI-First' },
  ...['Button', 'Input', 'Badge', 'Avatar', 'Spinner'].map((name) => ({
    title: name,
    href: `/docs/components/${name.toLowerCase()}`,
    content: `core atom component ${name.toLowerCase()}`,
    group: 'Components',
  })),
  { title: 'Message', href: '/docs/components/message', content: 'chat bubble role user assistant system avatar timestamp streaming renderContent labels edit retry error', group: 'Components' },
  { title: 'Response', href: '/docs/components/response', content: 'markdown renderer streaming gfm incomplete repair code blocks remark', group: 'Components' },
  { title: 'CodeBlock', href: '/docs/components/code-block', content: 'syntax highlighting prism copy button language label', group: 'Components' },
  { title: 'Conversation', href: '/docs/components/conversation', content: 'message list auto-scroll scroll to bottom download transcript welcome empty pagination streamingMessageId', group: 'Components' },
  { title: 'PromptInput', href: '/docs/components/prompt-input', content: 'textarea enter send stop generation attachments drag drop paste constraints dictation speech compound submit', group: 'Components' },
  { title: 'Reasoning', href: '/docs/components/reasoning', content: 'thinking steps chain of thought collapsible duration streaming aria-controls', group: 'Components' },
  { title: 'ToolCall', href: '/docs/components/tool-call', content: 'function call arguments result status pending running completed failed error', group: 'Components' },
  { title: 'Confirmation', href: '/docs/components/confirmation', content: 'approval gate human in the loop approve reject alertdialog destructive tool', group: 'Components' },
  { title: 'Sources', href: '/docs/components/sources', content: 'citations references footer numbered links snippets grounding', group: 'Components' },
  { title: 'InlineCitation', href: '/docs/components/inline-citation', content: 'perplexity style hover chip tooltip superscript inline source claim', group: 'Components' },
  { title: 'Suggestions', href: '/docs/components/suggestions', content: 'follow-up prompts clickable quick actions onSelect', group: 'Components' },
  { title: 'ChainThought', href: '/docs/components/chain-thought', content: 'task timeline status dots pending completed failed agent progress', group: 'Components' },
  { title: 'StreamingIndicator', href: '/docs/components/streaming-indicator', content: 'generating dots pulse animation isStreaming text', group: 'Components' },
  { title: 'Branch', href: '/docs/components/branch', content: 'variants navigation previous next regenerate alternatives position', group: 'Components' },
  { title: 'Attachment', href: '/docs/components/attachment', content: 'file chips upload remove preview thumbnail size type AttachmentList prompt', group: 'Components' },
  { title: 'MessageActions', href: '/docs/components/message-actions', content: 'copy feedback thumbs ratings regenerate toolbar autohide hover', group: 'Components' },
];
