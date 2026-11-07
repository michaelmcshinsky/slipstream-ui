# Search

Select-with-search: type to filter a full-width dropdown of options, or arrow through the full set from an empty query.

> Import: `import { Search } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/search.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

A native <select> cannot filter and a free text input cannot constrain. Search covers the middle: constrained choice with inline filtering, full combobox a11y (role=combobox/aria-activedescendant), and a listbox that portals with fixed positioning so scrollable containers never clip it.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| options | `SearchOption[]` | — | yes | The full option set; filtered client-side as the user types. |
| defaultValue | `string` | — | no | Initially selected option value (display starts on its label). |
| onValueChange | `(value: string) => void` | — | no | Called with the selected option's value. |
| placeholder | `string` | `'Search…'` | no | Input placeholder while no query is typed. |
| emptyText | `string` | `'No matching results'` | no | Shown when no option matches the query. |
| disabled | `boolean` | `false` | no | Disables the input and the dropdown. |
| value | `string | null` | — | no | Controlled selected value; display follows it (null clears). |
| listLabel | `string` | — | no | Accessible label for the results listbox. Defaults to the input aria-label, then "Search results". |

## Examples

### Constrained pick from a list

Keyboard: ArrowDown opens, arrows move, Enter selects, Escape closes.

```tsx
<Search
  aria-label="Assign to"
  placeholder="Search people…"
  options={people}
  onValueChange={(value) => setAssignee(value)}
/>
```

### With descriptions and keywords

keywords widen matching without widening the visible label.

```tsx
const options = [
  { value: 'a1', label: 'Ada Lovelace', description: 'Design', keywords: 'ada design ui' },
  { value: 'a2', label: 'Alan Turing', description: 'Platform', keywords: 'alan platform' },
];
<Search options={options} onValueChange={select} />
```

## Anti-patterns

- **Don't use Search for free-form input** — Search constrains the result to known options. For values the system has never seen (tags, new names) use Input or Autocomplete instead.
- **Don't feed hundreds of options without keywords** — The list is filtered client-side; large sets need keywords/descriptions so short queries hit. For server-side search, debounce the query and swap the options prop — do not render raw HTML in labels.
- **Don't rely on the placeholder as the field's name** — The placeholder disappears once typing starts. Pass aria-label (standalone) or wrap the Search in FormField for a persistent accessible name.

## Accessibility

- **Combobox pattern**: Input exposes role=combobox with aria-expanded, aria-controls, aria-autocomplete=list, and aria-activedescendant pointing at the active option
- **Keyboard operation**: ArrowDown/ArrowUp move the active option (wrapping), Home/End jump, Enter selects, Escape closes without clearing
- **Focus retention**: Option mousedown is prevented so focus stays in the input while clicking; typing continues immediately after selection
- **Clipping-safe listbox**: The listbox portals to document.body with fixed coordinates measured from the input and closes on scroll/resize

## Composition

- Compose with **FormField** — Wrap in FormField when the search sits in a form — the label is cloned onto the input
  
  ```tsx
  <FormField id="assignee" label="Assign to"><Search options={people} /></FormField>
  ```
- Compose with **Autocomplete** — Choose Search for constrained picks; Autocomplete when free-form values must stay allowed
- Related: Autocomplete, Select, FormField, CommandPalette

