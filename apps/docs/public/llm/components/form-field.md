# FormField

Label + control + hint/error in one unit with htmlFor, aria-describedby, and aria-invalid wiring applied automatically.

> Import: `import { FormField } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/form-field.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Every form control needs the same trio — label, hint or error, correct ARIA wiring — and hand-wiring it is where accessibility regressions start. FormField clones id/aria-describedby/aria-invalid onto a single-element child so the common case is one component and zero boilerplate.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| id | `string` | — | yes | The control's id — shared with the label's htmlFor and the hint/error ids. |
| label | `string` | — | yes | Visible label text (kept for screen readers even when labelHidden). |
| hint | `string` | — | no | Helper text under the control, wired via aria-describedby. |
| error | `string` | — | no | Validation error; replaces the hint, sets aria-invalid on the control, announced via role=alert. |
| required | `boolean` | `false` | no | Renders the required marker next to the label. |
| labelHidden | `boolean` | `false` | no | Keeps the label screen-reader visible but hides it visually (sr-only). |

## Examples

### Text input with hint

The cloned child receives id, aria-describedby, and the label pairs via htmlFor.

```tsx
<FormField id="email" label="Email address" hint="We never share your email" required>
  <Input type="email" autoComplete="email" />
</FormField>
```

### Error state

Error replaces the hint, flips aria-invalid on the control, and announces via role=alert.

```tsx
<FormField id="email" label="Email address" error={errors.email} required>
  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
</FormField>
```

### Search-style field

```tsx
<FormField id="assignee" label="Assign to" hint="Start typing to filter">
  <Search options={people} onValueChange={setAssignee} />
</FormField>
```

## Anti-patterns

- **Don't rely on placeholder as the label** — Placeholders disappear on input and fail color-contrast rules. FormField renders a real <Label>; use placeholder only for example format.
- **Don't nest multiple controls in one FormField** — The aria wiring (describedby/invalid) clones onto exactly one child element. For groups, use Fieldset or one FormField per control.
- **Don't duplicate ids across fields** — id keys the whole wiring — every FormField in a form must receive a unique id and the child must not override it with a different value.

## Accessibility

- **Label association**: Renders <Label htmlFor={id}> and clones the same id onto single-element children
- **Hint and error wiring**: aria-describedby points at the hint (or the error when present); errors render with role=alert
- **Invalid state**: Sets aria-invalid on the cloned control when error is present
- **Required marker**: The asterisk is aria-hidden; native required semantics come from the control's own required attribute

## Composition

- Compose with **Input / Textarea / Select / Search / Autocomplete** — Wrap exactly one control — id/aria wiring is cloned onto it automatically
  
  ```tsx
  <FormField id="email" label="Email"><Input type="email" /></FormField>
  ```
- Compose with **Fieldset** — Use Fieldset (not FormField) when the label names a GROUP of controls
- Related: Label, Input, Fieldset, Search, Autocomplete

