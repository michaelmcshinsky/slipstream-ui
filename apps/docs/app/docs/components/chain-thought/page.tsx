import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/chain-thought', {
  title: "ChainThought",
  description: "Show ordered agent work with explicit progress status.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('chain-thought')}
      id="chain-thought"
      title="ChainThought"
      description="Show ordered agent work with explicit progress status."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'steps', type: 'ChainThoughtStep[]', defaultValue: 'required', description: 'Ordered reasoning steps: { id, content, status?: "pending" | "completed" | "failed" }.' },
        { name: 'compact', type: 'boolean', defaultValue: 'false', description: 'Tighter row density for side panels.' },
        { name: 'className', type: 'string', description: 'Extra classes for the root element.' },
      ]}
      accessibility={[
        'Steps render as an ordered list so sequence is structural.',
        'Status is conveyed by text/icons, not color alone.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
