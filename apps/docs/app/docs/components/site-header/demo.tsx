'use client';

import { SiteHeader } from '@slipstream-ui/core';
import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function SiteHeaderPage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
  return (
    <ComponentPage
        manifest={manifest}
      id="site-header"
      title="SiteHeader"
      description="Sticky marketing/site header: brand, horizontal navigation with prefix-aware active states, optional mega-menu panels, right-aligned actions and a mobile drawer."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'brand', type: 'ReactNode', defaultValue: 'required', description: 'Brand slot, wrapped in a link to /.' },
        { name: 'items', type: 'SiteNavItem[]', defaultValue: 'required', description: 'Primary nav. Flat links are { href, label, external?, description? }; adding columns: SiteNavColumn[] turns the item into a disclosure trigger with a desktop mega panel and a mobile <details> group.' },
        { name: 'activeHref', type: 'string', description: 'Current route for active styling (aria-current="page").' },
        { name: 'match', type: "'prefix' | 'exact'", defaultValue: "'prefix'", description: 'Prefix highlights parents (/docs on /docs/x); exact only identical hrefs.' },
        { name: 'actions', type: 'ReactNode', description: 'Right-aligned actions (theme toggle, GitHub, CTA).' },
        { name: 'mobileActions', type: 'ReactNode', description: 'Actions rendered inside the mobile drawer; defaults to actions.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Router link element (Next Link, react-router Link).' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop used to pass the destination to linkComponent; use to for react-router-style routers.' },
        { name: 'brandLabel', type: 'string', defaultValue: "'Home'", description: 'Accessible name for the brand link.' },
        { name: 'navLabel', type: 'string', defaultValue: "'Main'", description: 'Accessible name for the desktop navigation landmark.' },
        { name: 'mobileNavLabel', type: 'string', defaultValue: "'Mobile'", description: 'Accessible name for the mobile navigation landmark.' },
        { name: 'sticky', type: 'boolean', defaultValue: 'true', description: 'Pin the bar to the top.' },
        { name: 'mobileLabel', type: 'string', defaultValue: "'Menu'", description: 'Title of the mobile navigation drawer.' },
        { name: 'showMobileTrigger', type: 'boolean', defaultValue: 'true', description: 'Render the built-in mobile trigger and drawer; set false when the host owns mobile navigation.' },
        { name: 'desktopBreakpoint', type: "'md' | 'lg'", defaultValue: "'md'", description: 'Breakpoint where the horizontal navigation appears.' },
        { name: 'navClassName', type: 'string', description: 'Extra classes for the inner nav row (height, padding).' },
      ]}
      accessibility={[
        'Active link carries aria-current="page" with prefix-aware matching.',
        'Mega-menu items are disclosure buttons (aria-expanded/aria-controls); Escape or an outside pointer closes the panel, ArrowDown moves focus into it.',
        'Mobile navigation opens in a focus-trapped Drawer; column items become native <details> groups.',
        'External items get target=_blank + rel=noopener.',
      ]}
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
        types={`type SiteNavLink = {
  href: string;
  label: string;
  external?: boolean;
  description?: string; // second line inside a mega panel
};

type SiteNavColumn = {
  heading?: string;
  items: SiteNavLink[];
};

type SiteNavItem =
  | SiteNavLink
  | {
      label: string;
      href?: string; // used only for active-state matching
      external?: boolean;
      description?: string;
      columns: SiteNavColumn[]; // renders a disclosure trigger, not a link
    };

type SiteHeaderProps = {
  brand: React.ReactNode;
  items: SiteNavItem[];
  activeHref?: string;
  match?: 'prefix' | 'exact';
  actions?: React.ReactNode;
  mobileActions?: React.ReactNode;
  linkComponent?: React.ElementType;
  linkHrefProp?: 'href' | 'to';
  brandLabel?: string;
  navLabel?: string;
  mobileNavLabel?: string;
  sticky?: boolean;
  mobileLabel?: string;
  showMobileTrigger?: boolean;
  desktopBreakpoint?: 'md' | 'lg';
  navClassName?: string;
};`}
      />
      <DemoCard
        title="Mega menu"
        preview={
          <div className="w-full overflow-hidden rounded-xl border border-border">
            <SiteHeader
              brand={<span className="text-base font-bold">Example</span>}
              items={[
                { href: '/docs', label: 'Docs' },
                {
                  label: 'Products',
                  href: '/products',
                  columns: [
                    {
                      heading: 'Build',
                      items: [
                        { href: '/products/ui', label: 'Component library', description: 'Accessible React components' },
                        { href: '/products/blocks', label: 'Blocks', description: 'Copy-paste section patterns' },
                      ],
                    },
                    {
                      heading: 'Platform',
                      items: [
                        { href: '/products/cli', label: 'CLI', description: 'Registry-driven installs' },
                        { href: '/products/mcp', label: 'MCP server', description: 'Component manifests for agents' },
                      ],
                    },
                  ],
                },
                { href: '/pricing', label: 'Pricing' },
              ]}
              activeHref="/docs/components"
            />
          </div>
        }
        code={`<SiteHeader
  brand={<strong>Example</strong>}
  items={[
    { href: '/docs', label: 'Docs' },
    {
      label: 'Products',
      href: '/products', // optional: active-state matching only
      columns: [
        {
          heading: 'Build',
          items: [
            { href: '/products/ui', label: 'Component library', description: 'Accessible React components' },
            { href: '/products/blocks', label: 'Blocks', description: 'Copy-paste section patterns' },
          ],
        },
        {
          heading: 'Platform',
          items: [
            { href: '/products/cli', label: 'CLI', description: 'Registry-driven installs' },
            { href: '/products/mcp', label: 'MCP server', description: 'Component manifests for agents' },
          ],
        },
      ],
    },
    { href: '/pricing', label: 'Pricing' },
  ]}
  activeHref={pathname}
/>`}
        usage={`// An item with columns renders as a disclosure trigger, not a link:
// hover/focus opens a desktop panel; Escape or outside pointer closes it.
// In the mobile drawer the same item becomes a native <details> group.
// Column links can carry a description shown as a second line in the panel.`}
      />
    </ComponentPage>
  );
}
