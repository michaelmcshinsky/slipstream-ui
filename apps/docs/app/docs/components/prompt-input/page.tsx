'use client';

import { useRef, useState } from 'react';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputActionAddAttachments,
  PromptInputSubmit,
} from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function PromptInputPage() {
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState(false);
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
    <ComponentPage
      id="prompt-input"
      title="PromptInput"
      description="Auto-resizing chat input with Enter-to-send, Shift+Enter for newlines, and a stop-generation button while a response is in flight. Also composes as a compound primitive set for custom layouts."
      propsRows={[
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
      accessibility={[
        'Enter submits; Shift+Enter inserts a newline.',
        'Whitespace-only input is never submitted.',
        'The icon-only button carries an accessible label (localizable).',
        'The textarea is disabled while loading, preventing double submits.',
      ]}
    >
      <DemoCard
        title="Basic"
        preview={
          <div className="w-full">
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
        }
        code={`import { PromptInput } from '@slipstream-ui/ai';

// Basic
<PromptInput onSubmit={(text) => send(text)} />

// Cancellable generation: send button becomes a stop button while loading
<PromptInput
  onSubmit={send}
  isLoading={isStreaming}
  onStop={() => controller.abort()}
/>`}
      />
      <DemoCard
        title="Compound primitives"
        preview={
          <div className="w-full max-w-md">
            <PromptInput onSubmit={() => {}} globalDrop accept="image/*,.pdf" maxFiles={3}>
              <PromptInputTextarea placeholder="Ask anything… (⏎ to send)" />
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputActionAddAttachments />
                  <PromptInputButton
                    tooltip={{ content: 'Search the web', shortcut: '⌘K' }}
                    active={search}
                    onClick={() => setSearch((value) => !value)}
                  >
                    <span aria-hidden="true">◎</span> Search
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit />
              </PromptInputFooter>
            </PromptInput>
          </div>
        }
        code={`import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputActionAddAttachments,
  PromptInputSubmit,
} from '@slipstream-ui/ai';

<PromptInput onSubmit={send} isLoading={loading} onStop={stop} globalDrop accept="image/*,.pdf">
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
</PromptInput>`}
      />
    </ComponentPage>
  );
}
