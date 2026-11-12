'use client';

import Link from 'next/link';
import type { MessageKey } from '@slipstream-ui/i18n';
import { useI18n } from '@slipstream-ui/i18n/react';
import { PACKAGES, npmPackageUrl } from '@/lib/site';

const REPO_URL = 'https://github.com/michaelmcshinsky/slipstream-ui';

type FooterLink = { label?: string; labelKey?: MessageKey; href: string; external?: boolean; ariaLabel?: string };
type FooterColumn = { titleKey: MessageKey; links: FooterLink[] };

const COLUMNS: FooterColumn[] = [
  {
    titleKey: 'site.footer.docs',
    links: [
      { labelKey: 'site.footer.introduction', href: '/docs' },
      { labelKey: 'site.footer.installation', href: '/docs/installation' },
      { labelKey: 'site.footer.theming', href: '/docs/theming' },
      { labelKey: 'shell.components', href: '/docs/components' },
    ],
  },
  {
    titleKey: 'site.footer.aiFirst',
    links: [
      { label: 'COMPONENT_MANIFEST', href: '/docs/ai-manifests' },
      { labelKey: 'site.footer.mcpServer', href: '/docs/mcp' },
      { labelKey: 'shell.templates', href: '/docs/templates' },
      { label: 'llms.txt', href: '/llms.txt', external: true },
      { label: 'llms-full.txt', href: '/llms-full.txt', external: true },
    ],
  },
  {
    titleKey: 'site.footer.registry',
    links: [
      { labelKey: 'site.footer.registryIndex', href: '/registry/all.json', external: true },
      { labelKey: 'site.footer.llmIndex', href: '/llm/index.md', external: true },
      { labelKey: 'site.footer.cliReference', href: '/docs/cli' },
      { labelKey: 'shell.changelog', href: '/changelog' },
    ],
  },
  {
    titleKey: 'site.footer.packages',
    links: PACKAGES.map((pkg) => ({
      label: pkg.name.replace('@slipstream-ui/', ''),
      href: npmPackageUrl(pkg.name),
      external: true,
      ariaLabel: `${pkg.name} on npm`,
    })),
  },
  {
    titleKey: 'site.footer.project',
    links: [
      { label: 'GitHub', href: REPO_URL, external: true },
      { labelKey: 'site.footer.about', href: '/about' },
      { labelKey: 'site.footer.accessibility', href: '/accessibility' },
      { labelKey: 'site.footer.contributing', href: `${REPO_URL}/blob/main/CONTRIBUTING.md`, external: true },
      { labelKey: 'site.footer.license', href: `${REPO_URL}/blob/main/LICENSE`, external: true },
      { labelKey: 'site.footer.security', href: `${REPO_URL}/blob/main/SECURITY.md`, external: true },
      { labelKey: 'site.footer.reportIssue', href: `${REPO_URL}/issues`, external: true },
      { labelKey: 'site.footer.contact', href: '/contact' },
      { labelKey: 'site.footer.privacy', href: '/privacy' },
      { labelKey: 'site.footer.terms', href: '/terms' },
    ],
  },
];

/** Multi-column marketing footer (shadcn/daisyui pattern). */
export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Brand block plus five link columns: 1 → 2 → 3 → 6 as width grows. */}
      <div className="container mx-auto grid gap-10 px-4 py-14 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <div>
          <Link href="/" className="flex items-center" aria-label="Slipstream UI home">
            {/* eslint-disable-next-line @next/next/no-img-element -- local brand lockup, unoptimized by design */}
            <img
              src="/slipstream-lockup.png"
              alt="Slipstream UI"
              width={164} height={48}
              className="h-12 w-auto dark:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- white wordmark for dark surfaces */}
            <img
              src="/slipstream-lockup-dark.png"
              alt=""
              aria-hidden="true"
              width={164} height={48}
              className="hidden h-12 w-auto dark:block"
            />
          </Link>
          <p className="mt-3 max-w-48 text-sm text-muted-foreground">{t('site.footer.tagline')}</p>
        </div>
        {COLUMNS.map((column) => (
          <div key={column.titleKey}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t(column.titleKey)}
            </h3>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => {
                const label = link.labelKey ? t(link.labelKey) : link.label ?? '';
                return (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.ariaLabel} className="text-muted-foreground transition-colors hover:text-foreground">
                        {label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground">
          <span>{t('site.footer.copyright', { year: currentYear })}</span>
          <span>{t('site.footer.builtStateless')}</span>
        </div>
      </div>
    </footer>
  );
}
