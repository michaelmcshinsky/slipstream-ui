import { Source, Sources } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function SourcesPage() {
  return (
    <ComponentPage
      id="sources"
      title="Sources"
      description="Show citations and references alongside an AI response. Sources renders a numbered list; Source renders a single citation for custom layouts."
      propsRows={[
        { name: 'sources', type: 'SourceItem[]', description: 'References to display (Sources).' },
        { name: 'maxDisplay', type: 'number', defaultValue: '3', description: 'Max references before an overflow indicator.' },
        { name: 'label', type: 'string', defaultValue: "'Sources'", description: 'Heading label; override for localization.' },
        { name: 'index', type: 'number', description: '1-based citation marker rendered as [n] (Source).' },
      ]}
      accessibility={[
        'References use native links with rel="noopener noreferrer".',
        'Citation markers are aria-hidden; titles are read as link text.',
      ]}
    >
      <DemoCard
        title="Sources list"
        preview={
          <div className="w-full">
            <Sources
              sources={[
                { id: '1', title: 'React documentation', url: 'https://react.dev', snippet: 'The official guide to building user interfaces with React.' },
                { id: '2', title: 'Slipstream UI', url: '/', snippet: 'AI-first components with machine-readable usage manifests.' },
              ]}
            />
          </div>
        }
        code={`import { Sources } from '@slipstream-ui/ai';

<Sources
  sources={[{ id: '1', title: 'React docs', url: 'https://react.dev' }]}
  maxDisplay={3}
  label="Sources"
/>`}
      />
      <DemoCard
        title="Single Source"
        preview={
          <div className="w-full">
            <Source source={{ id: '1', title: 'React documentation', url: 'https://react.dev' }} index={1} />
          </div>
        }
        code={`import { Source } from '@slipstream-ui/ai';

<Source source={{ id: '1', title: 'React docs', url: 'https://react.dev' }} index={1} />`}
      />
    </ComponentPage>
  );
}
