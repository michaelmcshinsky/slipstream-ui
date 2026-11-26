import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/select', {
  title: "Select",
  description: "Accessible select primitive built on the native select element with controlled and uncontrolled modes.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('select')}
      id="select"
      title="Select"
      description="Accessible select primitive built on the native select element with controlled and uncontrolled modes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'options', type: 'SelectOption[]', defaultValue: 'required', description: '{ value, label, disabled? } entries' },
        { name: 'label', type: 'string', defaultValue: '-', description: 'Visible, associated label' },
        { name: 'labelHidden', type: 'boolean', defaultValue: 'false', description: 'Keep the label for screen readers but hide it visually (filter bars, toolbars)' },
        { name: 'value', type: 'string', defaultValue: '—', description: 'Controlled selected value' },
        { name: 'defaultValue', type: 'string', defaultValue: '—', description: 'Uncontrolled initial value' },
        { name: 'onChange', type: 'React.ChangeEventHandler<HTMLSelectElement>', defaultValue: '-', description: 'Native change event; compatible with react-hook-form register()' },
        { name: 'onValueChange', type: '(value: string | string[]) => void', defaultValue: '-', description: 'Value-based callback for controlled usage' },
        { name: 'groups', type: 'SelectOptionGroup[]', description: '{ label, options }[] optgroups; takes precedence over options and children' },
        { name: 'placeholder', type: 'string', description: 'Renders a disabled empty option — the native "choose one" affordance' },
        { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Native multi-select; value/onChange switch to string[]' },
        { name: 'size', type: 'number', description: 'Native size attribute — visible row count for multi-select' },
        { name: 'children', type: 'ReactNode', description: 'Plain <option>/<optgroup> for dynamic lists; lowest precedence after options/groups' },
      ]}
      accessibility={[
        'Built on the native select: full keyboard, screen-reader and mobile support',
        'Visible labels are associated via htmlFor/id; aria-label is forwarded otherwise',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
