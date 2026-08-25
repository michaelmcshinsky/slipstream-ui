'use client';

import { useState } from 'react';
import { Reasoning } from '@slipstream-ui/ai';
import type { ReasoningStep } from '@slipstream-ui/ai';

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
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mt-2">
          <code>{`import { Reasoning } from '@slipstream-ui/ai'`}</code>
        </pre>
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>{`const reasoningSteps = [
  { id: '1', content: 'Analyzing the request...' },
  { id: '2', content: 'Considering different approaches...' },
  { id: '3', content: 'Formulating the response...' }
]

<Reasoning 
  steps={reasoningSteps}
  collapsible={true}
  defaultExpanded={false}
/>`}</code>
        </pre>
      </div>

      {/* Props */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <div className="border rounded-lg overflow-hidden">
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
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">steps</td>
                <td className="p-3 text-xs">ReasoningStep[]</td>
                <td className="p-3 text-xs">required</td>
                <td className="p-3 text-xs">Array of reasoning steps</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">collapsible</td>
                <td className="p-3 text-xs">boolean</td>
                <td className="p-3 text-xs">true</td>
                <td className="p-3 text-xs">Whether reasoning can be collapsed</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">defaultExpanded</td>
                <td className="p-3 text-xs">boolean</td>
                <td className="p-3 text-xs">false</td>
                <td className="p-3 text-xs">Whether expanded by default</td>
              </tr>
            </tbody>
          </table>
        </div>
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
