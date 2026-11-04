'use client';

import { useState } from 'react';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Breadcrumb } from '@slipstream-ui/core';

export default function BreadcrumbPage() {
  const [lastClick, setLastClick] = useState<string | null>(null);

  return (
    <ComponentPage
      id="breadcrumb"
      title="Breadcrumb"
      description="Navigation breadcrumb trail with links, current-page indicator, and an optional click callback for custom routing."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'BreadcrumbItem[]', description: 'Ordered breadcrumb items; the last is the current page.' },
        { name: 'separator', type: 'ReactNode', defaultValue: "'/'", description: 'Separator character between items.' },
        { name: 'onItemClick', type: '(item, index) => void', description: 'Receives every link click and prevents default navigation — route with your own router, state machine, or analytics.' },
      ]}
      accessibility={[
        'nav[aria-label=Breadcrumb] landmark for screen readers.',
        'Last item has aria-current=page.',
        'onItemClick intercepts activation only — keyboard activation (Enter) fires it too.',
      ]}
    >
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
                ? `Intercepted click — default navigation prevented for "${lastClick}".`
                : 'Click Home or Docs — routing is intercepted by the callback.'}
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
        // Default <a> navigation is prevented — route yourself
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
  separator?: ReactNode;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
};`}
      />
    </ComponentPage>
  );
}
