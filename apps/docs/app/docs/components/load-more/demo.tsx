'use client';

import { useState } from 'react';
import { LoadMore } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
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
    <>
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
    </>
  );
}
