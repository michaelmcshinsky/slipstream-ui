import { ChainThought } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ChainThoughtPage() {
  return (
    <ComponentPage
      id="chain-thought"
      title="ChainThought"
      description="Show ordered agent work with explicit progress status."
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
