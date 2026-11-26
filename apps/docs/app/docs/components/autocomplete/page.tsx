import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/autocomplete', {
  title: 'Autocomplete',
  description:
    'Type-ahead input following the HTML autocomplete model: any value is allowed while matching suggestions appear in a keyboard-navigable listbox.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('autocomplete')}
      id="autocomplete"
      title="Autocomplete"
      description="Type-ahead input following the HTML autocomplete model: any value is allowed while matching suggestions appear in a keyboard-navigable listbox."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'options', type: 'Array<string | AutocompleteOption>', description: 'Static suggestions offered while typing; free-form values stay allowed.' },
        { name: 'suggestions', type: 'string[]', description: 'Deprecated — use options.' },
        { name: 'loadOptions', type: '(query: string) => Promise<Array<string | AutocompleteOption>>', description: 'Async suggestion source; responses are debounced and stale ones discarded.' },
        { name: 'renderOption', type: '(option, { active }) => ReactNode', description: 'Custom option row renderer.' },
        { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Show a clear button when the input has a value.' },
        { name: 'debounceMs', type: 'number', defaultValue: '200', description: 'Debounce for loadOptions.' },
        { name: 'suggestionsLabel', type: 'string', defaultValue: "'Suggestions'", description: 'Accessible label for the suggestion listbox.' },
        { name: 'loadingText', type: 'string', description: 'Shown while async options load.' },
        { name: 'value', type: 'string', description: 'Current text: standard controlled-input contract (wire onValueChange).' },
        { name: 'defaultValue', type: 'string', defaultValue: "''", description: 'Initial text when uncontrolled.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Fires on every keystroke AND on suggestion selection.' },
        { name: 'emptyText', type: 'string', defaultValue: "'No suggestions'", description: 'Shown when no suggestion matches.' },
        { name: 'autoComplete', type: 'string', description: 'Native autofill hint: passes through to the input alongside the custom list.' },
      ]}
      accessibility={[
        'Combobox pattern with aria-activedescendant; suggestions are role=option with aria-selected.',
        'Arrow keys highlight, Enter accepts the highlighted suggestion, Escape closes; unhighlighted Enter submits the form natively.',
        'Native autoComplete attribute passthrough keeps browser autofill working.',
      ]}
      browserNotes={[
        'Fixed-position portalled suggestion list requires JavaScript; supported in every tested browser.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
