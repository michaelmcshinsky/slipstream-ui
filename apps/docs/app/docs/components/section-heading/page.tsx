import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/section-heading', {
  title: 'SectionHeading',
  description: 'Section heading block: eyebrow, title (level 2–4), description and actions.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('section-heading')}
      id="section-heading"
      title="SectionHeading"
      description="Section heading block: eyebrow, title (level 2–4), description and actions, with left/center alignment and three sizes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Section title.' },
        { name: 'description', type: 'ReactNode', description: 'Supporting copy; accepts links and inline markup.' },
        { name: 'eyebrow', type: 'ReactNode', description: 'Kicker above the title.' },
        { name: 'actions', type: 'ReactNode', description: 'Right-aligned actions.' },
        { name: 'level', type: '2 | 3 | 4', defaultValue: '2', description: 'Heading level rendered for the title.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Text and action alignment.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Title scale.' },
        { name: 'titleClassName', type: 'string', description: 'Extra classes for the title.' },
        { name: 'descriptionClassName', type: 'string', description: 'Extra classes for the description.' },
        { name: 'eyebrowClassName', type: 'string', description: 'Extra classes for the eyebrow.' },
      ]}
      accessibility={['Renders h2 by default (PageHeader owns the page h1).', 'Pass level={3} for nested subsections so the outline stays sequential.']}
    >
      <Demo />
    </ComponentPage>
  );
}
