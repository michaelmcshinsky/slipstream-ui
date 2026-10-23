# Spinner

Indeterminate loading indicator with accessible status semantics.

> Import: `import { Spinner } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/spinner.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Communicate in-progress states without layout shift; inherit text color so it adapts to any context.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| size | `'sm' | 'default' | 'lg'` | `default` | no | Visual size of the spinner. |
| label | `string` | `Loading...` | no | Screen-reader label; the visual ring is aria-hidden. |

## Examples

### Default

```tsx
<Spinner />
```

### Inline loading state

```tsx
<span className="flex items-center gap-2"><Spinner size="sm" /> Generating...</span>
```

### Decorative (near visible text)

```tsx
<Spinner aria-hidden label="" />
```

## Anti-patterns

- **Do not use multiple spinners for one wait state** — One status indicator per operation; multiple role=status elements announce redundantly.

## Accessibility

- **Status semantics**: role=status with sr-only label announces loading to screen readers.
- **Reduced motion**: Pair with motion-reduce utilities when animation must be suppressed.

