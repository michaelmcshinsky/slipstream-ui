# Button

A clickable button component with variants for different visual styles and sizes

> Import: `import { Button } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/button.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

The Button component is a fundamental interactive element that triggers actions or navigation. It provides visual feedback through hover/active states and supports multiple variants to match different semantic contexts (primary actions, destructive actions, navigation, etc.).

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| variant | `'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'` | `default` | no | Visual style variant of the button |
| size | `'default' | 'sm' | 'lg' | 'icon'` | `default` | no | Size variant of the button |
| asChild | `boolean` | `false` | no | When true, renders as a child component using Radix Slot for composition |
| disabled | `boolean` | `false` | no | Disables the button and prevents interaction |
| children | `ReactNode` | — | no | Content to display inside the button |
| onClick | `(event: MouseEvent<HTMLButtonElement>) => void` | — | no | Handler called when button is clicked |
| type | `'button' | 'submit' | 'reset'` | `button` | no | HTML button type attribute |

## Examples

### Primary action button

Default variant for primary actions in the interface

```tsx
<Button>Click me</Button>
```

### Destructive action

Use for destructive or dangerous actions like delete, remove, etc.

```tsx
<Button variant="destructive">Delete</Button>
```

### Outline button

Secondary action with less visual weight

```tsx
<Button variant="outline">Cancel</Button>
```

### Small button

Compact size for dense interfaces

```tsx
<Button size="sm">Small</Button>
```

### Icon button

Square button for icon-only actions

```tsx
<Button size="icon"><Icon /></Button>
```

### As link

Button styled as a link, using asChild for composition

```tsx
<Button variant="link" asChild><a href="/docs">Learn more</a></Button>
```

## Anti-patterns

- **Don't use for navigation alone** — undefined
- **Don't nest buttons** — undefined
- **Don't use vague text** — undefined

## Accessibility

- **Keyboard navigation**: Button is natively focusable and can be activated with Enter or Space key
- **Screen reader support**: Button role is automatically announced. Content is read as button label
- **Disabled state**: Disabled buttons are not focusable and screen readers announce as disabled

## Composition

- Compose with **Icon** — Buttons can contain icons alongside text or as icon-only buttons
  
  ```tsx
  <Button><Icon />Text</Button> or <Button size="icon"><Icon /></Button>
  ```
- Compose with **Dialog** — Buttons commonly trigger dialog open/close actions
  
  ```tsx
  <Button onClick={() => setOpen(true)}>Open dialog</Button>
  ```
- Related: IconButton, Link, Tooltip

