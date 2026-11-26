'use client';

import { useState } from 'react';
import { AppShell, Badge, Button, Sidebar } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

const NAV = [
  {
    title: 'Workspace',
    items: [
      { href: '#dashboard', label: 'Dashboard' },
      { href: '#classes', label: 'Classes', badge: <Badge variant="secondary">4</Badge> },
      { href: '#students', label: 'Students' },
    ],
  },
  {
    title: 'Account',
    items: [
      { href: '#settings', label: 'Settings' },
      { href: '#billing', label: 'Billing' },
    ],
  },
];

export default function Demo() {
  const [activeHref, setActiveHref] = useState('#dashboard');

  return (
    <>
      <DemoCard
        title="Dashboard shell (interactive)"
        preview={
          <div className="h-[26rem] overflow-hidden rounded-xl border border-border">
            <AppShell
              sidebarWidth="w-56"
              header={
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">Studio</span>
                  <Button size="sm" variant="outline">
                    New class
                  </Button>
                </div>
              }
              sidebar={
                <Sidebar
                  heading={<span className="text-sm font-bold">Example HQ</span>}
                  sections={NAV}
                  activeHref={activeHref}
                  footer={<span className="text-xs text-muted-foreground">Signed in as user@example.com</span>}
                />
              }
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold">Dashboard</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current route: <code className="text-foreground">{activeHref}</code>
                </p>
                <div className="mt-4 flex gap-2">
                  {NAV.flatMap((section) => section.items).map((item) => (
                    <Button
                      key={item.href}
                      size="sm"
                      variant={activeHref === item.href ? 'default' : 'outline'}
                      onClick={() => setActiveHref(item.href)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </AppShell>
          </div>
        }
        code={`import { AppShell, Sidebar } from '@slipstream-ui/core';

<AppShell
  header={<TopBar />}
  sidebar={
    <Sidebar
      activeHref={pathname}
      linkComponent={RouterLink}
      heading={<strong>Example HQ</strong>}
      sections={[
        { title: 'Workspace', items: [
          { href: '/dashboard', label: 'Dashboard' },
          { href: '/classes', label: 'Classes', badge: 4 },
        ] },
      ]}
      footer={<UserMenu />}
    />
  }
>
  <Page />
</AppShell>`}
        usage={`// Router-agnostic: pass your Link component and the current path.
// Below md the rail renders inside a left Drawer opened by the
// built-in burger button; hideMobileMenu turns that off.`}
        types={`type AppShellProps = {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  hideMobileMenu?: boolean;
  sidebarWidth?: string;
};

type SidebarProps = {
  sections: { title?: string; items: SidebarItem[] }[];
  activeHref?: string;
  linkComponent?: React.ElementType;
  heading?: React.ReactNode;
  footer?: React.ReactNode;
  label?: string;
};`}
      />
    </>
  );
}
