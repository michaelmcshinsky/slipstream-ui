# FormLayout

Groups form fields with even, tokenized spacing: vertical stack, horizontal row, or 1-4 column grid, optionally as a semantic fieldset.

> Import: `import { FormLayout } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/form-layout.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Field rhythm is the difference between a form that scans and one that doesn't. FormLayout owns the ARRANGEMENT (stack/row/grid + exact gap) while Fieldset owns the group semantics (legend) and FormField owns per-control wiring — three small pieces instead of one magic wrapper.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| layout | `'stack' | 'row' | 'grid'` | `stack` | no | Grouping layout: even vertical stack, horizontal row, or column grid. |
| columns | `1 | 2 | 3 | 4` | `2` | no | Grid column count (literal classes survive CSS purging). |
| gap | `'none' | 'sm' | 'md' | 'lg' | 'xl' | number` | — | no | Even spacing between children — token or exact pixels (16). |
| legend | `string` | — | no | Group label rendered as a semantic <legend> (fieldset mode). |
| description | `string` | — | no | Supporting line under the legend (fieldset mode). |
| as | `'div' | 'fieldset'` | `div` | no | Render as a semantic fieldset when the layout names a group of controls. |

## Examples

### Two-column settings grid

Exact 16px gaps; fields wrap into rows of two.

```tsx
<FormLayout layout="grid" columns={2} gap={16} as="fieldset" legend="Profile">
  <FormField id="first" label="First name"><Input /></FormField>
  <FormField id="last" label="Last name"><Input /></FormField>
  <FormField id="email" label="Email"><Input type="email" /></FormField>
</FormLayout>
```

### Inline action row

```tsx
<FormLayout layout="row" gap="sm">
  <FormField id="q" label="Search"><Input type="search" /></FormField>
  <Button type="submit">Go</Button>
</FormLayout>
```

## Anti-patterns

- **Don't hand-roll spacer divs** — Empty divs with heights drift from the token scale and break under different densities — gap exists for spacing.
- **Don't use fieldset mode without a legend** — as="fieldset" without legend renders an unnamed group — assistive tech announces nothing useful. Prefer div, or provide the legend.

## Accessibility

- **Fieldset mode gives the group a name**: legend renders as a real <legend>; use it whenever the layout wraps related controls
- **Reading order equals DOM order**: Row/grid layouts reflow visually; source order never changes

## Composition

- Compose with **FormField** — FormLayout arranges the fields; each field keeps its own FormField wiring
  
  ```tsx
  <FormLayout layout="grid" columns={2}><FormField …>…</FormField></FormLayout>
  ```
- Compose with **Form** — Layouts live inside a Form (or standalone for filter bars)
- Compose with **Fieldset** — Fieldset when the legend/grouping IS the point; FormLayout when spacing/arrangement is
- Related: FormField, Form, Fieldset, Grid

