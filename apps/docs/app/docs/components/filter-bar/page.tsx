import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/filter-bar', {
  title: 'FilterBar',
  description:
    'List-page filter strip: search field, filter controls, reset affordance and trailing actions.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('filter-bar')}
      id="filter-bar"
      title="FilterBar"
      description="List-page filter strip: search field, filter controls, reset affordance and trailing actions."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'searchValue', type: 'string', description: 'Controlled search text.' },
        { name: 'onSearchChange', type: '(value: string) => void', description: 'Fires on each keystroke; hides the search box when omitted.' },
        { name: 'searchPlaceholder', type: 'string', defaultValue: "'Search…'", description: 'Search placeholder (also its accessible name).' },
        { name: 'onReset', type: '() => void', description: 'Shows a reset button when provided.' },
        { name: 'activeCount', type: 'number', defaultValue: '0', description: 'Active filter count appended to the reset and filter labels.' },
        { name: 'onOpenFilters', type: '() => void', description: 'Shows a Filters button and opens a filter panel or drawer.' },
        { name: 'filtersLabel', type: 'string', defaultValue: "'Filters'", description: 'Filter button label.' },
        { name: 'resultsCount', type: 'number', description: 'Result count shown before the trailing slot.' },
        { name: 'resultsLabel', type: 'string', defaultValue: "'results'", description: 'Noun for the result count.' },
        { name: 'trailing', type: 'ReactNode', description: 'Far-right actions (bulk actions, column settings).' },
      ]}
      accessibility={['role=search wraps the controls; the search input is labelled by its placeholder.', 'Reset is a normal button with an updated accessible name.']}
    >
      <Demo />
    </ComponentPage>
  );
}
