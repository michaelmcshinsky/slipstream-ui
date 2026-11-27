import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/app-shell', {
  title: 'AppShell',
  description:
    'Application frame: sectioned sidebar, sticky header and scrolling main; the sidebar becomes a mobile drawer with a built-in burger button.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('app-shell')}
      id="app-shell"
      title="AppShell"
      description="Application frame: sectioned sidebar, sticky header and scrolling main; the sidebar becomes a mobile drawer with a built-in burger button."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'sidebar', type: 'ReactNode', description: 'Desktop rail content; also rendered inside the mobile drawer (AppShell).' },
        { name: 'header', type: 'ReactNode', description: 'Sticky top bar content (AppShell).' },
        { name: 'hideMobileMenu', type: 'boolean', defaultValue: 'false', description: 'Hide the built-in burger when the header owns navigation (AppShell).' },
        { name: 'sidebarWidth', type: 'string', defaultValue: "'w-64'", description: 'Tailwind width class for the desktop rail (AppShell).' },
        { name: 'sections', type: '{ title?: string; items: SidebarItem[] }[]', defaultValue: 'required', description: 'Grouped navigation items (Sidebar).' },
        { name: 'items[].children', type: 'SidebarItem[]', description: 'Nested items render indented under the parent; groups containing the active route open automatically.' },
        { name: 'items[].active', type: 'boolean', description: 'Force the active state, overriding the activeHref comparison (SidebarItem).' },
        { name: 'activeHref', type: 'string', description: 'Current route: matching items get aria-current="page" (Sidebar).' },
        { name: 'linkComponent', type: 'React.ElementType', defaultValue: "'a'", description: 'Router link component (react-router Link, Next Link) (Sidebar).' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop name used to pass the destination to linkComponent.' },
        { name: 'heading / footer', type: 'ReactNode', description: 'Brand slot at the top and utility slot at the bottom (Sidebar).' },
      ]}
      accessibility={[
        'Sidebar renders a named nav landmark; the active item carries aria-current="page".',
        'On small screens the rail becomes a focus-trapped Drawer with Escape and focus restoration.',
        'Pass your router’s Link so navigation stays client-side.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
