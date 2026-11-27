import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/media-card', {
  title: 'MediaCard',
  description:
    'Media card for event, article and listing grids: CoverImage cover, title, description, metadata, status chips and a whole-card link.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('media-card')}
      id="media-card"
      title="MediaCard"
      description="Media card for event, article and listing grids: CoverImage cover, title, description, metadata, status chips and a whole-card link."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', description: 'Card title.' },
        { name: 'description', type: 'React.ReactNode', description: 'Supporting copy under the title.' },
        { name: 'href', type: 'string', description: 'Destination URL; the whole card becomes a single link when set.' },
        { name: 'cover', type: 'CoverImageProps', description: 'Cover art rendered through CoverImage (src, alt, aspect, seed, mark, priority, sizes).' },
        { name: 'meta', type: 'React.ReactNode', description: 'Metadata line under the description, e.g. date, venue or deadline.' },
        { name: 'chips', type: 'MediaCardChip[]', description: 'Status or category chips rendered as Badges (label, variant, dot).' },
        { name: 'footer', type: 'React.ReactNode', description: 'Bottom slot for a details affordance; keep it non-interactive when the card is a link.' },
        { name: 'layout', type: "'vertical' | 'row'", defaultValue: "'vertical'", description: "'vertical' stacks cover over content; 'row' puts a fixed-width cover beside it." },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers (Next Link, react-router).' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop name used to pass the destination to linkComponent.' },
        { name: 'className', type: 'string', description: 'Classes merged onto the card surface.' },
      ]}
      accessibility={[
        'With href the entire card is one anchor with a visible focus ring; without href it is a static article.',
        'Keep footer free of nested interactive elements when href is set.',
        'CoverImage renders a real img with alt when src is present; the gradient fallback is aria-hidden.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
