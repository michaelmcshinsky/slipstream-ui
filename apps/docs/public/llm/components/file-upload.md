# FileUpload

Drag-and-drop file picker with a removable file list and per-file progress bars.

> Import: `import { FileUpload } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/file-upload.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

File inputs are hard to style and easy to make inaccessible. FileUpload keeps the native input as the real control, adds a drop zone as an enhancement, and exposes plain File objects so the transport and progress stay yours.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| files | `File[]` | — | no | Controlled selection. |
| defaultFiles | `File[]` | — | no | Initial selection when uncontrolled. |
| onFilesChange | `(files: File[]) => void` | — | no | Fired on add, drop, remove. |
| label | `string` | `Drop files here or click to browse` | no | Drop-zone copy. |
| hint | `string` | — | no | Helper line under the drop zone. |
| progress | `Record<string, number>` | — | no | Per-file progress 0-100 keyed by file name; renders progress bars. |

## Examples

### Attachments with progress

Native input + drop zone + progress.

```tsx
<FileUpload
  aria-label="Attachments"
  accept=".pdf,.csv"
  progress={{ 'report.pdf': 42 }}
  onFilesChange={setFiles}
/>
```

## Anti-patterns

- **Don't hide the input from the a11y tree** — The label targets the real input, keeping keyboard and mobile file dialogs working.

## Accessibility

- **Native control**: Visible label targets a real (sr-only) file input
- **Progress**: Each uploading file exposes role=progressbar with a name

## Composition

- Compose with **FormField** — Wrap for label/error wiring
  
  ```tsx
  <FormField id="files" label="Attachments"><FileUpload /></FormField>
  ```
- Related: Attachment, FormField, Progress

