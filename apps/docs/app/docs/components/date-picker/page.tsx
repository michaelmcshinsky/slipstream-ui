import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/date-picker', {
  title: 'DatePicker',
  description: 'Native date field with an ISO-string contract and an optional clear button.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('date-picker')}
      id="date-picker"
      title="DatePicker"
      description="Native date field with an ISO-string contract, min/max passthrough and an optional clear button."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'ISO date (YYYY-MM-DD), controlled.' },
        { name: 'defaultValue', type: 'string', description: 'ISO date, initial value.' },
        { name: 'onValueChange', type: '(value: string) => void', description: "Fired with the ISO string; '' when cleared." },
        { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows a clear button once a value exists.' },
        { name: 'clearLabel', type: 'string', defaultValue: "'Clear date'", description: 'Accessible label for the clear button.' },
        { name: '…InputProps', type: 'InputProps', description: 'min, max, name, required, disabled, onChange all pass through.' },
      ]}
      accessibility={['Renders input[type=date] so OS pickers, keyboard editing and locale formatting apply.', 'Always label the field (FormField or aria-label).']}
    >
      <Demo />
    </ComponentPage>
  );
}
