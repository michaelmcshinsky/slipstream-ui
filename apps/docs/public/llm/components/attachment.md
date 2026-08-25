# Attachment / AttachmentList

File chips for prompts and messages. `Attachment` renders one file; `AttachmentList` renders a wrapping row. Display-only: upload and file-system logic stay in the consumer.

> Import: `import { Attachment/AttachmentList } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/attachment.json
> Tier: molecule · Package: @slipstream-ui/ai

## Design intent

Show what files are part of a conversation turn (name, size, type, thumbnail, upload status) without coupling the library to any upload implementation.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| attachment | `AttachmentItem` | — | yes | File descriptor: id, name, size, type, previewUrl, status. |
| attachments | `AttachmentItem[]` | — | yes | Files to display (AttachmentList). |
| onRemove | `(attachment) => void` | — | no | Remove callback; omit to hide remove controls. |

## Examples

### Prompt attachments

```tsx
<AttachmentList attachments={[{ id: '1', name: 'spec.pdf', size: '2.4 MB', status: 'done' }]} onRemove={remove} />
```

### Uploading image

```tsx
<Attachment attachment={{ id: '2', name: 'chart.png', previewUrl: '/chart.png', status: 'uploading' }} />
```

## Anti-patterns

- **Do not use Attachment for drag-and-drop targets** — The chip displays an existing item; build dropzones in the consumer and render AttachmentList once items exist.

## Accessibility

- **Remove control**: Icon-only remove button has an aria-label including the file name.
- **Upload status**: Uploading state is announced via role=status.
- **Decorative thumbnails**: Preview images are aria-hidden; the file name carries the meaning.

