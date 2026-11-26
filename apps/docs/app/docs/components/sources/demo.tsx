import { Source, Sources } from '@slipstream-ui/ai';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
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
    </>
  );
}
