# Tooltip

Hover/focus tooltip with aria-describedby association, delay, and Escape dismissal

> Import: `import { Tooltip } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/tooltip.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Tooltip provides supplementary context on hover and keyboard focus. It appears with a short delay, is announced via aria-describedby, and dismisses on Escape so it never traps the user.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| content | `string` | — | yes | The tooltip text |
| side | `'top' | 'bottom' | 'left' | 'right'` | `top` | no | Placement relative to the trigger |
| delay | `number` | `300` | no | Delay before showing on hover, in milliseconds |
| children | `ReactNode` | — | yes | The trigger element |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Button with tooltip

Supplementary hint on a button

```tsx
<Tooltip content="Save your changes">
  <Button>Save</Button>
</Tooltip>
```

### Custom placement

Tooltip placed to the right with a short delay

```tsx
<Tooltip content="Opens in a new tab" side="right" delay={100}>
  <a href="/docs">Docs</a>
</Tooltip>
```

## Anti-patterns

- **Don't put essential information only in a tooltip** — Tooltips are unavailable on touch devices and to keyboard users in some contexts. Required information must be visible in the UI.
- **Don't use tooltips for interactive content** — Tooltip content is not focusable; use a Popover for links or buttons inside the hint.

## Accessibility

- **aria-describedby association**: The tooltip id is linked to the trigger when visible
- **Keyboard focus support**: Shows on focus as well as hover
- **Escape dismissal**: Escape hides the tooltip without moving focus

## Composition

- Compose with **Button / IconButton** — Wrap icon-only buttons with a Tooltip to name them
  
  ```tsx
  <Tooltip content="Close"><Button aria-label="Close">×</Button></Tooltip>
  ```
- Related: Button, Label

