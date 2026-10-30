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
        { name: 'className', type: 'string', description: 'Shape and size classes (e.g. h-4 w-32).' },
      ]}
      accessibility={[
        'aria-hidden so screen readers skip it.',
        'Pair with a role=status region to announce loading.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
          </div>
        }
        code="// See the examples in the props table above"
      />
    </ComponentPage>
  );
}
