import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/skeleton', {
  title: "Skeleton",
  description: "Loading placeholder that mirrors the shape of upcoming content.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('skeleton')}
      id="skeleton"
      title="Skeleton"
      description="Loading placeholder that mirrors the shape of upcoming content: sized via props, not ad-hoc classes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'height', type: 'string', description: "Tailwind height class (e.g. 'h-4') applied to the block." },
        { name: 'width', type: 'string', defaultValue: "'w-full'", description: "Tailwind width class (e.g. 'w-48') applied to the block." },
        { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", defaultValue: "'md'", description: 'Corner preset: use full for avatars/dots, none for tables.' },
        { name: 'label', type: 'string', description: 'Loading announcement: the block becomes role="status" with an sr-only label instead of aria-hidden decorative.' },
        { name: 'className', type: 'string', description: 'Escape hatch for anything the props do not cover.' },
      ]}
      accessibility={[
        'Unlabeled blocks are aria-hidden so screen readers skip placeholder shapes.',
        'Pass label on one representative block (or wrap a composite layout in role="status") to announce "Loading…" once for the whole region.',
        'Match skeleton geometry to the real content to avoid layout shift when data arrives.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
