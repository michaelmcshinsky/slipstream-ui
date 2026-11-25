'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@slipstream-ui/i18n/react';
import { NAV_SECTIONS, navSectionLabel, sectionFirstHref, type NavSection } from '@/lib/nav';

function sectionHrefs(section: NavSection): string[] {
  return [
    ...(section.items ?? []).map((item) => item.href),
    ...(section.groups ?? []).flatMap((group) => group.items.map((item) => item.href)),
  ];
}

function hrefMatches(pathname: string, href: string): boolean {
  // Segment-boundary match: '/docs/components/button' must not claim
  // '/docs/components/button-group', and bare '/docs' only matches itself.
  return pathname === href || (href !== '/docs' && pathname.startsWith(`${href}/`));
}

/** Horizontal scrollable section pills shown below lg, where the sidebar hides. */
export function MobileNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  // Only top-level sections on mobile: listing every component pill here
  // overflowed narrow viewports and truncated labels ("COMPON…").
  const sections = NAV_SECTIONS.map((section) => ({
    href: sectionFirstHref(section),
    hrefs: sectionHrefs(section),
    label: navSectionLabel(section, t),
  }));

  return (
    <nav
      aria-label={t('site.mobileNavAria')}
      className="sticky top-14 z-30 -mx-4 border-b border-border bg-background/90 px-4 py-2 backdrop-blur lg:hidden"
    >
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((item) => {
          const isActive = item.hrefs.some((href) => hrefMatches(pathname, href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-full border px-3.5 py-2 text-xs transition-colors ${
                isActive
                  ? 'border-primary/50 bg-primary/10 font-medium text-primary'
                  : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
