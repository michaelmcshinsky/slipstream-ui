import '@slipstream-ui/themes/styles.css';
import '@slipstream-ui/core/styles-full.css';

import { AppShell, Sidebar, SiteHeader, type SidebarSection } from '@slipstream-ui/core';
import * as React from 'react';
import { createRoot } from 'react-dom/client';

const params = new URLSearchParams(window.location.search);
const fixture = params.get('fixture') ?? 'shell';
const theme = params.get('theme') ?? 'light';
const collapsed = params.get('collapsed') === '1';

if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}

const SECTIONS: SidebarSection[] = [
  {
    title: 'Workspace',
    items: [
      { href: '/app', label: 'Overview' },
      { href: '/app/clients', label: 'Clients', badge: '12' },
      { href: '/app/bookings', label: 'Bookings' },
      { href: '/app/packages', label: 'Packages' },
    ],
  },
  {
    title: 'Business',
    items: [
      { href: '/app/reports', label: 'Reports' },
      { href: '/app/settings', label: 'Settings' },
    ],
  },
];

function LongPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-semibold text-foreground">Client detail</h1>
      <p className="text-sm text-muted-foreground">
        A deliberately long page so the shell has something to scroll. The footer must stay reachable and
        the rail must not stretch past the viewport.
      </p>
      {Array.from({ length: 40 }, (_, index) => (
        <section key={index} className="rounded-lg border border-border p-4">
          <h2 className="text-sm font-medium text-foreground">Session {index + 1}</h2>
          <p className="text-sm text-muted-foreground">
            Booked, paid, and completed. This row exists to give the page height.
          </p>
        </section>
      ))}
      <footer data-testid="page-footer" className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
        End of page footer
      </footer>
    </main>
  );
}

function ShellFixture() {
  return (
    <div className="min-h-screen bg-background">
      <AppShell
        sidebar={
          <Sidebar
            sections={SECTIONS}
            heading={<span className="text-sm font-semibold text-foreground">Slipstream</span>}
            footer={<div className="text-xs text-muted-foreground">owner@example.com</div>}
            activeHref="/app/clients"
            collapsible
            defaultCollapsed={collapsed}
          />
        }
        header={<div className="flex h-14 items-center px-4 text-sm font-medium">Clients</div>}
      >
        <LongPage />
      </AppShell>
    </div>
  );
}

function HeaderFixture() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        brand={<span className="text-sm font-semibold">Slipstream</span>}
        items={[
          { href: '/', label: 'Home' },
          { href: '/docs', label: 'Docs' },
          { href: '/pricing', label: 'Pricing' },
        ]}
        activeHref="/docs"
        actions={<span className="text-sm font-medium text-primary">Get started</span>}
      />
      <LongPage />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{fixture === 'header' ? <HeaderFixture /> : <ShellFixture />}</React.StrictMode>
);
