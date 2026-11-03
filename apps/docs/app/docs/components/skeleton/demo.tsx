import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Skeleton } from '@slipstream-ui/core';

export default function SkeletonPage() {
  return (
    <ComponentPage
      id="skeleton"
      title="Skeleton"
      description="Loading placeholder that mirrors the shape of upcoming content — sized via props, not ad-hoc classes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'height', type: 'string', description: "Tailwind height class (e.g. 'h-4') applied to the block." },
        { name: 'width', type: 'string', defaultValue: "'w-full'", description: "Tailwind width class (e.g. 'w-48') applied to the block." },
        { name: 'rounded', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", defaultValue: "'md'", description: 'Corner preset — use full for avatars/dots, none for tables.' },
        { name: 'className', type: 'string', description: 'Escape hatch for anything the props do not cover.' },
      ]}
      accessibility={[
        'aria-hidden so screen readers skip placeholder shapes.',
        'Wrap the loading region in a role=status element to announce "Loading…" once for the whole block.',
        'Match skeleton geometry to the real content to avoid layout shift when data arrives.',
      ]}
    >
      <DemoCard
        title="Sized with props"
        preview={
          <div className="w-full max-w-md space-y-5">
            <div className="space-y-2">
              <Skeleton height="h-4" width="w-48" />
              <Skeleton height="h-4" width="w-72" />
              <Skeleton height="h-4" width="w-56" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton height="h-10" width="w-10" rounded="full" />
              <div className="flex-1 space-y-2">
                <Skeleton height="h-4" width="w-40" />
                <Skeleton height="h-3" width="w-56" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton height="h-6" width="w-16" rounded="full" />
              <Skeleton height="h-6" width="w-20" rounded="full" />
            </div>
            <Skeleton height="h-28" rounded="lg" />
          </div>
        }
        code={`import { Skeleton } from '@slipstream-ui/core';

{/* Text lines */}
<Skeleton height="h-4" width="w-48" />
<Skeleton height="h-4" width="w-72" />

{/* Avatar (round) + text row */}
<div className="flex items-center gap-3">
  <Skeleton height="h-10" width="w-10" rounded="full" />
  <div className="flex-1 space-y-2">
    <Skeleton height="h-4" width="w-40" />
    <Skeleton height="h-3" width="w-56" />
  </div>
</div>

{/* Pills and media blocks */}
<Skeleton height="h-6" width="w-16" rounded="full" />
<Skeleton height="h-28" rounded="lg" />`}
        usage={`import { Skeleton } from '@slipstream-ui/core';

// className remains the escape hatch for one-off shapes
<Skeleton className="h-3 w-24" />`}
        types={`type SkeletonProps = {
  height?: string;
  width?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
};`}
      />

      <DemoCard
        title="Realistic layouts"
        preview={
          <div className="w-full max-w-md space-y-4" role="status" aria-label="Loading content">
            <div className="rounded-lg border border-border p-4" aria-hidden="true">
              <div className="space-y-3">
                <Skeleton height="h-4" width="w-2/3" />
                <Skeleton height="h-3" width="w-full" />
                <Skeleton height="h-3" width="w-5/6" />
                <div className="flex gap-2 pt-1">
                  <Skeleton height="h-7" width="w-20" rounded="sm" />
                  <Skeleton height="h-7" width="w-16" rounded="sm" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4" aria-hidden="true">
              <div className="flex items-center justify-between">
                <Skeleton height="h-4" width="w-32" />
                <Skeleton height="h-4" width="w-10" />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton height="h-3" width="w-40" />
                  <Skeleton height="h-3" width="w-14" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton height="h-3" width="w-36" />
                  <Skeleton height="h-3" width="w-14" />
                </div>
              </div>
            </div>
          </div>
        }
        code={`{/* Announce the region once for assistive tech, hide the shapes */}
<div role="status" aria-label="Loading content">
  <div className="rounded-lg border p-4" aria-hidden="true">
    <Skeleton height="h-4" width="w-2/3" />
    <Skeleton height="h-3" width="w-full" />
    <Skeleton height="h-3" width="w-5/6" />
  </div>
</div>`}
      />
    </ComponentPage>
  );
}
