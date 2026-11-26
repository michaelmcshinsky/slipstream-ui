import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/table-card', {
  title: 'TableCard',
  description: 'Table shell with title, actions, toolbar, edge-to-edge body and footer.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('table-card')}
      id="table-card"
      title="TableCard"
      description="Table shell with title/description, actions, optional toolbar, edge-to-edge body and a footer row."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', description: 'Card heading (h2).' },
        { name: 'description', type: 'string', description: 'Supporting line under the heading.' },
        { name: 'actions', type: 'ReactNode', description: 'Right-aligned header actions.' },
        { name: 'toolbar', type: 'ReactNode', description: 'Row between header and table (filters, bulk actions).' },
        { name: 'children', type: 'ReactNode', defaultValue: 'required', description: 'Table or DataTable content.' },
        { name: 'footer', type: 'ReactNode', description: 'Footer row (pagination, summary).' },
        { name: 'flush', type: 'boolean', defaultValue: 'true', description: 'Remove inner padding so the table reaches the card edges.' },
      ]}
      accessibility={['Title renders an h2; the page h1 belongs to PageHeader.', 'The table keeps its own caption/aria-label.']}
    >
      <Demo />
    </ComponentPage>
  );
}
