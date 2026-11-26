import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/breadcrumb', {
  title: "Breadcrumb",
  description: "Navigation breadcrumb trail with links and current-page indicator.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('breadcrumb')}
      id="breadcrumb"
      title="Breadcrumb"
      description="Navigation breadcrumb trail with links, current-page indicator, and an optional click callback for custom routing."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'BreadcrumbItem[]', description: 'Ordered breadcrumb items; the last is the current page.' },
        { name: 'label', type: 'string', defaultValue: "'Breadcrumb'", description: 'Accessible name of the nav landmark.' },
        { name: 'separator', type: 'ReactNode', defaultValue: "'/'", description: 'Separator character between items.' },
        { name: 'onItemClick', type: '(item, index) => void', description: 'Receives every link click and prevents default navigation: route with your own router, state machine, or analytics.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers (Next Link, react-router Link).' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: "Prop used to pass the destination to linkComponent; 'to' for react-router." },
        { name: 'truncateCurrent', type: 'boolean', defaultValue: 'false', description: 'Truncate the current-page label and expose the full text as a title.' },
      ]}
      accessibility={[
        'nav[aria-label=Breadcrumb] landmark for screen readers.',
        'Last item has aria-current=page.',
        'onItemClick intercepts activation only: keyboard activation (Enter) fires it too.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
