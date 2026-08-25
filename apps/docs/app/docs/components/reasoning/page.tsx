'use client';

import { useState } from 'react';
import { Reasoning } from '@slipstream-ui/ai';
import type { ReasoningStep } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ReasoningPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [collapsible, setCollapsible] = useState(true);

  const steps: ReasoningStep[] = [
    { id: '1', content: 'I need to analyze the user\'s request for key requirements.' },
    { id: '2', content: 'The user wants to know about React component libraries.' },
    { id: '3', content: 'I should provide information about modern React component design patterns.' },
    { id: '4', content: 'I will focus on AI-first design principles and component manifests.' },
  ];

  return (
    <ComponentPage
      id="reasoning"
      title="Reasoning"
      description="A collapsible component for displaying AI reasoning steps and chain-of-thought processes."
      propsRows={[
        { name: 'steps', type: 'ReasoningStep[]', defaultValue: 'required', description: 'Array of reasoning steps' },
        { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'Whether reasoning can be collapsed' },
        { name: 'defaultExpanded', type: 'boolean', defaultValue: 'false', description: 'Whether expanded by default' },
      ]}
      accessibility={[
        'Uses aria-expanded to communicate collapsible state',
        'Collapsible button is keyboard accessible',
        'Steps are numbered for easy reference',
        'Visual hierarchy with clear step indicators',
      ]}
    >
      <DemoCard
        title="Playground"
        preview={
          <div className="w-full space-y-4">
            <Reasoning
              steps={steps}
              collapsible={collapsible}
              defaultExpanded={isExpanded}
            />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="collapsible"
                  checked={collapsible}
                  onChange={(e) => setCollapsible(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="collapsible" className="text-sm">Collapsible</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="expanded"
                  checked={isExpanded}
                  onChange={(e) => setIsExpanded(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="expanded" className="text-sm">Default Expanded</label>
              </div>
            </div>
          </div>
        }
        code={`import { Reasoning } from '@slipstream-ui/ai';

const reasoningSteps = [
  { id: '1', content: 'Analyzing the request...' },
  { id: '2', content: 'Considering different approaches...' },
  { id: '3', content: 'Formulating the response...' }
]

<Reasoning
  steps={reasoningSteps}
  collapsible={true}
  defaultExpanded={false}
/>`}
      />
      <DemoCard
        title="Variants"
        preview={
          <div className="w-full space-y-6">
            <Reasoning steps={steps.slice(0, 2)} />
            <Reasoning steps={steps.slice(0, 2)} defaultExpanded={true} />
            <Reasoning steps={steps.slice(0, 2)} collapsible={false} />
          </div>
        }
        code={`<Reasoning steps={steps} />
<Reasoning steps={steps} defaultExpanded={true} />
<Reasoning steps={steps} collapsible={false} />`}
      />
    </ComponentPage>
  );
}
