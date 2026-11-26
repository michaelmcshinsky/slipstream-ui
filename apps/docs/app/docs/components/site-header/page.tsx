import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/site-header', {
  title: 'SiteHeader',
  description: 'Sticky marketing header with prefix-aware nav, actions and a mobile drawer.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('site-header')}
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
      <Demo />
    </ComponentPage>
  );
}
