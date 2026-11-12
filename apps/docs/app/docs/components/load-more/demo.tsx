'use client';

import { useState } from 'react';
import { LoadMore } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function LoadMorePage() {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const load = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setHasMore(false);
    }, 800);
  };

  return (
    <ComponentPage
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
      <DemoCard
        title="Paginated project grid"
        preview={
          <div className="w-full">
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Project cards would render here.
            </div>
            <LoadMore hasMore={hasMore} loading={loading} onLoadMore={load} />
          </div>
        }
        code={`<LoadMore
  hasMore={hasMore}
  loading={loading}
  onLoadMore={loadNextPage}
/>`}
        usage={`// Replace the button with the end message when hasMore is false.
// Loading disables the button and announces the pending state.`}
        types={`type LoadMoreProps = {
  hasMore: boolean;
  onLoadMore: () => void;
  loading?: boolean;
  loadLabel?: string;
  loadingLabel?: string;
  endLabel?: string;
};`}
      />
    </ComponentPage>
  );
}
