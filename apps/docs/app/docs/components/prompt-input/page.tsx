'use client';

import { useRef, useState } from 'react';
import { PromptInput } from '@slipstream-ui/ai';
import { CodeBlock } from '@/components/code-block';
import { PropsTable } from '@/components/props-table';

export default function PromptInputPage() {
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSubmit = (value: string) => {
    setSubmitted((prev) => [...prev, value]);
    setIsLoading(true);
    abortRef.current = setTimeout(() => setIsLoading(false), 2500);
  };

  const handleStop = () => {
    if (abortRef.current) clearTimeout(abortRef.current);
    setIsLoading(false);
    setSubmitted((prev) => [...prev, '(generation stopped)']);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">PromptInput</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Auto-resizing chat input with Enter-to-send, Shift+Enter for newlines, and a
        stop-generation button while a response is in flight.
      </p>

      <div className="rounded-lg border border-border p-6 mb-4">
        <PromptInput
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onStop={handleStop}
          placeholder="Ask something... (Enter sends, Shift+Enter adds a line)"
        />
        {submitted.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            {submitted.slice(-3).map((entry, index) => (
              <li key={index}>↳ {entry}</li>
            ))}
          </ul>
        )}
      </div>

      <CodeBlock className="mb-8">{`import { PromptInput } from '@slipstream-ui/ai';

// Basic
<PromptInput onSubmit={(text) => send(text)} />

// Cancellable generation: send button becomes a stop button while loading
<PromptInput
  onSubmit={send}
  isLoading={isStreaming}
  onStop={() => controller.abort()}
/>`}</CodeBlock>

      <h2 className="text-2xl font-semibold mb-4">Props</h2>
      <div className="mb-8">
        <PropsTable
          rows={[
            { name: 'onSubmit', type: '(value: string) => void', description: 'Called with the trimmed value on submit' },
            { name: 'onStop', type: '() => void', description: 'While loading, the button becomes Stop and calls this' },
            { name: 'placeholder', type: 'string', defaultValue: "'Type your message...'", description: 'Textarea placeholder' },
            { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the whole input' },
            { name: 'isLoading', type: 'boolean', defaultValue: 'false', description: 'Blocks submits; enables stop state when paired with onStop' },
            { name: 'maxLength', type: 'number', description: 'Maximum character count' },
            { name: 'autoFocus', type: 'boolean', defaultValue: 'false', description: 'Focus the textarea on mount' },
            { name: 'showSendButton', type: 'boolean', defaultValue: 'true', description: 'Show/hide the action button' },
            { name: 'sendButtonText', type: 'string', defaultValue: "'Send'", description: 'Accessible label for the send button' },
            { name: 'stopButtonText', type: 'string', defaultValue: "'Stop generating'", description: 'Accessible label for the stop button' },
          ]}
        />
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Compound primitives</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Prefer a custom layout? <code className="bg-muted px-1 rounded">PromptInput</code> doubles as a
        context provider — compose <code className="bg-muted px-1 rounded">PromptInputTextarea</code>,{' '}
        <code className="bg-muted px-1 rounded">PromptInputFooter</code>,{' '}
        <code className="bg-muted px-1 rounded">PromptInputTools</code>,{' '}
        <code className="bg-muted px-1 rounded">PromptInputButton</code> (with tooltips + shortcut hints),{' '}
        <code className="bg-muted px-1 rounded">PromptInputActionAddAttachments</code>,{' '}
        <code className="bg-muted px-1 rounded">PromptInputActionDictate</code>, and the status-aware{' '}
        <code className="bg-muted px-1 rounded">PromptInputSubmit</code>.
      </p>
      <CodeBlock className="mb-8">{`<PromptInput onSubmit={send} isLoading={loading} onStop={stop} globalDrop accept="image/*,.pdf">
  <PromptInputTextarea placeholder="Ask anything..." />
  <PromptInputFooter>
    <PromptInputTools>
      <PromptInputActionAddAttachments />
      <PromptInputButton tooltip={{ content: 'Search the web', shortcut: '⌘K' }} active={search}>
        Search
      </PromptInputButton>
    </PromptInputTools>
    <PromptInputSubmit />
  </PromptInputFooter>
</PromptInput>`}</CodeBlock>

      <p className="text-sm text-muted-foreground mb-4">
        Attachment handling: drop files on the input (or anywhere with{' '}
        <code className="bg-muted px-1 rounded">globalDrop</code>), paste from clipboard, or use the
        picker. Constraints: <code className="bg-muted px-1 rounded">accept</code>,{' '}
        <code className="bg-muted px-1 rounded">maxFiles</code>,{' '}
        <code className="bg-muted px-1 rounded">maxFileSize</code>, with typed{' '}
        <code className="bg-muted px-1 rounded">onAttachmentError</code>. For custom composers, reuse the
        headless <code className="bg-muted px-1 rounded">usePromptInputAttachments</code> hook.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Accessibility & behavior</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm mb-8">
        <li>Enter submits; Shift+Enter inserts a newline.</li>
        <li>Whitespace-only input is never submitted.</li>
        <li>The icon-only button carries an accessible label (localizable).</li>
        <li>The textarea is disabled while loading, preventing double submits.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">When to use</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Any chat or agent prompt surface.</li>
        <li>Pair <code className="bg-muted px-1 rounded">onStop</code> with your request cancellation (AbortController) for long generations.</li>
      </ul>
    </div>
  );
}
