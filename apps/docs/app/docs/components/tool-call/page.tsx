'use client';

import { useState } from 'react';
import { ToolCall } from '@slipstream-ui/ai';

export default function ToolCallPage() {
  const [status, setStatus] = useState<'pending' | 'running' | 'completed' | 'failed'>('completed');
  const [showResult, setShowResult] = useState(true);

  const toolCall: any = {
    id: 'tool-123',
    name: 'search_database',
    arguments: { query: 'React components', limit: 10 },
    status: status,
    result: status === 'completed' ? { results: ['Component A', 'Component B', 'Component C'] } : undefined,
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">ToolCall</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A component for displaying AI tool/function calls with status, arguments, and results.
      </p>

      {/* Live Preview */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-sm font-semibold mb-4">Live Preview</h2>
        <ToolCall 
          toolCall={toolCall}
          showResult={showResult}
        />
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2 border rounded bg-background"
            >
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showResult"
              checked={showResult}
              onChange={(e) => setShowResult(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showResult" className="text-sm">Show Result</label>
          </div>
        </div>
      </div>

      {/* Installation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>npx slipstream-ui add tool-call</code>
        </pre>
        <p className="text-sm text-muted-foreground mt-2">Or import manually:</p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mt-2">
          <code>{`import { ToolCall } from '@slipstream-ui/ai'`}</code>
        </pre>
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>{`const toolCall = {
  id: 'tool-1',
  name: 'search',
  arguments: { query: 'React' },
  status: 'completed',
  result: { results: [...] }
}

<ToolCall 
  toolCall={toolCall}
  showResult={true}
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
                <td className="p-3 font-mono text-xs">toolCall</td>
                <td className="p-3 text-xs">ToolCall</td>
                <td className="p-3 text-xs">required</td>
                <td className="p-3 text-xs">Tool call object with name, arguments, status</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">showResult</td>
                <td className="p-3 text-xs">boolean</td>
                <td className="p-3 text-xs">true</td>
                <td className="p-3 text-xs">Whether to display the result</td>
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
            <h3 className="font-medium mb-2">Completed tool call</h3>
            <ToolCall 
              toolCall={{
                id: '1',
                name: 'search',
                arguments: { query: 'React' },
                status: 'completed',
                result: { results: ['Component A', 'Component B'] }
              }}
            />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Running tool call</h3>
            <ToolCall 
              toolCall={{
                id: '2',
                name: 'calculate',
                arguments: { expression: '2 + 2' },
                status: 'running'
              }}
            />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Failed tool call</h3>
            <ToolCall 
              toolCall={{
                id: '3',
                name: 'api_request',
                arguments: { endpoint: '/users' },
                status: 'failed',
                result: { error: 'Timeout' }
              }}
            />
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Status shown with both color and text label</li>
          <li>Arguments and results displayed in formatted code blocks</li>
          <li>Tool information organized in clear sections</li>
          <li>Status colors have sufficient contrast</li>
        </ul>
      </div>
    </div>
  );
}
