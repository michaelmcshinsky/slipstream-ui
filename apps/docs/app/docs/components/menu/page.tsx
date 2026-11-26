import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/menu', {
  title: "Menu",
  description: "Dropdown menu with keyboard navigation and ARIA menu semantics.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('menu')}
      id="menu"
      title="Menu"
      description="Dropdown menu with keyboard navigation and ARIA menu semantics."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
      ]}
      accessibility={[
        'role=menu/menuitem with aria-haspopup/aria-expanded on the trigger.',
        'Arrow keys, Home/End, and Escape navigate and close the menu.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
