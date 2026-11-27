# DatePickerPopover

Date field with a Calendar panel, ISO strings, min/max and keyboard selection.

> Component ID: `date-picker-popover`
> Import: `import { DatePickerPopover } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/date-picker-popover
> Registry: https://slipstreamui.com/registry/date-picker-popover.json
> Tier: molecule · Package: @slipstream-ui/core@0.11.6
> Manifest schema: v1 · manifest: v1

## Design intent

The native date input opens browser chrome that differs per browser. DatePickerPopover pairs a themed trigger with Calendar in a Popover, so the visible month, week start and disabled days are yours, while the value remains a plain ISO string.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `string` | — | no | Selected day as `YYYY-MM-DD`. |
| onValueChange | `(value: string) => void` | — | no | Fired with the ISO key when a day is chosen. |
| min | `string` | — | no | Earliest selectable day. |
| max | `string` | — | no | Latest selectable day. |
| today | `string` | — | no | Overrides the highlighted today. |
| locale | `string` | `en-US` | no | Locale for the trigger label and the grid. |
| weekStartsOn | `0 | 1` | `0` | no | Week start for the panel. |
| placeholder | `string` | `Pick a date` | no | Trigger text before a date is chosen. |
| name | `string` | — | no | Renders a hidden input so the value posts with a native form. |
| required | `boolean` | — | no | Marks the hidden input required. |
| disabled | `boolean` | — | no | Disables the trigger. |
| side | `'top' | 'right' | 'bottom' | 'left'` | `bottom` | no | Preferred side of the panel; flips when it cannot fit. |
| align | `'start' | 'center' | 'end'` | `start` | no | Cross-axis alignment of the panel. |
| id | `string` | — | no | Id for the trigger button, for label association. |
| className | `string` | — | no | Additional CSS classes on the trigger. |
| aria-label | `string` | — | no | Accessible name for the trigger. |

## Examples

### Basic

Themed field with a calendar panel.

```tsx
<DatePickerPopover value={date} onValueChange={setDate} />
```

### Bounded

Only future dates, opening upward.

```tsx
<DatePickerPopover value={date} onValueChange={setDate} min={today} max={in90Days} side="top" />
```

### In a form

Hidden input carries the ISO value.

```tsx
<form><Label htmlFor="d">Date</Label><DatePickerPopover id="d" name="date" required value={date} onValueChange={setDate} /></form>
```

## Anti-patterns

- **Don't parse the label** — The visible text is localized. Read the ISO value, never the trigger text.
- **Don't nest inside another dialog** — Popover is non-modal; nesting it in a Dialog works, but nesting a Dialog inside it does not. Use a Drawer for long forms.

## Accessibility

- **Trigger semantics**: The trigger is a button with aria-haspopup="dialog" and aria-expanded.
- **Keyboard**: Enter/Space opens; arrows navigate; Enter selects and returns focus to the trigger; Escape closes.

## Composition

- Compose with **Calendar** — The panel is a Calendar; use it directly for an inline grid
  
  ```tsx
  <Calendar value={date} onValueChange={setDate} />
  ```
- Compose with **FormField** — Wrap with FormField for label, hint and error wiring
  
  ```tsx
  <FormField label="Date"><DatePickerPopover /></FormField>
  ```
- Related: Calendar, DatePicker, Popover, DateRangePicker, FormField

