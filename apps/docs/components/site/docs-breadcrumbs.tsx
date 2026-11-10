'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FLAT_NAV } from '@/lib/nav';
import { JsonLd } from './json-ld';
import { breadcrumbSchema } from '@/lib/structured-data';

/** Section landing pages whose sidebar label ("Overview") is too generic. */
const LABEL_OVERRIDES: Record<string, string> = {
  '/docs': 'Docs',
  '/docs/components': 'Components',
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
  const pathname = usePathname() ?? '/docs';
  if (pathname === '/docs') return null;

  const labelByHref = new Map(FLAT_NAV.map((item) => [item.href, item.label]));
  const trail: Crumb[] = [{ name: 'Docs', href: '/docs' }];

  const segments = pathname.split('/').filter(Boolean);
  let href = '';
  for (const segment of segments) {
    href += `/${segment}`;
    if (href === '/docs') continue;
    const label = LABEL_OVERRIDES[href] ?? labelByHref.get(href);
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
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
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
