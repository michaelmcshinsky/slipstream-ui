import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/feature-row', {
  title: 'FeatureRow',
  description: 'Alternating media and copy row for mid-page feature sections.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('feature-row')}
      id="feature-row"
      title="FeatureRow"
      description="Alternating media and copy row for mid-page feature sections."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'ReactNode', defaultValue: 'required', description: 'Row heading.' },
        { name: 'description', type: 'ReactNode', description: 'Supporting copy.' },
        { name: 'eyebrow', type: 'ReactNode', description: 'Small overline above the heading.' },
        { name: 'actions', type: 'ReactNode', description: 'Calls to action.' },
        { name: 'media', type: 'ReactNode', defaultValue: 'required', description: 'Image, mockup, video or form beside the copy.' },
        { name: 'mediaPosition', type: "'left' | 'right'", defaultValue: "'right'", description: 'Media side at lg and up.' },
        { name: 'level', type: '2 | 3', defaultValue: '2', description: 'Heading level.' },
        { name: 'size', type: "'md' | 'lg'", defaultValue: "'md'", description: 'Heading scale.' },
      ]}
      accessibility={[
        'Defaults to h2; use level={3} for a nested subsection.',
        'Media is a slot so the consumer owns alt text.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
