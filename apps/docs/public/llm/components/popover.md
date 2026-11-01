# Popover

Floating panel anchored to a trigger with interactive content, closing on outside click and Escape

> Import: `import { Popover } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/popover.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Popover displays interactive content (links, buttons, forms) in a floating panel. Unlike Tooltip, the content is focusable and actionable. Closes on outside click and Escape.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| open | `boolean` | — | no | Controlled open state |
| onOpenChange | `(open: boolean) => void` | — | no | Called when the open state changes |
| children | `ReactNode` | — | yes | PopoverTrigger and PopoverContent children |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Simple popover

Popover with text and a button

```tsx
<Popover>
  <PopoverTrigger>Details</PopoverTrigger>
  <PopoverContent>
    <p>More information here.</p>
    <Button size="sm">Action</Button>
  </PopoverContent>
</Popover>
```

### Controlled popover

Popover driven by parent state

```tsx
<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger>Options</PopoverTrigger>
  <PopoverContent>
    <form>...</form>
  </PopoverContent>
</Popover>
```

## Anti-patterns

- **Don't use Popover for plain text hints** — Use Tooltip for non-interactive hints. Popover is for interactive content.
- **Don't use Popover for critical forms or destructive actions** — Popovers close on outside click, which can interrupt form filling. Use Dialog for forms and destructive confirmations.

## Accessibility

- **Dialog semantics**: role=dialog with aria-labelledby linking to the trigger
- **Escape dismissal**: Escape closes the popover

## Composition

- Compose with **PopoverTrigger** — Every Popover needs a PopoverTrigger
  
  ```tsx
  <PopoverTrigger>Open</PopoverTrigger>
  ```
- Related: Tooltip, Dialog, Menu

