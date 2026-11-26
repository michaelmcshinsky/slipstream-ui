'use client';

import { useState, type ComponentProps } from 'react';
import { DemoCard } from '@/components/demo-card';
import { LinkTabs } from '@slipstream-ui/core';

const items = [
  { label: 'Overview', href: '/docs/components/link-tabs', exact: true },
  { label: 'Settings', href: '/docs/components/link-tabs/settings' },
  { label: 'Billing', href: '/docs/components/link-tabs/billing' },
];

export default function Demo() {
  const [path, setPath] = useState('/docs/components/link-tabs');

  // Demo-only link: keeps the tabs interactive without navigating readers to
  // routes that only exist inside the example.
  function DemoLink({ href, children, onClick, ...props }: ComponentProps<'a'>) {
    const target = typeof href === 'string' ? href : '#';
    return (
      <a
        href={target}
        onClick={(event) => {
          event.preventDefault();
          setPath(target);
          onClick?.(event);
        }}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <DemoCard
        title="Settings navigation"
        preview={
          <div className="flex w-full max-w-2xl flex-col gap-3">
            <LinkTabs items={items} activeHref={path} linkComponent={DemoLink} />
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
            <LinkTabs items={items} activeHref={path} variant="underline" linkComponent={DemoLink} />
          </div>
        }
        code={`<LinkTabs items={items} activeHref={pathname} variant="underline" />`}
      />
    </>
  );
}
