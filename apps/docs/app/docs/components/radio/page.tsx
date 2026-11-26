import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/radio', {
  title: "Radio",
  description: "Native radio buttons grouped for mutually exclusive choices.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('radio')}
      id="radio"
      title="Radio"
      description="Native radio buttons grouped for mutually exclusive choices, with an accessible fieldset/legend."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'name', type: 'string', description: 'Shared group name (RadioGroup).' },
        { name: 'value / defaultValue', type: 'string', description: 'Controlled or initial selection (RadioGroup).' },
        { name: 'onValueChange', type: '(value: string) => void', description: 'Called with the newly selected value (RadioGroup).' },
        { name: 'legend', type: 'string', description: 'Accessible group label rendered as the fieldset legend.' },
        { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: 'Stack options or lay them out in a wrapping row (RadioGroup).' },
        { name: 'error', type: 'string', description: 'Group-level validation message; announced via role=alert (RadioGroup).' },
        { name: 'value', type: 'string', description: 'The value this item contributes to the group (RadioGroupItem).' },
        { name: 'label', type: 'string', description: 'Visible label rendered next to the radio (RadioGroupItem).' },
        { name: 'title', type: 'string', description: 'Section heading (RadioCard).' },
        { name: 'description', type: 'string', description: 'Supporting line under the title (RadioCard).' },
        { name: 'rounded', type: 'boolean', defaultValue: 'true', description: 'Outer border radius on the section; false gives square corners (RadioCard).' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables an individual item.' },
      ]}
      accessibility={[
        'RadioGroup renders a fieldset with a legend so the group name is announced.',
        'Native arrow-key navigation within the group; only the selected radio is tabbable.',
        'Disabled items are announced natively and skipped by arrow keys.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
