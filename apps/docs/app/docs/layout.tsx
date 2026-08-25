import Link from 'next/link';
import { Search } from './Search';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  href: string;
  label: string;
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
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
      { href: '/docs/mcp', label: 'MCP Server' },
    ],
  },
  {
    title: 'Components',
    items: [
      { href: '/docs/components', label: 'Overview' },
      // Core
      { href: '/docs/components/button', label: 'Button' },
      { href: '/docs/components/input', label: 'Input' },
      { href: '/docs/components/badge', label: 'Badge' },
      { href: '/docs/components/avatar', label: 'Avatar' },
      { href: '/docs/components/spinner', label: 'Spinner' },
      // AI
      { href: '/docs/components/message', label: 'Message' },
      { href: '/docs/components/conversation', label: 'Conversation' },
      { href: '/docs/components/prompt-input', label: 'PromptInput' },
      { href: '/docs/components/reasoning', label: 'Reasoning' },
      { href: '/docs/components/tool-call', label: 'ToolCall' },
      { href: '/docs/components/sources', label: 'Sources' },
      { href: '/docs/components/suggestions', label: 'Suggestions' },
      { href: '/docs/components/chain-thought', label: 'ChainThought' },
      { href: '/docs/components/streaming-indicator', label: 'StreamingIndicator' },
      // Attachments
      { href: '/docs/components/attachment', label: 'Attachment' },
      { href: '/docs/components/message-actions', label: 'MessageActions' },
    ],
  },
];

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Slipstream UI
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/docs" className="text-foreground hover:text-primary">
                Docs
              </Link>
              <Link href="/docs/components" className="text-foreground hover:text-primary">
                Components
              </Link>
              <Search />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="sticky top-8">
              {NAV_SECTIONS.map((section) => (
                <div key={section.title} className="mb-6">
                  <h3 className="font-semibold mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 max-w-4xl">{children}</main>
        </div>
      </div>
    </div>
  );
}
