import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/segmented-control', {
  title: 'SegmentedControl',
  description: 'Single- or multi-select segmented control for view and filter switches.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('segmented-control')}
      id="segmented-control"
      title="SegmentedControl"
      description="Single- or multi-select segmented control for view and filter switches."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'options', type: 'SegmentedOption[]', defaultValue: 'required', description: 'Segments to render: value, label, optional icon, hint, disabled, and href for link rendering.' },
        { name: 'value', type: 'string | string[]', description: 'Controlled selection. Use string[] when multiple.' },
        { name: 'defaultValue', type: 'string | string[]', description: 'Initial selection when uncontrolled.' },
        { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Fires with the next selection.' },
        { name: 'multiple', type: 'boolean', defaultValue: 'false', description: 'Allow more than one segment to be active.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Control density.' },
        { name: 'fullWidth', type: "boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", defaultValue: 'false', description: 'Stretch segments to fill the container width; a breakpoint string fills only below that breakpoint.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers; used by options that set href.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop used to pass the destination to linkComponent.' },
      ]}
      accessibility={[
        'Single-select uses role=radiogroup/radio with aria-checked and arrow-key navigation.',
        'Multiple uses role=group with aria-pressed on each segment.',
        'Options with href render links; the active segment is a non-link aria-current="page" marker.',
        'Pass aria-label or aria-labelledby; the default name is generic.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
