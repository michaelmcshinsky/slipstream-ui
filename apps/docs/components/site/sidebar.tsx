'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV_SECTIONS, type NavGroup, type NavSection } from '@/lib/nav';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
    >
      <path d="M7.5 5l5 5-5 5" />
    </svg>
  );
}

function NavItemLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
          active ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:bg-muted/60'
        }`}
      >
        {label}
      </Link>
    </li>
  );
}

function groupHasActive(group: NavGroup, pathname: string): boolean {
  return group.items.some((item) => pathname === item.href);
}

/**
 * Persistent docs sidebar with collapsible sections (assistant-ui style).
 * Component groups default to closed EXCEPT the one containing the active
 * route; user toggles win until the docs layout remounts.
 */
export function Sidebar() {
  const pathname = usePathname();
  // Explicit user toggles keyed by `section` or `section/group` — absence
  // falls back to the defaults below.
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  const toggle = (key: string, next: boolean) =>
    setToggled((prev) => ({ ...prev, [key]: next }));

  const isOpen = (key: string, fallback: boolean) => (key in toggled ? toggled[key] : fallback);

  const renderItem = (item: { href: string; label: string }) => (
    <NavItemLink key={item.href} href={item.href} label={item.label} active={pathname === item.href} />
  );

  const renderSection = (section: NavSection) => {
    const sectionKey = section.title;
    const sectionOpen = isOpen(sectionKey, true);
    const sectionActive =
      section.items?.some((i) => pathname === i.href) ||
      section.groups?.some((g) => groupHasActive(g, pathname)) ||
      false;

    return (
      <div key={section.title}>
        <button
          type="button"
          onClick={() => toggle(sectionKey, !sectionOpen)}
          aria-expanded={sectionOpen}
          className={`flex w-full items-center justify-between gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors hover:text-foreground ${
            sectionActive ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {section.title}
          <Chevron open={sectionOpen} />
        </button>
        {sectionOpen && (
          <ul className="mt-0.5 space-y-0.5">
            {section.items?.map(renderItem)}
            {section.groups?.map((group) => {
              const groupKey = `${section.title}/${group.title}`;
              const groupActive = groupHasActive(group, pathname);
              // Default: the active route's group is open, the rest are not.
              const groupOpen = isOpen(groupKey, groupActive);
              return (
                <li key={group.title} className="mt-1.5 first:mt-1">
                  <button
                    type="button"
                    onClick={() => toggle(groupKey, !groupOpen)}
                    aria-expanded={groupOpen}
                    className={`flex w-full items-center justify-between gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors hover:text-foreground ${
                      groupActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {group.title}
                    <Chevron open={groupOpen} />
                  </button>
                  {groupOpen && (
                    <ul className="mt-0.5 space-y-0.5 pl-1">
                      {group.items.map(renderItem)}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 flex-shrink-0 overflow-y-auto py-8 pr-4 lg:block">
      <nav aria-label="Documentation" className="space-y-4">
        {NAV_SECTIONS.map(renderSection)}
      </nav>
    </aside>
  );
}
