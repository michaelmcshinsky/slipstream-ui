import { Spinner } from '@slipstream-ui/core';

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

      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-8">
        <code>{`import { Spinner } from '@slipstream-ui/core';

<Spinner size="sm" />

// Inline loading state
<span className="flex items-center gap-2">
  <Spinner size="sm" aria-hidden label="" />
  Generating response...
</span>`}</code>
      </pre>

      <h2 className="text-2xl font-semibold mb-4">Props</h2>
      <div className="rounded-lg border border-border overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3">Prop</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Default</th>
              <th className="text-left p-3">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="p-3 font-mono">size</td>
              <td className="p-3 font-mono">&apos;sm&apos; | &apos;default&apos; | &apos;lg&apos;</td>
              <td className="p-3 font-mono">&apos;default&apos;</td>
              <td className="p-3">Visual size of the spinner.</td>
            </tr>
            <tr className="border-t border-border">
              <td className="p-3 font-mono">label</td>
              <td className="p-3 font-mono">string</td>
              <td className="p-3 font-mono">&apos;Loading...&apos;</td>
              <td className="p-3">Screen-reader label announced via role=status.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Renders <code className="bg-muted px-1 rounded">role=&quot;status&quot;</code> with an sr-only label so loading is announced.</li>
        <li>Set <code className="bg-muted px-1 rounded">aria-hidden</code> and an empty label when the spinner is purely decorative next to visible text.</li>
      </ul>
    </div>
  );
}
