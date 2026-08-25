import { Source, Sources } from '@slipstream-ui/ai';
import { CodeBlock } from '@/components/code-block';
import { PropsTable } from '@/components/props-table';

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

      <CodeBlock className="mb-8">{`import { Sources, Source } from '@slipstream-ui/ai';

<Sources
  sources={[{ id: '1', title: 'React docs', url: 'https://react.dev' }]}
  maxDisplay={3}
  label="Sources"
/>

// Single inline citation
<Source source={{ id: '1', title: 'React docs', url: 'https://react.dev' }} index={1} />`}</CodeBlock>

      <h2 className="text-2xl font-semibold mb-4">Props</h2>
      <div className="mb-8">
        <PropsTable
          rows={[
            { name: 'sources', type: 'SourceItem[]', description: 'References to display (Sources).' },
            { name: 'maxDisplay', type: 'number', defaultValue: '3', description: 'Max references before an overflow indicator.' },
            { name: 'label', type: 'string', defaultValue: "'Sources'", description: 'Heading label; override for localization.' },
            { name: 'index', type: 'number', description: '1-based citation marker rendered as [n] (Source).' },
          ]}
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>References use native links with <code className="bg-muted px-1 rounded">rel=&quot;noopener noreferrer&quot;</code>.</li>
        <li>Citation markers are aria-hidden; titles are read as link text.</li>
      </ul>
    </div>
  );
}
