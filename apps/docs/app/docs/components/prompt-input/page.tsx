'use client';

import { useRef, useState } from 'react';
import { PromptInput } from '@slipstream-ui/ai';

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

      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-8">
        <code>{`import { PromptInput } from '@slipstream-ui/ai';

// Basic
<PromptInput onSubmit={(text) => send(text)} />

// Cancellable generation: send button becomes a stop button while loading
<PromptInput
  onSubmit={send}
  isLoading={isStreaming}
  onStop={() => controller.abort()}
/>`}</code>
      </pre>

      <h2 className="text-2xl font-semibold mb-4">Props</h2>
      <div className="rounded-lg border border-border overflow-hidden mb-8">
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
            {[
              ['onSubmit', '(value: string) => void', '—', 'Called with the trimmed value on submit'],
              ['onStop', '() => void', '—', 'While loading, the button becomes Stop and calls this'],
              ['placeholder', 'string', "'Type your message...'", 'Textarea placeholder'],
              ['disabled', 'boolean', 'false', 'Disables the whole input'],
              ['isLoading', 'boolean', 'false', 'Blocks submits; enables stop state when paired with onStop'],
              ['maxLength', 'number', '—', 'Maximum character count'],
              ['autoFocus', 'boolean', 'false', 'Focus the textarea on mount'],
              ['showSendButton', 'boolean', 'true', 'Show/hide the action button'],
              ['sendButtonText', 'string', "'Send'", 'Accessible label for the send button'],
              ['stopButtonText', 'string', "'Stop generating'", 'Accessible label for the stop button'],
            ].map(([prop, type, def, desc]) => (
              <tr key={prop} className="border-t border-border">
                <td className="p-3 font-mono">{prop}</td>
                <td className="p-3 font-mono text-xs">{type}</td>
                <td className="p-3 font-mono text-xs">{def}</td>
                <td className="p-3">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
