# ListToolbar

Slim result bar for filtered lists: count, page position, sort note, and slots for a view switch and sort control.

> Component ID: `list-toolbar`
> Import: `import { ListToolbar } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/list-toolbar
> Registry: https://slipstreamui.com/registry/list-toolbar.json
> Tier: atom · Package: @slipstream-ui/core@0.11.10
> Manifest schema: v1 · manifest: v1

## Design intent

Every directory rebuilds the same row above its results: "42 events · Page 2 of 5" on the left, a grid/list SegmentedControl and a sort Select on the right. ListToolbar fixes that layout so the summary stays consistent and screen readers hear count changes.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| count | `number` | — | no | Number of matching results; renders "{count} {countLabel}". |
| countLabel | `string` | `results` | no | Noun for the result count. |
| position | `ReactNode` | — | no | Page or range position, e.g. "Page 2 of 5" or "Showing 21–40 of 137". |
| note | `ReactNode` | — | no | Muted note after the position, e.g. "Sorted by date, soonest first". |
| align | `'between' | 'start' | 'center' | 'end'` | `between` | no | Distribution of summary and controls. |
| children | `ReactNode` | — | no | Controls rendered at the far end: SegmentedControl view switch, sort Select. |

## Examples

### Directory result bar

Count and position on the left; view switch and sort on the right.

```tsx
<ListToolbar
  count={events.length}
  countLabel="events"
  position={"Page " + page + " of " + pages}
  note="Sorted by date, soonest first"
>
  <SegmentedControl
    options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]}
    value={view}
    onValueChange={setView}
  />
  <Select label="Sort" options={sortOptions} value={sort} onValueChange={setSort} />
</ListToolbar>
```

## Anti-patterns

- **Don't put filter inputs in the bar** — ListToolbar summarizes results; search fields and filter selects belong in FilterBar above it. Children is for the view switch and sort control only.

## Accessibility

- **Live result count**: The summary line is aria-live=polite so filtering announces the new count

## Composition

- Compose with **SegmentedControl** — Link-mode SegmentedControl is the canonical grid/list view switch
  
  ```tsx
  <ListToolbar …><SegmentedControl options={views} value={view} onValueChange={setView} /></ListToolbar>
  ```
- Compose with **Select** — Sort control renders in children
  
  ```tsx
  <ListToolbar …><Select label="Sort" … /></ListToolbar>
  ```
- Compose with **FilterBar** — FilterBar owns the input row above; ListToolbar owns the result summary below it
  
  ```tsx
  <FilterBar … />
<ListToolbar … />
{results}
  ```
- Related: FilterBar, SegmentedControl, Select, Pagination, EmptyState

