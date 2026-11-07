'use client';

import { useState } from 'react';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { LinkTabs } from '@slipstream-ui/core';

const items = [
  { label: 'Overview', href: '/docs/components/link-tabs', exact: true },
  { label: 'Settings', href: '/docs/components/link-tabs/settings' },
  { label: 'Billing', href: '/docs/components/link-tabs/billing' },
];

export default function LinkTabsPage() {
  const [path, setPath] = useState('/docs/components/link-tabs');

  return (
    <ComponentPage
      id="link-tabs"
      title="LinkTabs"
      description="URL-driven navigation tabs for settings, account, and app sub-navigation. Real links, aria-current, and prefix/exact matching."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'LinkTabsItem[]', description: 'Tabs with label, href, exact, icon, disabled.' },
        { name: 'activeHref', type: 'string', description: 'Current pathname used to mark the active tab.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Router link element; defaults to an anchor.' },
        { name: 'variant', type: "'default' | 'underline' | 'rounded'", defaultValue: "'default'", description: 'Strip design.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Control density.' },
        { name: 'label', type: 'string', defaultValue: "'Section'", description: 'Accessible name for the navigation landmark.' },
      ]}
      accessibility={[
        'Renders a nav landmark with an accessible label.',
        'The active link receives aria-current="page".',
        'Disabled items render as spans with aria-disabled and no link.',
      ]}
    >
      <DemoCard
        title="Settings navigation"
        preview={
          <div className="flex w-full max-w-2xl flex-col gap-3">
            <LinkTabs items={items} activeHref={path} />
            <div className="flex flex-wrap gap-2 text-xs">
              {items.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  className="rounded border border-border px-2 py-1"
                  onClick={() => setPath(item.href)}
                >
                  Visit {item.label}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Current path: {path}</p>
          </div>
        }
        code={`import { LinkTabs } from '@slipstream-ui/core';

<LinkTabs
  items={[
    { label: 'Overview', href: '/settings', exact: true },
    { label: 'Billing', href: '/settings/billing' },
  ]}
  activeHref={pathname}
  linkComponent={Link}
/>`}
      />

      <DemoCard
        title="Underline strip"
        preview={
          <div className="w-full max-w-2xl">
            <LinkTabs items={items} activeHref={path} variant="underline" />
          </div>
        }
        code={`<LinkTabs items={items} activeHref={pathname} variant="underline" />`}
      />
    </ComponentPage>
  );
}
