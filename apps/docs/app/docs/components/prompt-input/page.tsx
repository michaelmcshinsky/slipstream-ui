import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/prompt-input', {
  title: "PromptInput",
  description: "Auto-resizing chat input with Enter-to-send, Shift+Enter for newlines, and a stop-generation button while a response is in flight. Also composes as a compound primitive set for custom layouts.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('prompt-input')}
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
      <Demo />
    </ComponentPage>
  );
}
