import { Spinner } from '@slipstream-ui/core';
import { CodeBlock } from '@/components/code-block';
import { PropsTable } from '@/components/props-table';

export default function SpinnerPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Spinner</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Indeterminate loading indicator with accessible status semantics.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Examples</h2>

      <div className="rounded-lg border border-border p-6 mb-8 space-y-6">
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

      <CodeBlock className="mb-8">{`import { Spinner } from '@slipstream-ui/core';

<Spinner size="sm" />

// Inline loading state
<span className="flex items-center gap-2">
  <Spinner size="sm" aria-hidden label="" />
  Generating response...
</span>`}</CodeBlock>

      <h2 className="text-2xl font-semibold mb-4">Props</h2>
      <div className="mb-8">
        <PropsTable
          rows={[
            { name: 'size', type: "'sm' | 'default' | 'lg'", defaultValue: "'default'", description: 'Visual size of the spinner.' },
            { name: 'label', type: 'string', defaultValue: "'Loading...'", description: 'Screen-reader label announced via role=status.' },
          ]}
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Renders <code className="bg-muted px-1 rounded">role=&quot;status&quot;</code> with an sr-only label so loading is announced.</li>
        <li>Set <code className="bg-muted px-1 rounded">aria-hidden</code> and an empty label when the spinner is purely decorative next to visible text.</li>
      </ul>
    </div>
  );
}
