import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/bottom-nav', {
  title: 'BottomNav',
  description:
    'Mobile bottom tab bar for the 3-5 primary destinations of an app shell, with an active tab, count badges and safe-area padding.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('bottom-nav')}
      id="bottom-nav"
      title="BottomNav"
      description="Mobile bottom tab bar for the 3-5 primary destinations of an app shell, with an active tab, count badges and safe-area padding."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'BottomNavItem[]', defaultValue: 'required', description: 'Tabs in order: href, label, optional icon, active, badge and disabled.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Router link component (Next Link, react-router Link).' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop used to pass the destination to linkComponent.' },
        { name: 'label', type: 'string', defaultValue: "'Primary'", description: 'Accessible label for the nav landmark.' },
        { name: 'fixed', type: 'boolean', defaultValue: 'true', description: 'Pin the bar to the bottom edge with safe-area padding.' },
        { name: 'mobileOnly', type: 'boolean', defaultValue: 'true', description: 'Hide the bar from the md breakpoint up.' },
      ]}
      accessibility={[
        'Renders a nav landmark named by label (default "Primary").',
        'Only the active tab carries aria-current="page".',
        'Every tab is at least 56px tall with a 44px minimum target.',
        'env(safe-area-inset-bottom) keeps the bar clear of the iOS home indicator.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
