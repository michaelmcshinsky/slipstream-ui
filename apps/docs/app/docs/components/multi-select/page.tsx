import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/multi-select', {
  title: 'MultiSelect',
  description: 'Searchable multi-select filter with visible removable chips and a checkbox panel.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('multi-select')}
      id="multi-select"
      title="MultiSelect"
      description="Searchable multi-select filter with visible removable chips and a checkbox panel."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'options', type: 'MultiSelectOption[]', defaultValue: 'required', description: 'Options: value, label, optional description, group and disabled.' },
        { name: 'value', type: 'string[]', description: 'Controlled selected values.' },
        { name: 'defaultValue', type: 'string[]', description: 'Initial selected values when uncontrolled.' },
        { name: 'onValueChange', type: '(values: string[]) => void', description: 'Fires with the full selection.' },
        { name: 'label', type: 'string', description: 'Visible field label; also names the trigger.' },
        { name: 'triggerLabel', type: 'string', defaultValue: "'Add'", description: 'Trigger text when nothing is selected.' },
        { name: 'searchPlaceholder', type: 'string', defaultValue: "'Search options'", description: 'Search placeholder and accessible name.' },
        { name: 'emptyText', type: 'string', defaultValue: "'No options'", description: 'Shown when no option matches.' },
        { name: 'maxDisplay', type: 'number', defaultValue: '3', description: 'Maximum chips before a +N more summary.' },
        { name: 'disabled', type: 'boolean', description: 'Disable the trigger and chip removal.' },
      ]}
      accessibility={[
        'The trigger is named by the visible label and exposes aria-haspopup/aria-expanded.',
        'Options are native checkboxes with wrapping labels; each chip has a named remove button.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
