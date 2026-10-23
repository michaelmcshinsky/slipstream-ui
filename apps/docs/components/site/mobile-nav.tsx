'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FLAT_NAV } from '@/lib/nav';

/** Horizontal scrollable section pills shown below lg, where the sidebar hides. */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Documentation sections"
      className="sticky top-14 z-30 -mx-4 border-b border-border bg-background/90 px-4 py-2 backdrop-blur lg:hidden"
    >
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FLAT_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs transition-colors ${
                active
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
