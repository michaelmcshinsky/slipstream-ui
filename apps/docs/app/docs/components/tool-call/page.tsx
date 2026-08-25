'use client';

import { useState } from 'react';
import { ToolCall } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

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
    <ComponentPage
      id="tool-call"
      title="ToolCall"
      description="A component for displaying AI tool/function calls with status, arguments, and results."
      propsRows={[
        { name: 'toolCall', type: 'ToolCall', defaultValue: 'required', description: 'Tool call object with name, arguments, status' },
        { name: 'showResult', type: 'boolean', defaultValue: 'true', description: 'Whether to display the result' },
      ]}
      accessibility={[
        'Status shown with both color and text label',
        'Arguments and results displayed in formatted code blocks',
        'Tool information organized in clear sections',
        'Status colors have sufficient contrast',
      ]}
    >
      <DemoCard
        title="Playground"
        preview={
          <div className="w-full space-y-4">
            <div className="space-y-4">
              <ToolCall
                toolCall={toolCall}
                showResult={showResult}
              />
            </div>
            <div className="space-y-4">
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
        }
        code={`import { ToolCall } from '@slipstream-ui/ai';

const toolCall = {
  id: 'tool-1',
  name: 'search',
  arguments: { query: 'React' },
  status: 'completed',
  result: { results: [...] }
}

<ToolCall
  toolCall={toolCall}
  showResult={true}
/>`}
      />
      <DemoCard
        title="Statuses"
        preview={
          <div className="w-full space-y-4">
            <ToolCall
              toolCall={{
                id: '1',
                name: 'search',
                arguments: { query: 'React' },
                status: 'completed',
                result: { results: ['Component A', 'Component B'] }
              }}
            />
            <ToolCall
              toolCall={{
                id: '2',
                name: 'calculate',
                arguments: { expression: '2 + 2' },
                status: 'running'
              }}
            />
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
        }
        code={`<ToolCall
  toolCall={{ id: '1', name: 'search', arguments: { query: 'React' }, status: 'completed', result: {...} }}
/>
<ToolCall toolCall={{ id: '2', name: 'calculate', arguments: { expression: '2 + 2' }, status: 'running' }} />
<ToolCall toolCall={{ id: '3', name: 'api_request', arguments: { endpoint: '/users' }, status: 'failed' }} />`}
      />
    </ComponentPage>
  );
}
