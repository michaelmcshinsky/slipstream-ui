"use client";
import { useRef, useState } from "react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputActionAddAttachments,
  PromptInputSubmit,
} from "@slipstream-ui/ai";
import { DemoCard } from "@/components/demo-card";
export default function Demo() {
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
    setSubmitted((prev) => [...prev, "(generation stopped)"]);
  };
  return (
    <>
      

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
        usage={`import { PromptInput } from '@slipstream-ui/ai';

// Enter submits, Shift+Enter adds a newline; whitespace-only input is ignored.
// hasError flags a failed submission on the send control; maxLength caps input;
// disabled freezes the whole composer.`}
        types={`type PromptInputProps = {
  onSubmit: (value: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  maxLength?: number;
  placeholder?: string;
  // …attachment queue, density/surface and compound children props
};`}
      />

      <DemoCard
        title="Compound primitives"
        preview={
          <div className="w-full max-w-md">
            

            <PromptInput
              onSubmit={() => {}}
              globalDrop
              accept="image/*,.pdf"
              maxFiles={3}
            >
              

              <PromptInputTextarea placeholder="Ask anything… (⏎ to send)" />

              <PromptInputFooter>
                

                <PromptInputTools>
                  

                  <PromptInputActionAddAttachments />

                  <PromptInputButton
                    tooltip={{ content: "Search the web", shortcut: "⌘K" }}
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

      <DemoCard
        title="Error, limit and disabled states"
        preview={
          <div className="flex w-full flex-col gap-4">
            <PromptInput
              onSubmit={() => {}}
              hasError
              placeholder="Submission failed — try again"
            />
            <PromptInput
              onSubmit={() => {}}
              maxLength={40}
              placeholder="Max 40 characters"
            />
            <PromptInput
              onSubmit={() => {}}
              disabled
              placeholder="Composer disabled"
            />
          </div>
        }
        code={`<PromptInput onSubmit={send} hasError />        {/* failed submit state */}
<PromptInput onSubmit={send} maxLength={40} />   {/* character cap */}
<PromptInput onSubmit={send} disabled />        {/* frozen composer */}`}
        usage={`// hasError marks the last submission as failed on the send control.
// maxLength caps input length; disabled blocks editing and submission.`}
      />
    </>
  );
}
