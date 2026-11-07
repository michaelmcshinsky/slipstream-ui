# FilterPanel

Structured filter panel with collapsible sections and reset/apply actions.

> Import: `import { FilterPanel } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/filter-panel.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Dashboards and directories need a consistent filter surface that works in a sidebar and a mobile drawer. FilterPanel owns section expansion and footer actions while the caller keeps filter values.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| sections | `FilterSection[]` | — | yes | Filter groups: title, optional description, content and defaultOpen. |
| title | `string` | `Filters` | no | Panel heading. |
| description | `string` | — | no | Supporting copy under the panel heading. |
| onReset | `() => void` | — | no | Reset action shown in the footer. |
| onApply | `() => void` | — | no | Apply action shown in the footer. |
| resetLabel | `string` | `Reset` | no | Reset button label. |
| applyLabel | `string` | `Apply` | no | Apply button label. |
| collapsible | `boolean` | `true` | no | Allow sections to collapse. |
| defaultOpen | `string[]` | — | no | Section titles open on first render. |
| actions | `ReactNode` | — | no | Extra footer content. |
| as | `'div' | 'aside' | 'section'` | `div` | no | Semantic element to render. |

## Examples

### Deal filters

A sidebar filter panel with collapsible sections.

```tsx
<FilterPanel
  title="Deal filters"
  onReset={reset}
  onApply={apply}
  sections={[
    { title: 'Industry', content: <MultiSelect ... />, defaultOpen: true },
    { title: 'Revenue', content: <RangeSlider ... /> },
  ]}
/>
```

## Anti-patterns

- **Don't own filter values in the panel** — FilterPanel is layout and disclosure only. Keep values in the page or a filter hook so applied filters can be shared with the URL and chips.

## Accessibility

- **Disclosure**: Each section header is a button with aria-expanded and aria-controls
- **Heading structure**: Panel title is h2 and section titles are h3

## Composition

- Compose with **Drawer** — Render the panel inside a Drawer on mobile
  
  ```tsx
  <Drawer title="Filters"><FilterPanel ... /></Drawer>
  ```
- Related: MultiSelect, RangeSlider, DateRangePicker, AppliedFilters, FilterBar

