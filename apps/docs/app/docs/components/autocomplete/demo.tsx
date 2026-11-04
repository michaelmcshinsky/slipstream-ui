'use client';

import { useState } from 'react';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Autocomplete, FormField } from '@slipstream-ui/core';

const FRAMEWORKS = ['react', 'remix', 'next', 'vite', 'astro', 'sveltekit'];
const TAGS = ['design-systems', 'streaming', 'accessibility', 'mcp', 'rag'];

export default function AutocompletePage() {
  const [framework, setFramework] = useState('');
  const [tag, setTag] = useState('streaming');

  return (
    <ComponentPage
      id="autocomplete"
      title="Autocomplete"
      description="Type-ahead input following the HTML autocomplete model: any value is allowed while matching suggestions appear in a keyboard-navigable listbox."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'suggestions', type: 'string[]', defaultValue: 'required', description: 'Suggestion labels offered while typing; free-form values stay allowed.' },
        { name: 'value', type: 'string', description: 'Current text — standard controlled-input contract (wire onValueChange).' },
        { name: 'defaultValue', type: 'string', defaultValue: "''", description: 'Initial text when uncontrolled.' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Fires on every keystroke AND on suggestion selection.' },
        { name: 'emptyText', type: 'string', defaultValue: "'No suggestions'", description: 'Shown when no suggestion matches.' },
        { name: 'autoComplete', type: 'string', description: 'Native autofill hint — passes through to the input alongside the custom list.' },
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
      <DemoCard
        title="Controlled"
        preview={
          <div className="w-full max-w-sm space-y-4">
            <FormField id="ac-framework" label="Primary framework" hint="Type anything — free text is valid">
              <Autocomplete
                suggestions={FRAMEWORKS}
                value={framework}
                onValueChange={setFramework}
                placeholder="re…"
                name="framework"
              />
            </FormField>
            <p className="text-xs text-muted-foreground">
              Current value:{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">{framework || 'empty'}</code>
            </p>
          </div>
        }
        code={`import { Autocomplete, FormField } from '@slipstream-ui/core';

const [framework, setFramework] = useState('');

<FormField id="framework" label="Primary framework" hint="Type anything — free text is valid">
  <Autocomplete
    suggestions={['react', 'remix', 'next', 'vite', 'astro']}
    value={framework}
    onValueChange={setFramework}
    name="framework"
    autoComplete="off"
  />
</FormField>`}
        usage={`import { Autocomplete } from '@slipstream-ui/core';

// Native autofill hints alongside the custom list
<Autocomplete
  name="country"
  autoComplete="country-name"
  suggestions={countryNames}
  onValueChange={setCountry}
/>`}
        types={`type AutocompleteProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  suggestions: string[];
  emptyText?: string;
};`}
      />

      <DemoCard
        title="Tags (uncontrolled)"
        preview={
          <div className="w-full max-w-sm space-y-4">
            <FormField id="ac-tag" label="Tag" hint="Suggestions help, custom tags are fine" labelHidden={false}>
              <Autocomplete suggestions={TAGS} defaultValue={tag} onValueChange={setTag} name="tag" />
            </FormField>
            <p className="text-xs text-muted-foreground">
              Current value:{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">{tag || 'empty'}</code>
            </p>
          </div>
        }
        code={`{/* Uncontrolled: defaultValue + onValueChange mirrors native inputs */}
<Autocomplete
  suggestions={['design-systems', 'streaming', 'accessibility', 'mcp']}
  defaultValue="streaming"
  onValueChange={setTag}
  name="tag"
/>`}
      />
      <DemoCard
        title="Async, grouped and clearable"
        preview={
          <div className="w-full max-w-md">
            <Autocomplete
              aria-label="Search cities"
              clearable
              placeholder="Search cities…"
              debounceMs={150}
              loadOptions={async (query) =>
                ['Amsterdam', 'Austin', 'Barcelona', 'Berlin', 'Boston', 'Bristol']
                  .filter((city) => city.toLowerCase().includes(query.trim().toLowerCase()))
                  .map((city) => ({ value: city, label: city, group: 'Cities', description: 'Demo result' }))
              }
            />
          </div>
        }
        code={`<Autocomplete
  aria-label="Search cities"
  clearable
  placeholder="Search cities…"
  loadOptions={async (query) =>
    cities
      .filter((city) => city.toLowerCase().includes(query.toLowerCase()))
      .map((city) => ({ value: city, label: city, group: 'Cities' }))
  }
/>`}
        usage={`// loadOptions is debounced (200ms default) and stale responses are
// discarded. Group headings come from option.group; descriptions render
// as a muted second line, or supply renderOption for full control.`}
        types={`type AutocompleteOption = {
  value: string;
  label?: string;
  group?: string;
  description?: string;
};

type AutocompleteProps = {
  options?: Array<string | AutocompleteOption>;
  loadOptions?: (query: string) => Promise<Array<string | AutocompleteOption>>;
  renderOption?: (option, state: { active: boolean }) => ReactNode;
  clearable?: boolean;
  emptyText?: string;
  loadingText?: string;
  debounceMs?: number;
};`}
      />
    </ComponentPage>
  );
}
