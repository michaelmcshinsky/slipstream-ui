# MonthSchedule

Month grid that shows dated events inside each day, with a type legend and a small-screen agenda — the schedule counterpart to Calendar's date picker.

> Component ID: `month-schedule`
> Import: `import { MonthSchedule } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/month-schedule
> Registry: https://slipstreamui.com/registry/month-schedule.json
> Tier: organism · Package: @slipstream-ui/core@0.11.9
> Manifest schema: v1 · manifest: v1

## Design intent

Directories need to show events inside days, not just pick one. MonthSchedule reuses Calendar's date utilities (ISO keys, calendarWeeks, explicit today) so server-rendered pages stay deterministic, and collapses to an agenda list below a breakpoint where day cells get too cramped.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| events | `T[]` | — | yes | Events to place inside days; each is dated via getDate. |
| getDate | `(event: T) => string` | — | yes | ISO date key (YYYY-MM-DD) for an event. |
| getLabel | `(event: T) => string` | — | yes | Short label shown on the day chip and in the agenda. |
| getType | `(event: T) => string` | — | no | Optional type key used for chip color and legend matching. |
| getHref | `(event: T) => string` | — | no | Optional destination per event. |
| month | `string` | — | no | Controlled month as YYYY-MM; falls back to defaultMonth, then today. |
| defaultMonth | `string` | — | no | Uncontrolled initial month (YYYY-MM). |
| onMonthChange | `(month: string) => void` | — | no | Called with the new YYYY-MM when paging. |
| today | `string` | — | no | Override "today" for deterministic server rendering and tests. |
| locale | `string` | `en-US` | no | BCP-47 locale for month, weekday and agenda labels. |
| weekStartsOn | `0 | 1` | `0` | no | 0 starts the week on Sunday, 1 on Monday. |
| maxPerDay | `number` | `3` | no | Maximum event chips per day before collapsing into "+N more". |
| legend | `MonthScheduleLegendItem[]` | — | no | Type key → label entries rendered as a legend; also fixes chip tones deterministically. |
| agendaBreakpoint | `'sm' | 'md'` | `md` | no | Below this breakpoint an agenda list replaces the day grid. |
| linkComponent | `React.ElementType` | — | no | Custom link element for event hrefs (Next Link, react-router). |
| linkHrefProp | `'href' | 'to'` | `href` | no | Prop name used to pass the destination to linkComponent. |
| className | `string` | — | no | Classes merged onto the root container. |
| aria-label | `string` | — | no | Accessible name for the month grid; defaults to the month label. |

## Examples

### Competition calendar

Month grid with typed event chips; tapping an event navigates to its detail page.

```tsx
<MonthSchedule
  events={competitions}
  getDate={(c) => c.startDate}
  getLabel={(c) => c.name}
  getType={(c) => c.kind}
  getHref={(c) => '/competitions/' + c.slug}
  legend={[
    { type: 'competition', label: 'Competition' },
    { type: 'workshop', label: 'Workshop' },
  ]}
  today={todayKey}
/>
```

### Controlled month with URL state

Keep the visible month in the URL so the schedule is shareable and back-button safe.

```tsx
const [month, setMonth] = useState(searchParams.get('month') ?? '2026-03');

<MonthSchedule
  month={month}
  onMonthChange={(m) => router.replace('?month=' + m)}
  events={events}
  getDate={(e) => e.date}
  getLabel={(e) => e.title}
/>
```

## Anti-patterns

- **Don't use it to pick a date** — MonthSchedule shows events inside days; it has no selection model. Use Calendar or DatePicker when the user must choose a day.
- **Don't compute today on the server** — Without an explicit today prop the component reads the client clock; pass today from a deterministic source for SSR and tests.

## Accessibility

- **Grid semantics**: Day cells use role=grid/gridcell/row with column headers; today gets aria-current=date
- **Small-screen agenda**: Below agendaBreakpoint the grid is replaced by a labelled list of days and events, which is easier to scan than cramped cells
- **Live month label**: The month name sits in an aria-live=polite region so paging is announced

## Composition

- Compose with **Calendar** — Sibling components sharing the same date utilities; Calendar picks a day, MonthSchedule shows events in days
  
  ```tsx
  <Calendar value={date} onValueChange={setDate} />
<MonthSchedule events={events} getDate={getDate} getLabel={getLabel} />
  ```
- Compose with **Badge** — Day chips and the legend render as sm Badges with deterministic outline tones per type
  
  ```tsx
  legend={[{ type: 'social', label: 'Social' }]}
  ```
- Compose with **ListToolbar** — Pair with ListToolbar and Pagination when the schedule is one view of a filterable directory
  
  ```tsx
  <ListToolbar count={events.length} />
<MonthSchedule … />
  ```
- Related: Calendar, DatePicker, Badge, ListToolbar, MediaCard

