# Separator

A visual divider between content blocks, decorative or semantic

> Import: `import { Separator } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/separator.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Separator creates visual rhythm between content groups. By default it is decorative; pass a label to make it a semantic divider that assistive tech can announce.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| orientation | `'horizontal' | 'vertical'` | `horizontal` | no | Direction of the divider line |
| label | `string` | — | no | Accessible name; when set, the separator becomes semantic |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Horizontal divider

Simple line between sections

```tsx
<div>Section A</div>
<Separator className="my-4" />
<div>Section B</div>
```

### Vertical divider

Vertical line between actions

```tsx
<div className="flex items-center gap-4">
  <Button>Save</Button>
  <Separator orientation="vertical" className="h-6" />
  <Button variant="ghost">Cancel</Button>
</div>
```

## Anti-patterns

- **Don't use Separator to create layout spacing** — Use margin/gap for spacing; Separator is for visual division.

## Accessibility

- **Decorative by default**: role="none" so screen readers skip unlabeled separators
- **Semantic separator**: role="separator" with aria-label when labelled

## Composition

- Compose with **Section headings** — Separators pair with headings to divide long pages
  
  ```tsx
  <h2>Settings</h2><Separator className="my-4" />
  ```
- Related: Skeleton

