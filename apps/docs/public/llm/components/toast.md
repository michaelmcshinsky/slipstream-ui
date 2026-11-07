# Toast

Accessible notifications: tree-scoped provider/hook plus an imperative toast() API rendered by <Toaster />.

> Import: `import { ToastProvider } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/toast.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Toasts announce status changes without stealing focus. The provider/useToast pair covers tree-scoped usage; the module-level toast() + <Toaster /> covers event handlers and data layers where threading a hook is impossible (e.g. 1000+ call sites). A polite live region and auto-dismiss keep the queue quiet.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Toast heading. |
| description | `string` | — | no | Supporting line under the title. |
| variant | `'default' | 'success' | 'error' | 'warning' | 'info'` | `default` | no | Status accent (dot + optional rich tint). |
| action | `{ label: string; onClick: () => void }` | — | no | Single inline action; dismisses the toast after running. |
| duration | `number` | `5000` | no | Auto-dismiss delay in ms; 0 keeps the toast until dismissed. |
| position | `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'` | `bottom-right` | no | Toaster placement (Toaster component). |
| richColors | `boolean` | `false` | no | Tint the toast surface with its status color (Toaster component). |
| label | `string` | `Notifications` | no | Accessible name of the live region (Toaster component). |
| dismissLabel | `string` | `Dismiss notification` | no | Accessible label for each dismiss button. |

## Examples

### Imperative API

Fire from event handlers or data layers — no hook needed.

```tsx
import { Toaster, toast } from '@slipstream-ui/core';

<Toaster position="bottom-right" richColors />

toast.success('Saved', 'Your changes are live');
toast.error('Upload failed', 'Check your connection');
toast({ title: 'Heads up', duration: 0 });
```

### Tree-scoped provider

Existing provider/hook pair for component-scoped usage.

```tsx
<ToastProvider>
  <App />
</ToastProvider>;

const { toast, dismiss } = useToast();
toast({ title: 'Saved' });
```

## Anti-patterns

- **Do not use toasts for critical errors** — Auto-dismissed messages can be missed. Render persistent inline error states (role=alert) for failures the user must resolve.

## Accessibility

- **Polite live region**: Each toast renders role=status inside a labelled list; announcements never steal focus
- **Dismiss control**: Every toast has a labelled dismiss button (Dismiss <title>)
- **Auto-dismiss timing**: 5s default; duration 0 keeps sticky toasts

## Composition

- Compose with **Toaster** — Mount once near the app root next to your router; keep it outside transforms so fixed positioning is not affected
  
  ```tsx
  <App><Toaster /></App>
  ```
- Compose with **ToastProvider** — Use the provider/hook pair when the call site is inside the React tree
  
  ```tsx
  <ToastProvider><App /></ToastProvider>
  ```
- Related: Confirmation, Button

