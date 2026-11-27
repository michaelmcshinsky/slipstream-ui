import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/article-card', {
  title: 'ArticleCard',
  description: 'Linked article or resource card with media, eyebrow, title, summary and metadata.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('article-card')}
      id="article-card"
      title="ArticleCard"
      description="Linked article or resource card with media, eyebrow, title, summary and metadata."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Article title.' },
        { name: 'description', type: 'string', description: 'Summary copy.' },
        { name: 'href', type: 'string', defaultValue: 'required', description: 'Destination URL.' },
        { name: 'eyebrow', type: 'string', description: 'Category or content type.' },
        { name: 'media', type: 'ReactNode', description: 'Image, illustration or video poster.' },
        { name: 'meta', type: 'ReactNode', description: 'Date, read time, author or other metadata.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop name used to pass the destination to linkComponent.' },
        { name: 'variant', type: "'default' | 'compact'", defaultValue: "'default'", description: 'Standard or compact card.' },
      ]}
      accessibility={[
        'The whole card is one link; do not nest buttons or links inside it.',
        'Use alt="" for decorative covers or a meaningful alt for informative images.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
