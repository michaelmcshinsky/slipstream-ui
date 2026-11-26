import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/filter-chips', {
  title: 'FilterChips',
  description: 'Active-filter summary with removable chips and a clear-all action.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('filter-chips')}
      id="filter-chips"
      title="FilterChips"
      description="Active-filter summary with removable chips and a clear-all action."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'filters', type: 'FilterChip[]', defaultValue: 'required', description: 'Active filters: key, label, optional value and onRemove.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Chip scale: padding, text size and remove-button icon size.' },
        { name: 'onClearAll', type: '() => void', description: 'Shows a clear-all action when provided.' },
        { name: 'clearLabel', type: 'string', defaultValue: "'Clear all'", description: 'Label for the clear-all action.' },
        { name: 'emptyLabel', type: 'string', description: 'Shown when there are no active filters. Nothing renders when omitted.' },
        { name: "'aria-label'", type: 'string', defaultValue: "'Active filters'", description: 'Accessible name for the filter group.' },
      ]}
      accessibility={[
        'Renders a named group (Active filters by default) so the summary has a landmark-like label.',
        'Each remove control is named Remove <filter>: <value>.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
