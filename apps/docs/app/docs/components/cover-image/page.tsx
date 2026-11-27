import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/cover-image', {
  title: 'CoverImage',
  description:
    'Fixed-aspect media cover with a deterministic seed-derived gradient placeholder for entities without art.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('cover-image')}
      id="cover-image"
      title="CoverImage"
      description="Fixed-aspect media cover with a deterministic seed-derived gradient placeholder for entities without art."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'src', type: 'string | null', description: 'Cover URL; the seeded fallback renders when absent or broken.' },
        { name: 'alt', type: 'string', description: 'Required: describes the image content.' },
        { name: 'aspect', type: "'video' | 'square' | 'wide' | string", defaultValue: "'video'", description: 'Aspect ratio preset or any CSS aspect-ratio value.' },
        { name: 'seed', type: 'string', description: 'Stable key selecting the fallback gradient (e.g. entity slug).' },
        { name: 'priority', type: 'boolean', defaultValue: 'false', description: 'Load eagerly and fetch at high priority for the LCP image.' },
        { name: 'sizes', type: 'string', description: 'Responsive sizes hint forwarded to the image.' },
        { name: 'fallback', type: 'React.ReactNode', description: 'Custom fallback content; defaults to the seeded gradient.' },
        { name: 'mark', type: 'React.ReactNode', description: 'Optional mark centered on the default gradient.' },
        { name: 'className', type: 'string', description: 'Classes merged onto the aspect-ratio container.' },
      ]}
      accessibility={[
        'Renders a real img with alt when src is present; the gradient fallback is aria-hidden decoration.',
        'The aspect-ratio box reserves space before the image loads, so grids never shift.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
