import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/list', {
  title: 'List / ListItem',
  description:
    'Semantic list (ul/li) for rows of related items: settings, results, nav: with slots, selection, and pressable rows.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('list')}
      id="list"
      title="List / ListItem"
      description="Semantic list (ul/li) for rows of related items: settings, results, nav: with leading/trailing slots, selection, and pressable rows."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'divided', type: 'boolean', defaultValue: 'false', description: 'Hairline dividers between rows (List).' },
        { name: 'bordered', type: 'boolean', defaultValue: 'false', description: 'Card-like surface and border around the list (List).' },
        { name: 'size', type: "'default' | 'compact'", defaultValue: "'default'", description: 'Row density (List).' },
        { name: 'leading', type: 'ReactNode', description: 'Leading slot: icon, avatar, status dot, or checkbox (ListItem).' },
        { name: 'trailing', type: 'ReactNode', description: 'Trailing slot: chevron, badge, meta, or action (ListItem).' },
        { name: 'selected', type: 'boolean', defaultValue: 'false', description: 'Marks the row as the active/selected item (ListItem).' },
        { name: 'description', type: 'string', description: 'Secondary line under the main content (ListItem).' },
        { name: 'onClick', type: '() => void', description: 'Makes the row pressable: content renders inside a full-width button (ListItem).' },
      ]}
      accessibility={[
        'Renders a real <ul>/<li>: screen readers announce item counts and per-item navigation.',
        'Pressable rows wrap content in a <button>, so ul > li semantics stay valid while the row is keyboard-operable.',
        'For navigation lists, pass aria-current="true" on the active row via props.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
