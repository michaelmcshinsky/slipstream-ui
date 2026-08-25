'use client';

import { useState } from 'react';
import { Reasoning } from '@slipstream-ui/ai';
import type { ReasoningStep } from '@slipstream-ui/ai';
import { CodeBlock } from '@/components/code-block';
import { PropsTable } from '@/components/props-table';

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
    <div>
      <h1 className="text-4xl font-bold mb-2">Reasoning</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A collapsible component for displaying AI reasoning steps and chain-of-thought processes.
      </p>

      {/* Live Preview */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-sm font-semibold mb-4">Live Preview</h2>
        <Reasoning 
          steps={steps} 
          collapsible={collapsible}
          defaultExpanded={isExpanded}
        />
        <div className="space-y-4 mt-4">
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

      {/* Installation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>npx slipstream-ui add reasoning</code>
        </pre>
        <p className="text-sm text-muted-foreground mt-2">Or import manually:</p>
        <CodeBlock className="mt-2">{`import { Reasoning } from '@slipstream-ui/ai'`}</CodeBlock>
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <CodeBlock>{`const reasoningSteps = [
  { id: '1', content: 'Analyzing the request...' },
  { id: '2', content: 'Considering different approaches...' },
  { id: '3', content: 'Formulating the response...' }
]

<Reasoning 
  steps={reasoningSteps}
  collapsible={true}
  defaultExpanded={false}
/>`}</CodeBlock>
      </div>

      {/* Props */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <PropsTable
          rows={[
            { name: 'steps', type: 'ReasoningStep[]', defaultValue: 'required', description: 'Array of reasoning steps' },
            { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'Whether reasoning can be collapsed' },
            { name: 'defaultExpanded', type: 'boolean', defaultValue: 'false', description: 'Whether expanded by default' },
          ]}
        />
      </div>

      {/* Examples */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Examples</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Basic reasoning</h3>
            <Reasoning steps={steps.slice(0, 2)} />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Expanded by default</h3>
            <Reasoning steps={steps.slice(0, 2)} defaultExpanded={true} />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Non-collapsible</h3>
            <Reasoning steps={steps.slice(0, 2)} collapsible={false} />
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Uses aria-expanded to communicate collapsible state</li>
          <li>Collapsible button is keyboard accessible</li>
          <li>Steps are numbered for easy reference</li>
          <li>Visual hierarchy with clear step indicators</li>
        </ul>
      </div>
    </div>
  );
}
