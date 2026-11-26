# Calendar

Month grid with ISO date keys, min/max bounds and full keyboard navigation.

> Component ID: `calendar`
> Import: `import { Calendar } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/calendar
> Registry: https://slipstreamui.com/registry/calendar.json
> Tier: organism · Package: @slipstream-ui/core@0.11.4
> Manifest schema: v1 · manifest: v1

## Design intent

A native date input renders browser chrome that cannot be themed and differs per browser. Calendar is the visible grid behind a date field: controlled by ISO strings so a timezone cannot shift the chosen day, keyboard-operable cell by cell, and usable standalone or inside a Popover.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `string` | — | no | Selected day as `YYYY-MM-DD` (controlled). |
| defaultValue | `string` | — | no | Initial day when uncontrolled. |
| onValueChange | `(value: string) => void` | — | no | Fired with the ISO key when a day is chosen. |
| min | `string` | — | no | Earliest selectable day, inclusive. |
| max | `string` | — | no | Latest selectable day, inclusive. |
| today | `string` | — | no | Overrides the highlighted today, for deterministic rendering. |
| locale | `string` | `en-US` | no | BCP-47 locale for month and weekday labels. |
| weekStartsOn | `0 | 1` | `0` | no | 0 starts the week on Sunday, 1 on Monday. |
| isDateDisabled | `(value: string) => boolean` | — | no | Blocks individual days beyond min/max. |
| showOutsideDays | `boolean` | `true` | no | Show leading/trailing days from neighbouring months. |
| autoFocus | `boolean` | `false` | no | Focus the active day on mount, for popover use. |
| disabled | `boolean` | — | no | Disables every day and the month controls. |
| className | `string` | — | no | Additional CSS classes. |
| aria-label | `string` | — | no | Overrides the grid label (defaults to the month name). |

## Examples

### Controlled calendar

ISO strings in and out.

```tsx
<Calendar value={date} onValueChange={setDate} min="2026-01-01" max="2026-12-31" />
```

### Monday-first with blocked days

Locale-aware week start and a predicate for holidays.

```tsx
<Calendar weekStartsOn={1} locale="es-ES" isDateDisabled={(d) => d.endsWith('-01')} />
```

## Anti-patterns

- **Don't store Date objects** — A Date crossing a timezone boundary can land on the previous or next day. Keep ISO `YYYY-MM-DD` keys until you need to format them.
- **Don't disable days by removing them** — Removing cells breaks the grid rhythm and keyboard movement. Mark them with min/max/isDateDisabled so they stay visible.

## Accessibility

- **Grid semantics**: role=grid with rows, columnheaders and gridcells; the month label is announced and polite.
- **Keyboard**: Arrows move by day/week, Home/End jump to week bounds, PageUp/PageDown change month, Enter/Space selects.
- **Selection state**: aria-selected on the gridcell and aria-current="date" for today.

## Composition

- Compose with **Popover** — Wrap Calendar in PopoverContent for a date field
  
  ```tsx
  <PopoverContent><Calendar autoFocus /></PopoverContent>
  ```
- Compose with **DatePickerPopover** — Use DatePickerPopover when the field and panel should ship together
  
  ```tsx
  <DatePickerPopover value={date} onValueChange={setDate} />
  ```
- Related: DatePicker, DatePickerPopover, Popover, DateRangePicker

