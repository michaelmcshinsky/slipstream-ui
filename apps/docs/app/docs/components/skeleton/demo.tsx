import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Skeleton } from '@slipstream-ui/core';

export default function SkeletonPage() {
  return (
    <ComponentPage
      id="skeleton"
      title="Skeleton"
      description="Loading placeholder that mirrors the shape of upcoming content."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'className', type: 'string', description: 'Shape and size classes (e.g. h-4 w-32, rounded-full).' },
      ]}
      accessibility={[
        'aria-hidden so screen readers skip placeholder shapes.',
        'Wrap the loading region in a role=status element to announce "Loading…" once for the whole block.',
        'Match skeleton geometry to the real content to avoid layout shift when data arrives.',
      ]}
    >
      <DemoCard
        title="Shapes"
        preview={
          <div className="w-full max-w-md space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
            <div className="h-28 w-full rounded-lg" aria-hidden="true">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        }
        code={`import { Skeleton } from '@slipstream-ui/core';

{/* Text lines */}
<Skeleton className="h-4 w-48" />
<Skeleton className="h-4 w-72" />

{/* Avatar + text row */}
<div className="flex items-center gap-3">
  <Skeleton className="h-10 w-10 rounded-full" />
  <div className="flex-1 space-y-2">
    <Skeleton className="h-4 w-40" />
    <Skeleton className="h-3 w-56" />
  </div>
</div>

{/* Media block */}
<Skeleton className="h-28 w-full rounded-lg" />

{/* Pills (badges/tags) */}
<Skeleton className="h-6 w-16 rounded-full" />`}
      />

      <DemoCard
        title="Realistic layouts"
        preview={
          <div className="w-full max-w-md space-y-4" role="status" aria-label="Loading content">
            <div className="rounded-lg border border-border p-4" aria-hidden="true">
              <div className="space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4" aria-hidden="true">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-10" />
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-14" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-3 w-14" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-44" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            </div>
          </div>
        }
        code={`import { Skeleton } from '@slipstream-ui/core';

{/* Announce the region once for assistive tech, hide the shapes */}
<div role="status" aria-label="Loading content">
  {/* Card-shaped skeleton */}
  <div className="rounded-lg border p-4" aria-hidden="true">
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-5/6" />
  </div>

  {/* Table-shaped skeleton */}
  <div className="rounded-lg border p-4" aria-hidden="true">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-3 w-40" />
    <Skeleton className="h-3 w-36" />
  </div>
</div>`}
      />
    </ComponentPage>
  );
}
