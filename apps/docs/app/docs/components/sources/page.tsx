import { Source, Sources } from '@slipstream-ui/ai';

export default function SourcesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Sources</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Show citations and references alongside an AI response. <code className="bg-muted px-1 rounded">Sources</code> renders
        a numbered list; <code className="bg-muted px-1 rounded">Source</code> renders a single citation for custom layouts.
      </p>

      <div className="rounded-lg border border-border p-6 mb-8">
        <Sources
          sources={[
            { id: '1', title: 'React documentation', url: 'https://react.dev', snippet: 'The official guide to building user interfaces with React.' },
            { id: '2', title: 'Slipstream UI', url: '/', snippet: 'AI-first components with machine-readable usage manifests.' },
          ]}
        />
      </div>

      <div className="rounded-lg border border-border p-6 mb-8">
        <Source source={{ id: '1', title: 'React documentation', url: 'https://react.dev' }} index={1} />
      </div>

      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-8">
        <code>{`import { Sources, Source } from '@slipstream-ui/ai';

<Sources
  sources={[{ id: '1', title: 'React docs', url: 'https://react.dev' }]}
  maxDisplay={3}
  label="Sources"
/>

// Single inline citation
<Source source={{ id: '1', title: 'React docs', url: 'https://react.dev' }} index={1} />`}</code>
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
              <td className="p-3 font-mono">sources</td>
              <td className="p-3 font-mono">Source[]</td>
              <td className="p-3">—</td>
              <td className="p-3">References to display (Sources).</td>
            </tr>
            <tr className="border-t border-border">
              <td className="p-3 font-mono">maxDisplay</td>
              <td className="p-3 font-mono">number</td>
              <td className="p-3 font-mono">3</td>
              <td className="p-3">Max references before an overflow indicator.</td>
            </tr>
            <tr className="border-t border-border">
              <td className="p-3 font-mono">label</td>
              <td className="p-3 font-mono">string</td>
              <td className="p-3 font-mono">&apos;Sources&apos;</td>
              <td className="p-3">Heading label; override for localization.</td>
            </tr>
            <tr className="border-t border-border">
              <td className="p-3 font-mono">index</td>
              <td className="p-3 font-mono">number</td>
              <td className="p-3">—</td>
              <td className="p-3">1-based citation marker rendered as [n] (Source).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>References use native links with <code className="bg-muted px-1 rounded">rel=&quot;noopener noreferrer&quot;</code>.</li>
        <li>Citation markers are aria-hidden; titles are read as link text.</li>
      </ul>
    </div>
  );
}
