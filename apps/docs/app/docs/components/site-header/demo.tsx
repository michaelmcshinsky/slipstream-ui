'use client';

import { SiteHeader } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function SiteHeaderPage() {
  return (
    <ComponentPage
      id="site-header"
      title="SiteHeader"
      description="Sticky marketing/site header: brand, horizontal navigation with prefix-aware active states, right-aligned actions and a mobile drawer."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'brand', type: 'ReactNode', defaultValue: 'required', description: 'Brand slot, wrapped in a link to /.' },
        { name: 'items', type: 'SiteNavItem[]', defaultValue: 'required', description: 'Primary nav: { href, label, external? }.' },
        { name: 'activeHref', type: 'string', description: 'Current route for active styling (aria-current="page").' },
        { name: 'match', type: "'prefix' | 'exact'", defaultValue: "'prefix'", description: 'Prefix highlights parents (/docs on /docs/x); exact only identical hrefs.' },
        { name: 'actions', type: 'ReactNode', description: 'Right-aligned actions (theme toggle, GitHub, CTA).' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Router link element (Next Link, react-router Link).' },
        { name: 'sticky', type: 'boolean', defaultValue: 'true', description: 'Pin the bar to the top.' },
      ]}
      accessibility={['Active link carries aria-current="page" with prefix-aware matching.', 'Mobile navigation opens in a focus-trapped Drawer.', 'External items get target=_blank + rel=noopener.']}
    >
      <DemoCard
        title="Marketing header"
        preview={
          <div className="w-full overflow-hidden rounded-xl border border-border">
            <SiteHeader
              brand={<span className="text-base font-bold">Example</span>}
              items={[
                { href: '/docs', label: 'Docs' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/changelog', label: 'Changelog' },
                { href: 'https://example.com', label: 'GitHub', external: true },
              ]}
              activeHref="/docs/components"
              actions={<span className="rounded-md border border-border px-2 py-1 text-xs">⌘K</span>}
            />
          </div>
        }
        code={`<SiteHeader
  brand={<strong>Example</strong>}
  items={[
    { href: '/docs', label: 'Docs' },
    { href: '/pricing', label: 'Pricing' },
    { href: 'https://github.com/org/repo', label: 'GitHub', external: true },
  ]}
  activeHref={pathname}
  linkComponent={RouterLink}
  actions={<ThemeToggle />}
/>`}
        usage={`// activeHref="/docs/components" marks "Docs" active with prefix matching.
// Below md the same items move into a Drawer with a burger button.`}
        types={`type SiteHeaderProps = {
  brand: React.ReactNode;
  items: { href: string; label: string; external?: boolean }[];
  activeHref?: string;
  match?: 'prefix' | 'exact';
  actions?: React.ReactNode;
  linkComponent?: React.ElementType;
  sticky?: boolean;
  mobileLabel?: string;
};`}
      />
    </ComponentPage>
  );
}
