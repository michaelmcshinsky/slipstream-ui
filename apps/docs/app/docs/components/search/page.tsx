import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/search', {
  title: 'Search',
  description:
    'Select-with-search: type to filter a full-width dropdown of options, or arrow through the full set from an empty query.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('search')}
      id="search"
      title="Search"
      description="Select-with-search: type to filter a full-width dropdown of options, or arrow through the full set from an empty query."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'options', type: 'SearchOption[]', defaultValue: 'required', description: 'The full option set; filtered client-side as the user types.' },
        { name: 'value', type: 'string | null', description: 'Controlled selected value; null clears the selection.' },
        { name: 'defaultValue', type: 'string', description: 'Initially selected option value (display starts on its label).' },
        { name: 'onValueChange', type: '(value: string) => void', description: "Called with the selected option's value." },
        { name: 'placeholder', type: 'string', defaultValue: "'Search…'", description: 'Input placeholder while no query is typed.' },
        { name: 'emptyText', type: 'string', defaultValue: "'No matching results'", description: 'Shown when no option matches the query.' },
        { name: 'listLabel', type: 'string', defaultValue: "'Search results'", description: 'Accessible label for the results listbox.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input and the dropdown.' },
      ]}
      accessibility={[
        'Combobox pattern: aria-expanded/aria-controls/aria-activedescendant on the input.',
        'Keyboard: ArrowDown opens and moves, Home/End jump, Enter selects, Escape closes.',
        'Option clicks keep focus in the input: typing continues immediately.',
        'The listbox portals with fixed positioning, so scrollable parents never clip it.',
      ]}
      browserNotes={[
        'Fixed-position portalled listbox requires JavaScript; supported in every tested browser.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
