#!/usr/bin/env node
/**
 * One-time manifest reconciliation: adds props that exist in TypeScript
 * interfaces but are missing from COMPONENT_MANIFEST files, and removes
 * props that no longer exist in TypeScript.
 *
 * After running this, `pnpm validate:manifests` should pass cleanly and
 * the manifests become the accurate agent-facing spec they claim to be.
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '..');

type PropEntry = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  defaultValue?: string;
  examples?: unknown[];
};

/** Props to add per manifest id, with accurate types and descriptions. */
const ADDITIONS: Record<string, PropEntry[]> = {
  conversation: [
    { name: 'showScrollButton', type: 'boolean', defaultValue: 'true', required: false, description: 'Show the scroll-to-latest button when the user scrolls up' },
    { name: 'showDownload', type: 'boolean', defaultValue: 'true', required: false, description: 'Show the transcript download action' },
    { name: 'messageErrors', type: 'Record<string, string>', required: false, description: 'Map of message id to error text; renders an error card on that message' },
    { name: 'onRetryMessage', type: '(message: MessageData) => void', required: false, description: 'Called when the user retries a failed message' },
    { name: 'welcomeTitle', type: 'string', required: false, description: 'Title shown in the empty/welcome state' },
    { name: 'welcomeDescription', type: 'string', required: false, description: 'Supporting text in the welcome state' },
    { name: 'welcomeSuggestions', type: 'string[]', required: false, description: 'Starter prompts shown in the welcome state' },
    { name: 'onWelcomeSelect', type: '(prompt: string) => void', required: false, description: 'Called when a welcome suggestion is clicked' },
    { name: 'hasMoreHistory', type: 'boolean', required: false, description: 'Whether older history pages exist (enables infinite scroll)' },
    { name: 'isLoadingMore', type: 'boolean', required: false, description: 'Whether a history page is currently loading' },
    { name: 'onLoadMore', type: '() => void', required: false, description: 'Called when the user scrolls to the top to load older messages' },
  ],
  message: [
    { name: 'error', type: 'string', required: false, description: 'Error text to render on the message; shows an error card with retry' },
    { name: 'onRetry', type: '() => void', required: false, description: 'Called when the user requests a retry after error; omit to hide the action' },
    { name: 'labels', type: '{ retry?: string; edit?: string; save?: string; cancel?: string }', required: false, description: 'Override button labels in the message actions' },
    { name: 'onEditContent', type: '(content: string) => void', required: false, description: 'Enables edit-and-resubmit; called with the edited content' },
  ],
  'prompt-input': [
    { name: 'attachments', type: 'AttachmentItem[]', required: false, description: 'Controlled attachment list shown as chips above the input' },
    { name: 'onRemoveAttachment', type: '(id: string) => void', required: false, description: 'Called when the user removes an attachment chip' },
    { name: 'onAttachmentsChange', type: '(attachments: AttachmentItem[]) => void', required: false, description: 'Called when files are added via drag-and-drop, paste, or picker' },
    { name: 'hasError', type: 'boolean', required: false, description: 'Styles the input in an error state (e.g. after a rejected file)' },
    { name: 'accept', type: 'string', required: false, description: 'MIME types accepted for attachments (e.g. "image/*")' },
    { name: 'multiple', type: 'boolean', required: false, description: 'Allow selecting multiple files' },
    { name: 'maxFiles', type: 'number', required: false, description: 'Maximum number of attachments allowed' },
    { name: 'maxFileSize', type: 'number', required: false, description: 'Maximum file size in bytes; rejects larger files' },
    { name: 'onAttachmentError', type: '(error: string) => void', required: false, description: 'Called when an attachment is rejected (size, type, or count limit)' },
    { name: 'globalDrop', type: 'boolean', required: false, description: 'Enable drop-anywhere-on-page file acceptance' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Custom content rendered inside the input row (e.g. tool buttons)' },
  ],
  reasoning: [
    { name: 'duration', type: 'number', required: false, description: 'Elapsed reasoning time in seconds; renders a duration chip' },
    { name: 'isStreaming', type: 'boolean', required: false, description: 'Shows a streaming indicator while reasoning is in progress' },
  ],
  source: [
    { name: 'source', type: 'SourceItem', required: false, description: 'The single source to render (Source component)' },
    { name: 'onSelect', type: '(source: SourceItem) => void', required: false, description: 'Called when the source chip is clicked' },
  ],
};

/** Props to remove per manifest id (no longer in TypeScript). */
const REMOVALS: Record<string, string[]> = {
  source: ['sources', 'maxDisplay', 'label'],
};

/** Prop entries for Source/Sources split — the manifest documents both exports. */
const SOURCE_MANIFEST_EXTRA: PropEntry[] = [
  { name: 'sources', type: 'SourceItem[]', required: true, description: 'List of sources to render (Sources component)' },
  { name: 'maxDisplay', type: 'number', defaultValue: '3', required: false, description: 'Maximum number of source chips to show before collapsing (Sources component)' },
  { name: 'label', type: 'string', defaultValue: 'Sources', required: false, description: 'Section label above the source list (Sources component)' },
];

function manifestPath(id: string): string {
  const pkg = ['message', 'conversation', 'prompt-input', 'reasoning', 'source'].includes(id) ? 'ai' : 'core';
  return path.join(ROOT, 'packages', pkg, 'src', 'manifests', `${id}.manifest.json`);
}

function main(): void {
  for (const [id, additions] of Object.entries(ADDITIONS)) {
    const filePath = manifestPath(id);
    if (!fs.existsSync(filePath)) {
      console.error(`✗ Manifest not found for ${id}: ${filePath}`);
      continue;
    }
    const manifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Add missing props.
    const existing = new Set<string>((manifest.props ?? []).map((p: { name: string }) => p.name));
    manifest.props = manifest.props ?? [];
    for (const prop of additions) {
      if (!existing.has(prop.name)) {
        manifest.props.push(prop);
        console.log(`+ ${id}: added prop "${prop.name}"`);
      }
    }

    // Remove stale props.
    const removals = REMOVALS[id] ?? [];
    if (removals.length > 0) {
      manifest.props = manifest.props.filter((p: { name: string }) => !removals.includes(p.name));
      for (const name of removals) console.log(`- ${id}: removed stale prop "${name}"`);
    }

    // Source manifest documents both Source and Sources exports.
    if (id === 'source') {
      const now = new Set<string>(manifest.props.map((p: { name: string }) => p.name));
      for (const prop of SOURCE_MANIFEST_EXTRA) {
        if (!now.has(prop.name)) {
          manifest.props.push(prop);
          console.log(`+ ${id}: added prop "${prop.name}"`);
        }
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`✓ ${id} manifest updated`);
  }

  // Dialog: add ariaLabel.
  const dialogPath = path.join(ROOT, 'packages', 'core', 'src', 'manifests', 'dialog.manifest.json');
  if (fs.existsSync(dialogPath)) {
    const manifest = JSON.parse(fs.readFileSync(dialogPath, 'utf8'));
    manifest.props = manifest.props ?? [];
    const existing = new Set<string>(manifest.props.map((p: { name: string }) => p.name));
    if (!existing.has('ariaLabel')) {
      manifest.props.push({
        name: 'ariaLabel',
        type: 'string',
        required: true,
        description: 'Accessible label for the dialog (required for screen readers)',
      });
      console.log('+ dialog: added prop "ariaLabel"');
      fs.writeFileSync(dialogPath, JSON.stringify(manifest, null, 2) + '\n');
      console.log('✓ dialog manifest updated');
    }
  }
}

main();
