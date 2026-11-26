import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/input-group', {
  title: 'InputGroup',
  description:
    'Composite input shell with flush left/right addons (icons, units, buttons) behind one outer outline; the nested field sheds its own border.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('input-group')}
      id="input-group"
      title="InputGroup"
      description="Composite input shell with flush left/right addons (icons, units, buttons) behind one outer outline; the nested field sheds its own border so the group reads as a single control."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'side', type: "'left' | 'right'", defaultValue: "'left'", description: 'Edge the addon hugs (flush against the group outline).' },
        { name: 'variant', type: "'ghost' | 'muted'", defaultValue: "'ghost'", description: 'Addon surface: ghost keeps the group background, muted paints a light gray.' },
        { name: 'children', type: 'ReactNode', description: 'Nested field (Input/Textarea/Select) plus any InputGroupAddon slots.' },
      ]}
      accessibility={[
        'The group is focusable chrome only: the nested input keeps focus, its label association, and keyboard behavior.',
        'Mark decorative addons aria-hidden; include meaningful units in the field’s accessible name (aria-label="Amount in PLN").',
        'Disable addon buttons yourself when the field is disabled.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
