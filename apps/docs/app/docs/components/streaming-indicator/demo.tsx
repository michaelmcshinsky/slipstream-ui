'use client';

import { useState } from 'react';
import { StreamingIndicator } from '@slipstream-ui/ai';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [streaming, setStreaming] = useState(true);
  return (
    <>
      <DemoCard
        title="Streaming state"
        preview={<StreamingIndicator isStreaming text="Writing a response." />}
        code={`<StreamingIndicator isStreaming={isGenerating} text="Writing a response." />`}
      />

      <DemoCard
        title="Sizes, tones and dot counts"
        preview={
          <div className="space-y-4">
            <StreamingIndicator isStreaming size="sm" tone="muted" text="Small, muted" />
            <StreamingIndicator isStreaming text="Default" />
            <StreamingIndicator isStreaming size="lg" dotCount={5} text="Large, five dots" />
            <StreamingIndicator isStreaming tone="current" showLabel={false} text="Dots only" />
          </div>
        }
        code={`<StreamingIndicator isStreaming size="sm" tone="muted" />
<StreamingIndicator isStreaming />
<StreamingIndicator isStreaming size="lg" dotCount={5} />
<StreamingIndicator isStreaming showLabel={false} />`}
        usage={`// Match the indicator to the surrounding chat row: 'current' inherits the
// text colour inside a tinted bubble, 'muted' recedes in a toolbar.
// showLabel={false} keeps the status text for screen readers only.`}
      />

      <DemoCard
        title="Mount and unmount"
        preview={
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={streaming}
                onChange={(e) => setStreaming(e.target.checked)}
                className="h-4 w-4 rounded-sm border border-primary"
              />
              Response arriving
            </label>
            <div className="rounded-md border border-border bg-card p-4">
              {streaming ? (
                <StreamingIndicator isStreaming text="Writing a response." />
              ) : (
                <p className="text-sm text-muted-foreground">Response finished — nothing renders when isStreaming is false.</p>
              )}
            </div>
          </div>
        }
        code={`const [isGenerating, setIsGenerating] = useState(true);

{isGenerating && <StreamingIndicator isStreaming text="Writing a response." />}`}
        usage={`// The component returns null when isStreaming is false, so callers can
// mount it unconditionally and toggle the prop instead.`}
      />
    </>
  );
}
