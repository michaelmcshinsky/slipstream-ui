import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/select-menu', {
  title: 'SelectMenu',
  description: 'Custom listbox select for rich options: descriptions, icons, groups and multi-select.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('select-menu')}
      id="select-menu"
      title="SelectMenu"
      description="Custom listbox select for rich options: descriptions, icons, groups, multi-select, custom rows and hidden inputs for forms."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'SelectMenuItem[]', defaultValue: 'required', description: 'Options: { value, label, description?, icon?, disabled?, group? }.' },
        { name: 'value / defaultValue', type: 'string | string[]', description: 'Controlled or initial selection; string[] when multiple.' },
        { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Fired with the new selection.' },
        { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allow several selections; the listbox stays open.' },
        { name: 'placeholder', type: 'string', defaultValue: "'Select…'", description: 'Shown when nothing is selected.' },
        { name: 'name', type: 'string', description: 'Renders hidden inputs so the selection submits with a form.' },
        { name: 'renderValue / renderItem', type: 'function', description: 'Custom trigger content and option rows.' },
        { name: 'emptyText', type: 'string', defaultValue: "'No options'", description: 'Message shown in the listbox when items is empty.' },
        { name: 'className', type: 'string', description: 'Escape hatch for the trigger button (inherited button attributes apply too).' },
      ]}
      accessibility={[
        'Select-only combobox + listbox pattern: aria-haspopup, aria-expanded, aria-activedescendant, aria-selected.',
        'Arrows move, Home/End jump, Enter/Space select, Escape closes; first-letter typeahead.',
        'Disabled options expose aria-disabled and are skipped by keyboard movement.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
