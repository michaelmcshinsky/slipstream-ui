import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/page-header', {
  title: 'PageHeader',
  description:
    'Standard page heading: breadcrumbs, level-1 title, description, action cluster and a sub-row slot.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('page-header')}
      id="page-header"
      title="PageHeader"
      description="Standard page heading with breadcrumbs, h1, description and actions, plus a router-agnostic documentHead helper for title, description, canonical and robots."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Page heading rendered as h1.' },
        { name: 'description', type: 'ReactNode', description: 'Supporting summary under the title; accepts links and inline markup.' },
        { name: 'subtitle', type: 'ReactNode', description: 'Alias for description (migration-friendly).' },
        { name: 'breadcrumbs', type: 'ReactNode', description: 'Trail rendered above the title.' },
        { name: 'actions', type: 'ReactNode', description: 'Right-aligned actions (buttons, menus).' },
        { name: 'children', type: 'ReactNode', description: 'Sub-row under the title (tabs, filters).' },
        { name: 'eyebrow', type: 'ReactNode', description: 'Kicker/overline above the title.' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'hero'", defaultValue: "'md'", description: 'Heading scale; hero is for marketing landings.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Text and action alignment.' },
        { name: 'titleClassName', type: 'string', description: 'Extra classes for the h1.' },
        { name: 'descriptionClassName', type: 'string', description: 'Extra classes for the description.' },
        { name: 'eyebrowClassName', type: 'string', description: 'Extra classes for the eyebrow.' },
      ]}
      accessibility={['Renders exactly one h1 per page.', 'Use Heading level={2} for section headings below the header.']}
    >
      <Demo />
    </ComponentPage>
  );
}
