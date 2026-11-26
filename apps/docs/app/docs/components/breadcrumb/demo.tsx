'use client';

import { useState } from 'react';
import { DemoCard } from '@/components/demo-card';
import { Breadcrumb } from '@slipstream-ui/core';

export default function Demo() {
  const [lastClick, setLastClick] = useState<string | null>(null);

  return (
    <>
      <DemoCard
        title="Custom routing via onItemClick"
        preview={
          <div className="w-full space-y-4">
            <Breadcrumb
              items={[
                // Demo-safe fragments: clicking must not navigate the docs site.
                // In your app, use real routes ("/", "/docs", ...).
                { label: 'Home', href: '#crumb-home' },
                { label: 'Docs', href: '#crumb-docs' },
                { label: 'Components' },
              ]}
              onItemClick={(item, index) => setLastClick(`${index}: ${item.label}`)}
            />
            <p className="text-xs text-muted-foreground" role="status">
              {lastClick
                ? `Intercepted click: default navigation prevented for "${lastClick}".`
                : 'Click Home or Docs: routing is intercepted by the callback.'}
            </p>
          </div>
        }
        code={`import { Breadcrumb } from '@slipstream-ui/core';

export default function Example() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '/' },
        { label: 'Docs', href: '/docs' },
        { label: 'Components' }, // no href = current page
      ]}
      onItemClick={(item, index) => {
        // Default <a> navigation is prevented: route yourself
        router.push(item.href!);
        track('breadcrumb_click', { item, index });
      }}
    />
  );
}`}
        usage={`import { Breadcrumb } from '@slipstream-ui/core';

// Last item (no href) renders as the current page
<Breadcrumb items={items} separator="/" />

// Intercept every link click (router/analytics/custom navigation)
<Breadcrumb items={items} onItemClick={(item) => navigate(item.href!)} />`}
        types={`type BreadcrumbProps = {
  items: BreadcrumbItem[];
  label?: string;
  separator?: ReactNode;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  linkComponent?: React.ElementType;
  linkHrefProp?: 'href' | 'to';
  truncateCurrent?: boolean;
};`}
      />
    </>
  );
}
