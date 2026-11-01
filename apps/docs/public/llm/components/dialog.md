# Dialog

Accessible modal dialog with focus trapping, escape-to-close and focus restoration

> Import: `import { Dialog } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/dialog.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Modals interrupt the task flow on purpose: confirmations, small forms, and destructive-action guards. The Dialog implements the full modal contract — aria-modal labelling, initial focus, a Tab focus trap, Escape and backdrop dismissal, and focus restoration to the opener — so consumers never hand-roll focus management.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| open | `boolean` | — | yes | Whether the dialog is visible (controlled) |
| onOpenChange | `(open: boolean) => void` | — | yes | Called when the user requests open/close (escape, backdrop, close button) |
| title | `string` | — | yes | Accessible dialog name, wired via aria-labelledby |
| description | `string` | — | no | Optional supporting text, wired via aria-describedby |
| closeOnBackdrop | `boolean` | `true` | no | Whether clicking the backdrop closes the dialog |
| initialFocusRef | `React.RefObject<HTMLElement | null>` | — | no | Element focused on open; defaults to the first focusable element |
| ariaLabel | `string` | — | no | Accessible label for the dialog (required for screen readers) |

## Examples

### Destructive confirmation

Controlled dialog; the opener keeps the open state.

```tsx
const [open, setOpen] = useState(false);

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Delete project?"
  description="This cannot be undone."
>
  <button onClick={confirmDelete}>Delete</button>
</Dialog>
```

## Anti-patterns

- **Do not open a dialog without a focusable control** — Users must be able to act or dismiss without a mouse. Always include at least one button inside the dialog body.

## Accessibility

- **Modal semantics**: role=dialog with aria-modal=true, aria-labelledby from the title, and aria-describedby when a description is provided.
- **Focus management**: Initial focus moves into the dialog; Tab wraps between focusable elements; focus returns to the opener on close.
- **Escape dismissal**: Escape closes the dialog via the onOpenChange callback.

## Composition

- Compose with **Button** — Dialog footers use Button for primary/secondary actions.
  
  ```tsx
  <Dialog ...><Button onClick={onConfirm}>Confirm</Button></Dialog>
  ```
- Related: Button, Toast

