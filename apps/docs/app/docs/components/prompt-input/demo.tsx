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
import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
import { DemoCard } from "@/components/demo-card";
export default function PromptInputPage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
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
    <ComponentPage
        manifest={manifest}
      id="prompt-input"
      title="PromptInput"
      description="Auto-resizing chat input with Enter-to-send, Shift+Enter for newlines, and a stop-generation button while a response is in flight. Also composes as a compound primitive set for custom layouts."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        {
          name: "onSubmit",
          type: "(value: string) => void",
          description: "Called with the trimmed value on submit",
        },
        {
          name: "onStop",
          type: "() => void",
          description: "While loading, the button becomes Stop and calls this",
        },
        {
          name: "placeholder",
          type: "string",
          defaultValue: "'Type your message...'",
          description: "Textarea placeholder",
        },
        {
          name: "disabled",
          type: "boolean",
          defaultValue: "false",
          description: "Disables the whole input",
        },
        {
          name: "isLoading",
          type: "boolean",
          defaultValue: "false",
          description:
            "Blocks submits; enables stop state when paired with onStop",
        },
        {
          name: "attachments",
          type: "AttachmentItem[]",
          description:
            "Externally owned attachment queue; omit for managed drag/drop + paste",
        },
        {
          name: "onRemoveAttachment",
          type: "(attachment: AttachmentItem) => void",
          description: "Called when an attachment is removed",
        },
        {
          name: "onAttachmentsChange",
          type: "(attachments: AttachmentItem[]) => void",
          description: "Called whenever the managed attachment queue changes",
        },
        {
          name: "hasError",
          type: "boolean",
          defaultValue: "false",
          description: "Marks submission as failed; the send control reflects the error state",
        },
        {
          name: "accept",
          type: "string",
          description: "Accepted file types for attachments (e.g. 'image/*,.pdf')",
        },
        {
          name: "multiple",
          type: "boolean",
          defaultValue: "false",
          description: "Allow multiple file selection",
        },
        {
          name: "maxFiles",
          type: "number",
          description: "Maximum number of attachments",
        },
        {
          name: "maxFileSize",
          type: "number",
          description: "Maximum size per attachment in bytes",
        },
        {
          name: "onAttachmentError",
          type: "(error) => void",
          description: "Called when an attachment fails validation",
        },
        {
          name: "globalDrop",
          type: "boolean",
          defaultValue: "false",
          description: "Accept file drops anywhere on the document",
        },
        {
          name: "maxLength",
          type: "number",
          description: "Maximum character count",
        },
        {
          name: "autoFocus",
          type: "boolean",
          defaultValue: "false",
          description: "Focus the textarea on mount",
        },
        {
          name: "showSendButton",
          type: "boolean",
          defaultValue: "true",
          description: "Show/hide the action button",
        },
        {
          name: "sendButtonText",
          type: "string",
          defaultValue: "'Send'",
          description:
            "Accessible label for the built-in send button (simple mode; compound PromptInputSubmit uses its own labels)",
        },
        {
          name: "stopButtonText",
          type: "string",
          defaultValue: "'Stop generating'",
          description:
            "Accessible label for the built-in stop button (simple mode; compound PromptInputSubmit uses its own labels)",
        },
        {
          name: "density",
          type: "'comfortable' | 'compact'",
          defaultValue: "'comfortable'",
          description: "Composer padding and minimum height",
        },
        {
          name: "surface",
          type: "'default' | 'none' | 'card' | 'muted'",
          defaultValue: "'default'",
          description: "Field surface: bordered input, no fill, or a tinted panel",
        },
        {
          name: "className",
          type: "string",
          description: "Extra classes for the root element",
        },
        {
          name: "children",
          type: "ReactNode",
          description: "Compound primitives for custom layouts (PromptInputTextarea, PromptInputFooter, …)",
        },
      ]}
      accessibility={[
        "Enter submits; Shift+Enter inserts a newline.",
        "Whitespace-only input is never submitted.",
        "The icon-only button carries an accessible label (localizable).",
        "The textarea is disabled while loading, preventing double submits.",
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
    </ComponentPage>
  );
}
