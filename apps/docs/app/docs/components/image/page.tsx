import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/image', {
  title: 'Image',
  description:
    'Resilient image with a two-step fallback chain, intrinsic dimensions and an LCP priority flag.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('image')}
      id="image"
      title="Image"
      description="Resilient image with a two-step fallback chain, intrinsic dimensions and an LCP priority flag."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'src', type: 'string', description: 'Primary image URL. Hotlinked sources are expected.' },
        { name: 'alt', type: 'string', description: 'Required: describes the image content, not the component.' },
        {
          name: 'fallbackSrc',
          type: 'string',
          description: 'Second URL tried before the fallback node, such as generated placeholder art.',
        },
        {
          name: 'fallback',
          type: 'React.ReactNode',
          description: 'Content rendered when every URL has failed (icon, initials, empty panel).',
        },
        {
          name: 'priority',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Load eagerly and fetch at high priority for the one above-the-fold image.',
        },
        {
          name: 'width',
          type: 'number',
          defaultValue: '1200',
          description: 'Intrinsic width, always emitted so the browser reserves space.',
        },
        {
          name: 'height',
          type: 'number',
          defaultValue: '630',
          description: 'Intrinsic height, always emitted so the browser reserves space.',
        },
        { name: 'className', type: 'string', description: 'Classes for the image.' },
        { name: 'imgClassName', type: 'string', description: 'Extra classes merged after className.' },
        { name: 'style', type: 'React.CSSProperties', description: 'Inline styles for the image.' },
      ]}
      accessibility={[
        'alt is required by the type; describe the image, not the component.',
        'Intrinsic width and height are always emitted, so a failed or slow image never shifts the layout.',
        'Only the priority image loads eagerly; every other image is lazy and decodes asynchronously.',
        'Fallback content should carry the same information as the image, not a second description.',
        'Set alt="" on a decorative image whose fallback already shows the message.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
