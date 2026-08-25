import Link from 'next/link';

const REPO_URL = 'https://github.com/slipstream-ui/slipstream-ui';
const CURRENT_YEAR = new Date().getFullYear();

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: 'Docs',
    links: [
      { label: 'Introduction', href: '/docs' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Theming', href: '/docs/theming' },
      { label: 'Components', href: '/docs/components' },
    ],
  },
  {
    title: 'AI-First',
    links: [
      { label: 'COMPONENT_MANIFEST', href: '/docs/ai-manifests' },
      { label: 'MCP Server', href: '/docs/mcp' },
      { label: 'Templates', href: '/docs/templates' },
      { label: 'llms.txt', href: '/llms.txt', external: true },
    ],
  },
  {
    title: 'Registry',
    links: [
      { label: 'Registry index', href: '/registry/all.json', external: true },
      { label: 'LLM doc index', href: '/llm/index.md', external: true },
      { label: 'CLI reference', href: '/docs/cli' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'GitHub', href: REPO_URL, external: true },
      { label: 'License (MIT)', href: `${REPO_URL}/blob/main/LICENSE`, external: true },
      { label: 'Report an issue', href: `${REPO_URL}/issues`, external: true },
    ],
  },
];

/** Multi-column marketing footer (shadcn/daisyui pattern). */
export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto grid gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Link href="/" className="text-lg font-bold tracking-tight">
            Slipstream<span className="text-primary">UI</span>
          </Link>
          <p className="mt-3 max-w-48 text-sm text-muted-foreground">
            The AI-first React component library. Your AI reads the spec, not the source.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {column.title}
            </h3>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground">
          <span>© {CURRENT_YEAR} Slipstream UI · MIT License</span>
          <span>Built stateless — you own your data flow.</span>
        </div>
      </div>
    </footer>
  );
}
