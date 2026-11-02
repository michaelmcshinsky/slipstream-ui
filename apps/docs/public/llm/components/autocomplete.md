# Autocomplete

Type-ahead input following the HTML autocomplete model: any value is allowed while matching suggestions appear in a keyboard-navigable listbox.

> Import: `import { Autocomplete } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/autocomplete.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Form fields often need both freedom and guidance — usernames, tags, city names. Autocomplete extends the native autocomplete spec: the input stays a normal controlled input (native autoComplete hints keep working), and an ARIA combobox listbox overlays suggestions. Unlike Search, no option constrains the result.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| suggestions | `string[]` | — | yes | Suggestion labels offered while typing; any value may still be entered free-form. |
| value | `string` | — | no | Current text — standard controlled-input contract (wire onValueChange to update it). |
| defaultValue | `string` | `''` | no | Initial text when uncontrolled. |
| onValueChange | `(value: string) => void` | — | no | Fires on every keystroke AND on suggestion selection (like a native input's onChange). |
| emptyText | `string` | — | no | Shown when no suggestion matches (optional; defaults to 'No suggestions'). |

## Examples

### Controlled form field

onValueChange mirrors native onChange; FormField wires the label and hint.

```tsx
const [framework, setFramework] = useState('');

<FormField id="framework" label="Primary framework" hint="Type or pick a suggestion">
  <Autocomplete
    suggestions={['react', 'remix', 'next', 'vite']}
    value={framework}
    onValueChange={setFramework}
    name="framework"
    autoComplete="off"
  />
</FormField>
```

### Native autofill hints alongside the custom list

The native autoComplete attribute passes through — browser autofill and the suggestion list coexist.

```tsx
<Autocomplete
  name="country"
  autoComplete="country-name"
  suggestions={countryNames}
  onValueChange={setCountry}
/>
```

## Anti-patterns

- **Don't use Autocomplete for constrained choice** — Free text is the point of Autocomplete. When only known values are valid (plan tier, enum), use Select or Search so invalid states cannot be typed.
- **Don't forget to keep state in sync when controlled** — With value set, React makes the input fully controlled — if onValueChange does not update the parent state, typing appears frozen.
- **Don't block Enter for form submission** — Enter only consumes the event when a suggestion is actively highlighted — otherwise it should submit the surrounding form. Avoid adding a global keydown handler that always prevents Enter.

## Accessibility

- **Combobox pattern**: role=combobox with aria-expanded, aria-controls, aria-autocomplete=list, and aria-activedescendant on the input; suggestions render as role=option with aria-selected
- **Keyboard operation**: ArrowDown/ArrowUp highlight suggestions (wrapping), Home/End jump, Enter accepts the highlighted suggestion, Escape closes the list; unhighlighted Enter submits the form natively
- **Native autocomplete passthrough**: The autoComplete attribute is forwarded to the input so browser autofill hints keep working

## Composition

- Compose with **FormField** — Standard form placement — label, hint, and error wiring come free
  
  ```tsx
  <FormField id="tag" label="Tag" hint="Type to see existing tags"><Autocomplete suggestions={tags} value={tag} onValueChange={setTag} /></FormField>
  ```
- Compose with **Search** — Search when values MUST come from the list; Autocomplete when free text stays valid
- Related: Search, Input, FormField, Select

