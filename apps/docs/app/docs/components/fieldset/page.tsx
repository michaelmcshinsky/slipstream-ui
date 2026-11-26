import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/fieldset', {
  title: 'Fieldset',
  description:
    'Groups related form controls in a native fieldset with a legend, optional description, and an error slot.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('fieldset')}
      id="fieldset"
      title="Fieldset"
      description="Groups related form controls in a native fieldset with a legend, optional description, and an error slot."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'legend', type: 'string', description: "Legend rendered as the group's accessible name." },
        { name: 'description', type: 'string', description: 'Muted supporting line under the legend.' },
        { name: 'error', type: 'string', description: 'Group-level error rendered under the controls (role=alert).' },
        { name: 'children', type: 'ReactNode', description: 'The controls this group names.' },
      ]}
      accessibility={[
        'Native <fieldset>/<legend>: the legend is announced as the group name before each control.',
        'The error slot renders with role=alert so group errors are announced when they appear.',
        'Always pass a legend (or an equivalent aria-label).',
      ]}
      browserNotes={[
        'Pure native fieldset/legend semantics: supported in every browser; only the styling is Tailwind.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
