import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/link-tabs', {
  title: 'LinkTabs',
  description:
    'Route-driven navigation tabs that render real links and mark the current path with aria-current.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('link-tabs')}
      id="link-tabs"
      title="LinkTabs"
      description="URL-driven navigation tabs for settings, account, and app sub-navigation. Real links, aria-current, and prefix/exact matching."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'LinkTabsItem[]', description: 'Tabs with label, href, exact, icon, disabled.' },
        { name: 'activeHref', type: 'string', description: 'Current pathname used to mark the active tab.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Router link element; defaults to an anchor.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop used to pass the destination to linkComponent (to for react-router style routers).' },
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
      <Demo />
    </ComponentPage>
  );
}
