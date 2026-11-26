import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/branch', {
  title: "Branch",
  description: "Variant navigation for branched messages: ‹ N / M › controls that let users compare alternative AI responses. Purely presentational: you swap the content.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('branch')}
      id="branch"
      title="Branch"
      description="Variant navigation for branched messages: ‹ N / M › controls that let users compare alternative AI responses. Purely presentational: you swap the content."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'count', type: 'number', description: 'Total variants; renders nothing below 2.' },
        { name: 'selected', type: 'number', description: 'Controlled zero-based index.' },
        { name: 'defaultSelected', type: 'number', defaultValue: '0', description: 'Uncontrolled initial index.' },
        { name: 'onSelect', type: '(index: number) => void', description: 'Called with the chosen variant index.' },
        { name: 'labels', type: 'object', description: 'Overrides for previous/next aria-labels.' },
      ]}
      accessibility={[
        'Arrows disable at the ends instead of wrapping silently.',
        'Position indicator uses aria-live=polite.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
