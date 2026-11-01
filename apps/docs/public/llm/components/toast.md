# Toast

Accessible app-level notifications announced through a polite live region, with auto-dismiss, stacking and optional actions

> Import: `import { ToastProvider } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/toast.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Applications need lightweight feedback that does not steal focus. Toasts render into a labelled polite live region so screen readers announce them, stack newest-first, auto-dismiss on a timer, and support one optional action (typically undo).

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Short heading announced with the toast |
| description | `string` | — | no | Optional supporting detail |
| action | `{ label: string; onClick: () => void }` | — | no | Optional inline action; invoking it dismisses the toast |
| duration | `number` | `5000` | no | Auto-dismiss delay in ms; 0 keeps the toast until dismissed |

## Examples

### Basic toast with useToast

Wrap your app in ToastProvider once; call toast() anywhere below it.

```tsx
'use client';

import { ToastProvider, useToast } from '@/components/slipstream/toast';

function SaveButton() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Saved', description: 'Your changes are live.' })}>
      Save
    </button>
  );
}

export function App() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}
```

### Undo action

duration: 0 keeps the toast until the user acts or dismisses it.

```tsx
toast({
  title: 'License revoked',
  action: { label: 'Undo', onClick: restore },
  duration: 0,
});
```

## Anti-patterns

- **Do not use toasts for critical errors** — Auto-dismissed messages can be missed. Render persistent inline error states (role=alert) for failures the user must resolve.

## Accessibility

- **Screen reader announcements**: Each toast renders inside role=status (implicit aria-live=polite) within a labelled list container.
- **Keyboard dismiss**: Toast content is regular DOM; buttons inside toasts are reachable and activatable with the keyboard.

## Composition

- Compose with **Confirmation** — Use Confirmation for destructive actions before they happen; use Toast to report the result after.
- Related: Confirmation, Button

