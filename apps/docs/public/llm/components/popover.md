# Popover

Floating panel anchored to a trigger or a PopoverAnchor, with placement, flip and collision control, closing on outside click and Escape

> Component ID: `popover`
> Import: `import { Popover } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/popover
> Registry: https://slipstreamui.com/registry/popover.json
> Tier: molecule · Package: @slipstream-ui/core@0.11.9
> Manifest schema: v1 · manifest: v1

## Design intent

Popover displays interactive content (links, buttons, forms) in a floating panel. The panel prefers the requested side, flips when that side cannot fit, and clamps inside the viewport, so it is never clipped by the window edge or an ancestor's overflow.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| open | `boolean` | — | no | Controlled open state |
| onOpenChange | `(open: boolean) => void` | — | no | Called when the open state changes |
| children | `ReactNode` | — | yes | PopoverTrigger and PopoverContent children |
| className | `string` | — | no | Additional CSS classes to apply |
| side | `'top' | 'right' | 'bottom' | 'left'` | `bottom` | no | Preferred side of the anchor; flips to the opposite side when it cannot fit. |
| align | `'start' | 'center' | 'end'` | `start` | no | Cross-axis alignment of the panel against the anchor. |
| sideOffset | `number` | `8` | no | Gap in pixels between the anchor and the panel. |
| alignOffset | `number` | `0` | no | Nudge in pixels along the cross axis. |
| collisionPadding | `number` | `8` | no | Minimum distance the panel keeps from the viewport edges. |
| matchTriggerWidth | `boolean` | `false` | no | Set the panel width to the anchor width, for select-like panels. |

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

### Placement

The panel opens to the right and flips left when there is no room.

```tsx
<Popover>
  <PopoverTrigger>Filters</PopoverTrigger>
  <PopoverContent side="right" align="start" sideOffset={12}>
    <FilterPanel />
  </PopoverContent>
</Popover>
```

### Anchored to a field

PopoverAnchor places the panel against the field, not the wrapper.

```tsx
<Popover>
  <PopoverAnchor><Input placeholder="Pick a date" /></PopoverAnchor>
  <PopoverTrigger>Pick</PopoverTrigger>
  <PopoverContent matchTriggerWidth>
    <Calendar value={date} onValueChange={setDate} />
  </PopoverContent>
</Popover>
```

## Anti-patterns

- **Don't use Popover for plain text hints** — Use Tooltip for non-interactive hints. Popover is for interactive content.
- **Don't use Popover for critical forms or destructive actions** — Popovers close on outside click, which can interrupt form filling. Use Dialog for forms and destructive confirmations.
- **Don't build a custom floating panel** — Placement, flipping, viewport clamping, scroll anchoring and dismissal are already handled. A hand-rolled portal by definition has none of them.

## Accessibility

- **Dialog semantics**: role=dialog with aria-labelledby linking to the trigger
- **Escape dismissal**: Escape closes the popover and returns focus to the trigger

## Composition

- Compose with **PopoverTrigger** — Every Popover needs a PopoverTrigger
  
  ```tsx
  <PopoverTrigger>Open</PopoverTrigger>
  ```
- Compose with **PopoverAnchor** — Use PopoverAnchor when the panel belongs to a field rather than the trigger button
  
  ```tsx
  <PopoverAnchor><Input /></PopoverAnchor>
  ```
- Related: Tooltip, Dialog, Menu

