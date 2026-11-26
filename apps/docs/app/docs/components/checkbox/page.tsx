import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/checkbox', {
  title: "Checkbox",
  description: "Native checkbox input styled to match the design system, with controlled and uncontrolled support.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('checkbox')}
      id="checkbox"
      title="Checkbox"
      description="Native checkbox input styled to match the design system, with controlled and uncontrolled support."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'checked', type: 'boolean', description: 'Controlled checked state; omit for uncontrolled usage.' },
        { name: 'defaultChecked', type: 'boolean', defaultValue: 'false', description: 'Initial checked state when uncontrolled.' },
        { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Fired when the user toggles the checkbox.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the checkbox.' },
        { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Marks the checkbox as required for form validation.' },
        { name: 'name / value', type: 'string', description: 'Form participation when submitted natively (name + value pair).' },
      ]}
      accessibility={[
        'Native input semantics: keyboard, form, and screen-reader behavior is identical to platform checkboxes.',
        'Provide an accessible name via an associated <Label> or aria-label.',
        'Disabled state is announced natively; keep a visible label so the state is readable.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
