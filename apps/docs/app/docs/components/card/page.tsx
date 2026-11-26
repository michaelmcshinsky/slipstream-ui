import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/card', {
  title: "Card",
  description: "Content container with header, body, and footer sections.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('card')}
      id="card"
      title="Card"
      description="Content container with header, body, and footer sections: bordered, borderless, or compact via className."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'children', type: 'ReactNode', description: 'Card sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Render the child element (router Link, <a>) with card styling instead of a div.' },
        { name: 'className', type: 'string', description: 'Variants: borderless (border-0 shadow-sm), compact (p-4), raised (shadow-md), etc.' },
        { name: 'CardHeader / CardContent / CardFooter className', type: 'string', description: 'Per-section spacing overrides for compact or custom layouts.' },
      ]}
      accessibility={[
        'CardTitle renders as h3; maintain logical heading order in your page.',
        'Cards are generic containers: give interactive content inside them real labels and roles.',
        'Do not nest landmark roles (header/footer inside cards stay neutral divs).',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
