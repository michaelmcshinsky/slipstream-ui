# DocumentCard

Document row with file metadata, access status and an optional download action.

> Import: `import { DocumentCard } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/document-card.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Deal rooms repeat the same document row. DocumentCard keeps the file type, size, updated date, access state and download action in one consistent row.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| name | `string` | — | yes | File name. |
| fileType | `string` | — | yes | Short file type label, such as PDF or XLSX. |
| size | `string` | — | no | Human-readable file size. |
| updatedAt | `string` | — | no | Updated date or relative time. |
| status | `'available' | 'restricted' | 'pending'` | `available` | no | Access state. |
| onDownload | `() => void` | — | no | Download handler. Omit to render a display-only row. |
| downloadLabel | `string` | `Download` | no | Download button label. |
| icon | `ReactNode` | — | no | Custom file icon slot. |

## Examples

### Deal room document

A downloadable document with metadata.

```tsx
<DocumentCard
  name="Q3-financials.pdf"
  fileType="PDF"
  size="2.4 MB"
  updatedAt="Nov 1, 2026"
  onDownload={download}
/>
```

## Anti-patterns

- **Don't enable download for restricted files** — The button is disabled unless status is available; access is never implied.

## Accessibility

- **Named download**: The download button is named Download <file name>
- **Access state**: Status is a text badge and the disabled button communicates restriction

## Composition

- Compose with **Card** — DocumentCard is a compact Card row
  
  ```tsx
  <DocumentCard name="." fileType="PDF" />
  ```
- Related: Card, Badge, Button, FileUpload

