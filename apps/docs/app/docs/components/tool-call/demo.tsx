'use client';

import { useState } from 'react';
import { Checkbox, Select } from '@slipstream-ui/core';
import { ToolCall, type ToolCallData } from '@slipstream-ui/ai';
import { DemoCard } from '@/components/demo-card';

type ToolCallStatus = 'pending' | 'running' | 'completed' | 'failed';

export default function Demo() {
  const [status, setStatus] = useState<ToolCallStatus>('completed');
  const [showResult, setShowResult] = useState(true);

  const toolCall: ToolCallData = {
    id: 'tool-123',
    name: 'search_database',
    arguments: { query: 'React components', limit: 10 },
    status: status,
    result: status === 'completed' ? { results: ['Component A', 'Component B', 'Component C'] } : undefined,
  };

  return (
    <>
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
                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ToolCallStatus)}
                  options={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'running', label: 'Running' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'failed', label: 'Failed' },
                  ]}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="showResult"
                  checked={showResult}
                  onCheckedChange={setShowResult}
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
    </>
  );
}
