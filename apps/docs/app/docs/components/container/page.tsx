import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/container', {
  title: 'Container',
  description: 'Centered, width-constrained page container with shared gutters and four width presets.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('container')}
      id="container"
      title="Container"
      description="Centered, width-constrained page container with shared gutters and four width presets."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'width', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", defaultValue: "'lg'", description: 'Maximum content width.' },
        { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Horizontal gutters.' },
        { name: 'as', type: "'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav'", defaultValue: "'div'", description: 'Semantic element to render.' },
      ]}
      accessibility={['Use the as prop for landmarks and add an accessible name when the container is a named region.']}
    >
      <Demo />
    </ComponentPage>
  );
}
