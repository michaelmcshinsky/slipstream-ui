import { Spinner } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Sizes & inline usage"
        preview={
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Spinner size="sm" />
              <Spinner />
              <Spinner size="lg" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner size="sm" aria-hidden label="" />
              Generating response...
            </div>
          </div>
        }
        code={`import { Spinner } from '@slipstream-ui/core';

<Spinner size="sm" />

// Inline loading state
<span className="flex items-center gap-2">
  <Spinner size="sm" aria-hidden label="" />
  Generating response...
</span>`}
      />
    </>
  );
}
