# SegmentedControl

Single- or multi-select segmented control for view and filter switches.

> Import: `import { SegmentedControl } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/segmented-control.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Filters such as All / Investors / Advisors are often built with Tabs, which wrongly promises tabpanels. SegmentedControl provides radio semantics for single choice and pressed buttons for multi-select, with arrow-key navigation.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| options | `SegmentedOption[]` | — | yes | Segments to render: value, label, optional icon and disabled. |
| value | `string | string[]` | — | no | Controlled selection. Use string[] when multiple. |
| defaultValue | `string | string[]` | — | no | Initial selection when uncontrolled. |
| onValueChange | `(value: string | string[]) => void` | — | no | Fires with the next selection. |
| multiple | `boolean` | `false` | no | Allow more than one segment to be active. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Control density. |
| fullWidth | `boolean` | `false` | no | Stretch segments to fill the container width. |

## Examples

### Single-select audience filter

Radio semantics with arrow-key navigation.

```tsx
<SegmentedControl
  aria-label="Audience"
  value={audience}
  onValueChange={setAudience}
  options={[
    { value: 'investors', label: 'Investors' },
    { value: 'advisors', label: 'Advisors' },
    { value: 'owners', label: 'Owners' },
  ]}
/>
```

### Multi-select filter

Pressed buttons for independent filters.

```tsx
<SegmentedControl
  aria-label="Deal type"
  multiple
  defaultValue={['m&a']}
  options={[
    { value: 'm&a', label: 'M&A' },
    { value: 'debt', label: 'Debt' },
  ]}
/>
```

## Anti-patterns

- **Don't use it for tab panels** — If each segment reveals its own panel, use Tabs so aria-controls and tabpanel semantics are correct.
- **Don't omit the accessible name** — A radiogroup without a name is ambiguous. Pass aria-label or aria-labelledby.

## Accessibility

- **Single-select semantics**: Uses role=radiogroup and role=radio with aria-checked and roving tabindex
- **Keyboard**: Arrow keys move selection; Home and End jump to the first and last enabled segment
- **Multi-select semantics**: Uses role=group with aria-pressed on each segment

## Composition

- Compose with **FilterChips** — Pair a multi-select control with FilterChips to show and remove active filters
  
  ```tsx
  <><SegmentedControl multiple /><FilterChips filters={chips} /></>
  ```
- Compose with **Tabs** — Use Tabs when each option owns a tabpanel; use SegmentedControl for filters
  
  ```tsx
  <Tabs defaultValue="overview">...</Tabs>
  ```
- Related: Tabs, FilterChips, SelectMenu

