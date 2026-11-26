import { ChainThought } from '@slipstream-ui/ai';
import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ChainThoughtPage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
  return (
    <ComponentPage
        manifest={manifest}
      id="chain-thought"
      title="ChainThought"
      description="Show ordered agent work with explicit progress status."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'steps', type: 'ChainThoughtStep[]', defaultValue: 'required', description: 'Ordered reasoning steps: { id, content, status?: "pending" | "completed" | "failed" }.' },
        { name: 'compact', type: 'boolean', defaultValue: 'false', description: 'Tighter row density for side panels.' },
        { name: 'className', type: 'string', description: 'Extra classes for the root element.' },
      ]}
      accessibility={[
        'Steps render as an ordered list so sequence is structural.',
        'Status is conveyed by text/icons, not color alone.',
      ]}
    >
      <DemoCard
        title="Agent steps"
        preview={
          <ChainThought
            steps={[
              { id: '1', content: 'Find relevant context', status: 'completed' },
              { id: '2', content: 'Call the knowledge tool', status: 'completed' },
              { id: '3', content: 'Write the response', status: 'pending' },
            ]}
          />
        }
        code={`<ChainThought
  steps={[
    { id: '1', content: 'Find context', status: 'completed' },
    { id: '2', content: 'Write response', status: 'pending' },
  ]}
/>`}
      />
    </ComponentPage>
  );
}
