import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/list-toolbar', {
  title: 'ListToolbar',
  description:
    'Result bar for filtered lists: count, page position, sort note, and slots for a view switch and sort control.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('list-toolbar')}
      id="list-toolbar"
      title="ListToolbar"
      description="Slim result bar for filtered lists and directories: result count, page position and a sort note on the left; a view switch and sort control on the right."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'count', type: 'number', description: 'Number of matching results; renders "{count} {countLabel}".' },
        { name: 'countLabel', type: 'string', defaultValue: "'results'", description: 'Noun for the result count.' },
        { name: 'position', type: 'ReactNode', description: 'Page or range position, e.g. "Page 2 of 5".' },
        { name: 'note', type: 'ReactNode', description: 'Muted note after the position, e.g. a "sorted by" line.' },
        { name: 'align', type: "'between' | 'start' | 'center' | 'end'", defaultValue: "'between'", description: 'Distribution of summary and controls.' },
        { name: 'children', type: 'ReactNode', description: 'Controls at the far end: SegmentedControl view switch, sort Select.' },
      ]}
      accessibility={['The summary line is aria-live="polite" so result-count changes are announced.', 'Give icon-only controls an aria-label; prefer SegmentedControl link mode for URL-backed view switching.']}
    >
      <Demo />
    </ComponentPage>
  );
}
