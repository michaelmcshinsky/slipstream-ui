'use client';

import { useState } from 'react';
import { InlineCitation, Sources, Suggestions, type SourceItem, type Suggestion } from '@slipstream-ui/ai';

const SOURCES: SourceItem[] = [
  {
    id: 's1',
    title: 'COMPONENT_MANIFEST schema reference',
    snippet: 'Every component ships id, props, antiPatterns, accessibility, and compositionRules…',
  },
  {
    id: 's2',
    title: 'validate_usage MCP tool',
    snippet: 'Checks generated JSX against the manifest and rejects hallucinated props…',
  },
  {
    id: 's3',
    title: 'Streaming-safe markdown rendering',
    snippet: 'Response repairs unclosed emphasis, inline code, and fences mid-stream…',
  },
];

const FOLLOW_UPS: Suggestion[] = [
  { id: 'f1', text: 'How does the manifest schema work?', type: 'follow-up' },
  { id: 'f2', text: 'Show a validate_usage example', type: 'follow-up' },
  { id: 'f3', text: 'How do I install via shadcn?', type: 'follow-up' },
];

/**
 * Live demo of the RAG Citations template: an answer with inline citation
 * chips that reveal snippets on hover/focus, a numbered sources footer, and
 * clickable follow-up suggestions.
 */
export function RagCitationsDemo() {
  const [followUp, setFollowUp] = useState<string | null>(null);

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="space-y-2 text-sm leading-relaxed">
        <p>
          Slipstream keeps agents honest by shipping a machine-readable spec with every component
          <InlineCitation source={SOURCES[0]}>[1]</InlineCitation>. Before emitting code, your agent
          can call <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">validate_usage</code>
          <InlineCitation source={SOURCES[1]}>[2]</InlineCitation> to reject hallucinated props —
          and streamed markdown renders cleanly even while tokens are still arriving
          <InlineCitation source={SOURCES[2]}>[3]</InlineCitation>.
        </p>
      </div>

      <Sources sources={SOURCES} maxDisplay={3} />

      <Suggestions suggestions={FOLLOW_UPS} onSelect={(s) => setFollowUp(s.text)} />

      {followUp && (
        <p className="border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Next question:</span> {followUp} — wire this
          to your transport to continue the conversation.
        </p>
      )}
    </div>
  );
}
