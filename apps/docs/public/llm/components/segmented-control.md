# SegmentedControl

Single- or multi-select segmented control for view and filter switches.

> Component ID: `segmented-control`
> Import: `import { SegmentedControl } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/segmented-control
> Registry: https://slipstreamui.com/registry/segmented-control.json
> Tier: molecule · Package: @slipstream-ui/core@0.11.8
> Manifest schema: v1 · manifest: v1

## Design intent

Filters such as All / Investors / Advisors are often built with Tabs, which wrongly promises tabpanels. SegmentedControl provides radio semantics for single choice and pressed buttons for multi-select, with arrow-key navigation.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| options | `SegmentedOption[]` | — | yes | Segments to render: value, label, optional icon, disabled, and href. An option with href renders as a link (view-switch navigation that survives refresh and works without JavaScript); the active segment becomes a non-link aria-current="page" marker. |
| value | `string | string[]` | — | no | Controlled selection. Use string[] when multiple. |
| defaultValue | `string | string[]` | — | no | Initial selection when uncontrolled. |
| onValueChange | `(value: string | string[]) => void` | — | no | Fires with the next selection. |
| multiple | `boolean` | `false` | no | Allow more than one segment to be active. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Control density. |
| fullWidth | `boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` | `false` | no | Stretch segments to fill the container width. A breakpoint string fills only below that breakpoint and hugs content at and above it. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers (Next Link, react-router Link). Used by options that set href. |
| linkHrefProp | `'href' | 'to'` | `href` | no | Prop used to pass the destination to linkComponent. |

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

### URL-backed view switch

Options with href render as links; the active segment is an aria-current marker. Use for server-rendered view switches.

```tsx
<SegmentedControl
  aria-label="View"
  value={view}
  options={[
    { value: 'list', label: 'List', href: '/items?view=list' },
    { value: 'grid', label: 'Grid', href: '/items?view=grid' },
  ]}
/>
```

## Anti-patterns

- **Don't use it for tab panels** — If each segment reveals its own panel, use Tabs so aria-controls and tabpanel semantics are correct.
- **Don't omit the accessible name** — A radiogroup without a name is ambiguous. Pass aria-label or aria-labelledby.

## Accessibility

- **Single-select semantics**: Uses role=radiogroup and role=radio with aria-checked and roving tabindex
- **Keyboard**: Arrow keys move selection; Home and End jump to the first and last enabled segment
- **Link mode**: Options with href render anchors (or linkComponent); the active segment is a non-link aria-current="page" marker and the container uses role=group since links cannot be radios
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

