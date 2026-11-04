import Link from 'next/link';

const REPO_URL = 'https://github.com/michaelmcshinsky/slipstream-ui';
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
      { label: 'llms-full.txt', href: '/llms-full.txt', external: true },
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
      { label: 'About', href: '/about' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Contributing', href: `${REPO_URL}/blob/main/CONTRIBUTING.md`, external: true },
      { label: 'License (MIT)', href: `${REPO_URL}/blob/main/LICENSE`, external: true },
      { label: 'Security policy', href: `${REPO_URL}/blob/main/SECURITY.md`, external: true },
      { label: 'Report an issue', href: `${REPO_URL}/issues`, external: true },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
];

/** Multi-column marketing footer (shadcn/daisyui pattern). */
export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto grid gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Link href="/" className="flex items-center" aria-label="Slipstream UI home">
            {/* eslint-disable-next-line @next/next/no-img-element -- local brand lockup, unoptimized by design */}
            <img
              src="/slipstream-lockup.png"
              alt="Slipstream UI"
              width={164} height={48}
              className="h-12 w-auto"
            />
          </Link>
          <p className="mt-3 max-w-48 text-sm text-muted-foreground">
            The AI-first React component library. Your AI reads the spec, not the source.
          </p>

          {/* Netlify Forms: works without JS and without a backend. */}
          <form
            name="release-notify"
            method="POST"
            action="/thank-you"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="mt-5 max-w-64"
          >
            <input type="hidden" name="form-name" value="release-notify" />
            <p className="hidden">
              <label>
                Don&apos;t fill this out: <input name="bot-field" />
              </label>
            </p>
            <label htmlFor="release-email" className="text-xs font-medium text-foreground">
              Release notes by email
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="release-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                className="inline-flex h-11 shrink-0 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Notify me
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Release notes only. No newsletter.</p>
          </form>
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
