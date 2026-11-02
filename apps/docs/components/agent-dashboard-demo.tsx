'use client';

import { useState } from 'react';
import { ChainThought, Confirmation, Reasoning, ToolCall, type ToolCallData } from '@slipstream-ui/ai';

const TOOL_CALL: ToolCallData = {
  id: 'call-deploy',
  name: 'deploy_docs',
  status: 'completed',
  arguments: { branch: 'main', target: 'netlify' },
  result: 'Deployed 42 pages in 6.2s',
};

const APPROVED_THOUGHTS = [
  { id: 't1', content: 'Scan changed files', status: 'completed' as const },
  { id: 't2', content: 'Run production build', status: 'completed' as const },
  { id: 't3', content: 'Upload to CDN', status: 'completed' as const },
];

const APPROVED_REASONING = [
  { id: 'r1', content: 'Changed files only touch docs routes — safe to deploy' },
  { id: 'r2', content: 'Build completed with zero type errors' },
  { id: 'r3', content: 'CDN cache invalidated for /docs/*' },
];

/**
 * Live demo of the Agent Dashboard template: a destructive tool call pauses
 * behind the Confirmation gate; approving reveals the completed ToolCall with
 * its reasoning and chain-of-thought panels, rejecting unwinds cleanly.
 */
export function AgentDashboardDemo() {
  const [decision, setDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      {decision === 'pending' && (
        <Confirmation
          title="Deploy documentation to production?"
          description="Runs the production build and publishes 42 pages to the live site. The previous deploy stays restorable."
          toolName="deploy_docs"
          onApprove={() => setDecision('approved')}
          onReject={() => setDecision('rejected')}
        />
      )}

      {decision === 'approved' && (
        <>
          <ToolCall toolCall={TOOL_CALL} />
          <ChainThought steps={APPROVED_THOUGHTS} />
          <Reasoning steps={APPROVED_REASONING} duration="3s" defaultExpanded={false} />
        </>
      )}

      {decision === 'rejected' && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Deployment cancelled — no changes were made.
          </p>
          <button
            type="button"
            onClick={() => setDecision('pending')}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          >
            Run again
          </button>
        </div>
      )}
    </div>
  );
}
