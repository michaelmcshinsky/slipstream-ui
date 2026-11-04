# ConfirmDialog

Accessible confirmation dialog with async pending state, destructive variant and cancellable actions, built on Dialog.

> Import: `import { ConfirmDialog } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/confirm-dialog.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Confirmations are copy-pasted per project (79 hand-rolled modals in the audited apps), usually without focus trapping or Escape. ConfirmDialog provides the accessible default plus a pending state for async actions.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| open | `boolean` | — | yes | Controlled visibility. |
| onOpenChange | `(open: boolean) => void` | — | yes | Open/close requests. |
| title | `string` | — | yes | Dialog title (accessible name). |
| description | `string` | — | no | Supporting line under the title. |
| confirmLabel | `string` | `Confirm` | no | Confirm button label. |
| cancelLabel | `string` | `Cancel` | no | Cancel button label. |
| destructive | `boolean` | `false` | no | Red confirm button for destructive actions. |
| onConfirm | `() => void | Promise<void>` | — | yes | Confirm handler; a promise shows a pending state. |
| closeOnConfirm | `boolean` | `true` | no | Close when the confirm handler resolves. |
| children | `ReactNode` | — | no | Extra body content above the actions. |

## Examples

### Delete confirmation

Async-safe destructive confirmation.

```tsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete project"
  description="This cannot be undone."
  destructive
  confirmLabel="Delete"
  onConfirm={deleteProject}
/>
```

## Anti-patterns

- **Don't use it for multi-field forms** — ConfirmDialog is a yes/no gate; richer flows belong in Dialog.

## Accessibility

- **Modal semantics**: Inherits Dialog's focus trap, Escape, backdrop and focus restoration
- **Pending state**: Confirm shows aria-busy while the promise runs; dismissal is blocked

## Composition

- Compose with **Dialog** — Built on Dialog; use Dialog directly for custom layouts
  
  ```tsx
  <ConfirmDialog … />
  ```
- Related: Dialog, Button, Alert

