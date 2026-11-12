'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MessageKey } from '@slipstream-ui/i18n';
import { useI18n } from '@slipstream-ui/i18n/react';
import { FLAT_NAV, navItemLabel } from '@/lib/nav';
import { JsonLd } from './json-ld';
import { breadcrumbSchema } from '@/lib/structured-data';

/** Section landing pages whose sidebar label ("Overview") is too generic. */
const LABEL_OVERRIDES: Record<string, MessageKey> = {
  '/docs': 'shell.docs',
  '/docs/components': 'shell.components',
};

type Crumb = { name: string; href: string };

/**
 * Visible breadcrumb trail plus the matching BreadcrumbList JSON-LD.
 *
 * The docs routes are flat folders, so the trail is derived from the URL and
 * labelled with the same nav labels the sidebar uses. Intermediate segments
 * that are not real routes (for example /docs/guides) are skipped so a crumb
 * never links to a 404.
 */
export function DocsBreadcrumbs() {
  const { t } = useI18n();
  const pathname = usePathname() ?? '/docs';
  if (pathname === '/docs') return null;

  const labelByHref = new Map(FLAT_NAV.map((item) => [item.href, navItemLabel(item, t)]));
  const trail: Crumb[] = [{ name: t('shell.docs'), href: '/docs' }];

  const segments = pathname.split('/').filter(Boolean);
  let href = '';
  for (const segment of segments) {
    href += `/${segment}`;
    if (href === '/docs') continue;
    const overrideKey = LABEL_OVERRIDES[href];
    const label = overrideKey ? t(overrideKey) : labelByHref.get(href);
    if (label) trail.push({ name: label, href });
  }

  if (trail[trail.length - 1]?.href !== pathname) {
    const slug = segments[segments.length - 1] ?? '';
    const fallback = slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    trail.push({ name: fallback, href: pathname });
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail.map(({ name, href: path }) => ({ name, path })))} />
      <nav aria-label={t('site.breadcrumbAria')} className="mb-4 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          {trail.map((crumb, index) => {
            const isCurrent = index === trail.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {index > 0 && <span aria-hidden="true">/</span>}
                {isCurrent ? (
                  <span aria-current="page" className="text-foreground">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.href} className="hover:text-foreground">
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
