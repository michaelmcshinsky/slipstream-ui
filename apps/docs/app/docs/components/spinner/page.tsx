import { Spinner } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function SpinnerPage() {
  return (
    <ComponentPage
      id="spinner"
      title="Spinner"
      description="Indeterminate loading indicator with accessible status semantics."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'size', type: "'sm' | 'default' | 'lg'", defaultValue: "'default'", description: 'Visual size of the spinner.' },
        { name: 'label', type: 'string', defaultValue: "'Loading...'", description: 'Screen-reader label announced via role=status.' },
      ]}
      accessibility={[
        'Renders role="status" with an sr-only label so loading is announced.',
        'Set aria-hidden and an empty label when the spinner is purely decorative next to visible text.',
      ]}
    >
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
    </ComponentPage>
  );
}
