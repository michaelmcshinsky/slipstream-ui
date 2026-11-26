import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

const PROPS_ROWS = [
  { name: 'title', type: 'ReactNode', defaultValue: 'required', description: 'Main headline. Accepts inline markup for a highlighted phrase.' },
  { name: 'description', type: 'ReactNode', description: 'Supporting sentence under the headline.' },
  { name: 'eyebrow', type: 'ReactNode', description: 'Small overline above the headline.' },
  { name: 'badge', type: 'ReactNode', description: 'Pill above the headline.' },
  { name: 'actions', type: 'ReactNode', description: 'Primary and secondary calls to action.' },
  { name: 'media', type: 'ReactNode', description: 'Product shot, illustration, video or form shown beside or behind the copy.' },
  { name: 'mediaPosition', type: "'left' | 'right'", defaultValue: "'right'", description: 'Which side the media sits on at lg and up in the split layout.' },
  { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Copy alignment.' },
  { name: 'size', type: "'md' | 'lg'", defaultValue: "'lg'", description: 'Headline scale.' },
  { name: 'level', type: '1 | 2', defaultValue: '1', description: 'Heading level.' },
  { name: 'variant', type: "'split' | 'centered' | 'stacked' | 'overlay'", description: 'Layout. Defaults to split with media, centered without.' },
  { name: 'as', type: "'div' | 'section' | 'header'", defaultValue: "'div'", description: 'Semantic element to render.' },
  { name: 'titleClassName', type: 'string', description: 'Extra classes for the headline.' },
  { name: 'descriptionClassName', type: 'string', description: 'Extra classes for the description.' },
  { name: 'eyebrowClassName', type: 'string', description: 'Extra classes for the eyebrow.' },
  { name: 'badgeClassName', type: 'string', description: 'Extra classes for the badge wrapper.' },
  { name: 'mediaClassName', type: 'string', description: 'Extra classes for the media wrapper.' },
];

export const metadata: Metadata = withSeo('/docs/components/hero', {
  title: 'Hero',
  description:
    'Responsive marketing hero with split, centered, stacked and overlay layouts, plus badge, eyebrow, actions and a media slot.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('hero')}
      id="hero"
      title="Hero"
      description="Responsive marketing hero with four layouts, a badge/eyebrow, headline, copy, actions and an optional media slot."
      npmPackages="@slipstream-ui/core"
      propsRows={PROPS_ROWS}
      accessibility={[
        'Renders h1 by default; use level={2} for a second hero-like band.',
        'Media is a slot, so the consumer owns alt text and decorative treatment.',
        'Overlay copy and its scrim invert with the theme, keeping text readable without hardcoded colors.',
        'Every layout stacks at mobile widths and only splits at lg where there is room.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
