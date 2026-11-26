import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/table-of-contents', {
  title: 'TableOfContents',
  description:
    "Sticky 'On this page' navigation with real anchor links, nested levels, aria-current, and a useScrollSpy hook for the active heading.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('table-of-contents')}
      id="table-of-contents"
      title="TableOfContents"
      description="Sticky 'On this page' navigation with real anchor links, nested levels, aria-current, and a useScrollSpy hook for the active heading."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'headings', type: 'TocHeading[]', defaultValue: 'required', description: 'Headings: { id, text, level: 2 | 3 | 4 }.' },
        { name: 'activeId', type: 'string', description: 'Controlled active heading (pair with useScrollSpy).' },
        { name: 'label', type: 'string', defaultValue: "'On this page'", description: 'Accessible name of the nav landmark.' },
        { name: 'ariaLabel', type: 'string', description: 'Landmark name when it differs from the visible label.' },
        { name: 'labelClassName', type: 'string', description: 'Extra classes for the visible label.' },
        { name: 'sticky', type: 'boolean', defaultValue: 'true', description: 'Stick while the article scrolls.' },
        { name: 'onNavigate', type: '(id: string) => void', description: 'Called when a link is activated; the browser still handles the jump.' },
        { name: 'useScrollSpy(ids)', type: 'hook', description: 'Active heading id from scroll position and the URL hash.' },
      ]}
      accessibility={[
        'nav landmark with a label; the active link carries aria-current="location".',
        'Links are native anchors, so Enter, middle-click, and deep links work.',
        'Nested levels are indented; DOM order matches document order.',
        'Add scroll-mt-* to target headings when a sticky header overlaps them.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
