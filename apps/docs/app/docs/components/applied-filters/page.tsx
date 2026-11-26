import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/applied-filters', {
  title: 'AppliedFilters',
  description: 'Applied-filter summary with a live count, removable chips and an edit action.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('applied-filters')}
      id="applied-filters"
      title="AppliedFilters"
      description="Applied-filter summary with a live count, removable chips and an edit action."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'filters', type: 'FilterChip[]', defaultValue: 'required', description: 'Active filters to display.' },
        { name: 'onClearAll', type: '() => void', description: 'Clear-all action.' },
        { name: 'onEdit', type: '() => void', description: 'Opens the filter panel for editing.' },
        { name: 'label', type: 'string', description: 'Optional summary text; defaults to N active.' },
        { name: 'emptyLabel', type: 'string', description: 'Shown when there are no filters.' },
        { name: 'editLabel', type: 'string', defaultValue: "'Edit filters'", description: 'Edit action label.' },
      ]}
      accessibility={[
        'The wrapper uses aria-live=polite so count changes are announced.',
        'Remove and clear actions come from FilterChips with named controls.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
