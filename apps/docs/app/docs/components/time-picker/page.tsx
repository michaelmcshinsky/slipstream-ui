import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/time-picker', {
  title: 'TimePicker',
  description: 'Native time field with an HH:MM contract and an optional clear button.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('time-picker')}
      id="time-picker"
      title="TimePicker"
      description="Native time field with an HH:MM contract and an optional clear button."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: '"HH:MM" (24h), controlled.' },
        { name: 'defaultValue', type: 'string', description: '"HH:MM", initial value.' },
        { name: 'onValueChange', type: '(value: string) => void', description: "Fired with the time string; '' when cleared." },
        { name: 'clearable', type: 'boolean', defaultValue: 'false', description: 'Shows a clear button once a value exists.' },
        { name: 'clearLabel', type: 'string', defaultValue: "'Clear time'", description: 'Accessible label for the clear button.' },
      ]}
      accessibility={['Renders input[type=time]; the OS picker and keyboard editing apply.', 'Label the moment, not the control type.']}
    >
      <Demo />
    </ComponentPage>
  );
}
