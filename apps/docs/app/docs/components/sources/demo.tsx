import { Source, Sources } from '@slipstream-ui/ai';
import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function SourcesPage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
  return (
    <ComponentPage
        manifest={manifest}
      id="sources"
      manifestId="source"
      title="Sources"
      description="Show citations and references alongside an AI response. Sources renders a numbered list; Source renders a single citation for custom layouts."
      npmPackages="@slipstream-ui/ai"
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
          <div className="w-full space-y-3">
            <Source source={{ id: '1', title: 'React documentation', url: 'https://react.dev' }} index={1} />
            <Source source={{ id: '2', title: 'Unnumbered citation', url: 'https://example.com' }} />
          </div>
        }
        code={`import { Source } from '@slipstream-ui/ai';

<Source source={{ id: '1', title: 'React docs', url: 'https://react.dev' }} index={1} />
{/* omit index for an unnumbered citation marker */}
<Source source={{ id: '2', title: 'Reference', url: 'https://example.com' }} />`}
        usage={`// index renders the [n] citation marker; omit it for references
// that should not be numbered (footnotes, related reading).`}
      />
      <DemoCard
        title="Overflow with maxDisplay"
        preview={
          <div className="w-full">
            <Sources
              maxDisplay={3}
              sources={[
                { id: '1', title: 'React documentation', url: 'https://react.dev' },
                { id: '2', title: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
                { id: '3', title: 'TypeScript handbook', url: 'https://www.typescriptlang.org' },
                { id: '4', title: 'WCAG 2.2', url: 'https://www.w3.org/TR/WCAG22/' },
                { id: '5', title: 'WebAIM', url: 'https://webaim.org' },
              ]}
            />
          </div>
        }
        code={`<Sources
  maxDisplay={3}
  sources={sources}   // 5 items -> shows 3 + a "+2 more" indicator
/>`}
        usage={`// Sources beyond maxDisplay collapse into a "+N more" disclosure;
// raise maxDisplay or paginate upstream for long reference lists.`}
      />
    </ComponentPage>
  );
}
