import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/load-more', {
  title: 'LoadMore',
  description: 'Load-more control with pending and end-of-list states.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('load-more')}
      id="load-more"
      title="LoadMore"
      description="Load-more control with pending and end-of-list states."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'hasMore', type: 'boolean', defaultValue: 'required', description: 'Whether another page is available.' },
        { name: 'onLoadMore', type: '() => void', defaultValue: 'required', description: 'Request the next page.' },
        { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Loading state.' },
        { name: 'loadLabel', type: 'string', defaultValue: "'Load more'", description: 'Button label.' },
        { name: 'loadingLabel', type: 'string', defaultValue: "'Loading...'", description: 'Loading label.' },
        { name: 'endLabel', type: 'string', defaultValue: "'You're all caught up.'", description: 'End-of-list message.' },
      ]}
      accessibility={[
        'The wrapper uses aria-live polite and loading sets aria-busy.',
        'At the end, the button is replaced by a status message.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
