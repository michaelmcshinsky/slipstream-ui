# SelectMenu

Custom listbox select for rich options: descriptions, icons, groups, multi-select, custom rows and hidden inputs for forms.

> Import: `import { SelectMenu } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/select-menu.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Native <select> cannot render rich option content. SelectMenu supplies a real listbox with the button/listbox keyboard model while keeping the same value/onValueChange contract as Select, so teams can move between the two without rewriting state.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| items | `SelectMenuItem[]` | — | yes | Options: { value, label, description?, icon?, disabled?, group? }. |
| value | `string | string[]` | — | no | Controlled value(s); string[] when multiple. |
| defaultValue | `string | string[]` | — | no | Initial value(s) when uncontrolled. |
| onValueChange | `(value: string | string[]) => void` | — | no | Fired with the new selection. |
| multiple | `boolean` | `false` | no | Allow several selections; the listbox stays open. |
| placeholder | `string` | `Select…` | no | Shown when nothing is selected. |
| name | `string` | — | no | Renders hidden form inputs for the selected values. |
| renderValue | `(selected: SelectMenuItem[]) => ReactNode` | — | no | Custom trigger content. |
| renderItem | `(item, state: { selected: boolean; active: boolean }) => ReactNode` | — | no | Custom option row. |
| emptyText | `string` | `No options` | no | Shown when items is empty. |

## Examples

### Rich options

Descriptions and grouped headings inside a real listbox.

```tsx
<SelectMenu
  aria-label="Plan"
  placeholder="Choose a plan"
  items={[
    { value: 'free', label: 'Free', description: '1 project', group: 'Individual' },
    { value: 'team', label: 'Team', description: 'SSO + audit log', group: 'Business' },
  ]}
  value={plan}
  onValueChange={setPlan}
/>
```

### Multi-select with form input

Hidden inputs make the selection submit with the form.

```tsx
<SelectMenu
  aria-label="Channels"
  multiple
  name="channels"
  items={channels}
  value={selected}
  onValueChange={setSelected}
/>
```

## Anti-patterns

- **Don't use it for free-text entry** — SelectMenu has no text input. Use Autocomplete when typing a value is expected.
- **Don't render more than ~50 options** — There is no filtering. Large sets need Autocomplete or a searchable flow.

## Accessibility

- **Keyboard model**: Arrows move the active option, Home/End jump, Enter/Space select, Escape closes, typeahead jumps by first letters

## Composition

- Compose with **FormField** — Wrap for label/hint/error wiring
  
  ```tsx
  <FormField id="plan" label="Plan"><SelectMenu items={items} /></FormField>
  ```
- Compose with **Select** — Prefer Select when options are plain text (native pickers, mobile UX)
  
  ```tsx
  <Select options={plain} />
  ```
- Related: Select, Autocomplete, Menu, FormField

