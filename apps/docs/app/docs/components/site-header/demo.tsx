'use client';

import { SiteHeader } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Marketing header"
        preview={
          <div className="w-full overflow-hidden rounded-xl border border-border">
            <SiteHeader
              brand={<span className="text-base font-bold">Example</span>}
              topBar={
                <>
                  <span>English</span>
                  <a href="/submit" className="hover:text-foreground">Submit an event</a>
                </>
              }
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
  topBar?: React.ReactNode;
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
  mobileMenuOpenLabel?: string;
  mobileMenuCloseLabel?: string;
  mobileDrawerCloseLabel?: string;
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
    </>
  );
}
