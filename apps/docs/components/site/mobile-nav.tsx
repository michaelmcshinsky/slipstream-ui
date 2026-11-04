'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_SECTIONS, sectionFirstHref } from '@/lib/nav';

/** Horizontal scrollable section pills shown below lg, where the sidebar hides. */
export function MobileNav() {
  const pathname = usePathname();

  // Only top-level sections on mobile — listing every component pill here
  // overflowed narrow viewports and truncated labels ("COMPON…").
  const sections = NAV_SECTIONS.map((section) => ({
    href: sectionFirstHref(section),
    label: section.title,
  }));

  return (
    <nav
      aria-label="Documentation sections"
      className="sticky top-14 z-30 -mx-4 border-b border-border bg-background/90 px-4 py-2 backdrop-blur lg:hidden"
    >
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/docs' && pathname.startsWith(item.href));
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
