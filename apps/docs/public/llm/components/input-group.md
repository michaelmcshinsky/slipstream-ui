# InputGroup

Composite input shell with flush left/right addons (icons, units, buttons) behind one outer outline; the nested field sheds its own border so the group reads as a single control.

> Import: `import { InputGroup } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/input-group.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Search fields, URL/unit inputs, and inline actions need affixes that sit flush inside the field. InputGroup owns the combined border and focus ring (the outline doubles as the affordance) while addons stay visually part of the field: ghost addons keep the group background, muted addons paint a light gray, and nested inputs are stripped of their own chrome via descendant selectors.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| side | `'left' | 'right'` | `left` | no | Edge the addon hugs (flush against the group outline). |
| variant | `'ghost' | 'muted'` | `ghost` | no | Addon surface: ghost keeps the group background, muted paints a light gray. |

## Examples

### URL field with unit affixes

Muted affixes carry the fixed parts of the value; only the middle is editable.

```tsx
<InputGroup>
  <InputGroupAddon side="left" variant="muted">https://</InputGroupAddon>
  <Input placeholder="example.com" />
  <InputGroupAddon side="right" variant="muted">.com</InputGroupAddon>
</InputGroup>
```

### Search with icon and action button

Leading icon is decorative; the trailing button is the pseudo action indicator.

```tsx
<InputGroup>
  <InputGroupAddon side="left" aria-hidden="true"><SearchIcon size={16} /></InputGroupAddon>
  <Input aria-label="Search" placeholder="Search issues…" />
  <InputGroupAddon side="right" variant="muted">
    <Button size="sm" variant="ghost">Go</Button>
  </InputGroupAddon>
</InputGroup>
```

### Numeric input with currency suffix

The unit sits flush right; the outline communicates editability.

```tsx
<InputGroup>
  <Input aria-label="Amount" type="number" defaultValue="10" />
  <InputGroupAddon side="right" variant="muted">PLN</InputGroupAddon>
</InputGroup>
```

## Anti-patterns

- **Don't give nested inputs their own border** — The group's outer border is the control outline. Inner borders create double lines and break the flush-addon look — strip them with the group (built in) or avoid nesting a bordered Input.
- **Don't nest interactive elements without labels** — Addon buttons live inside the field's focus-within region; they still need accessible names and must not steal the field's label association.

## Accessibility

- **Single focus stop**: Focus ring renders on the group via focus-within; nested inputs keep keyboard focus and their label association (htmlFor/id still targets the input)
- **Decorative affixes**: Purely decorative icons/text in addons should carry aria-hidden or the input's aria-label should include the unit
- **Disabled state**: Nested input's disabled styling applies; addons are independent — disable buttons inside them yourself

## Composition

- Compose with **Input / Textarea / Select** — The nested field is the editable region; InputGroup strips its border/ring automatically
  
  ```tsx
  <InputGroup><InputGroupAddon side="left">@</InputGroupAddon><Input /></InputGroup>
  ```
- Compose with **FormField** — Wrap the whole group when it needs a persistent label or error
  
  ```tsx
  <FormField label="Search"><InputGroup>…</InputGroup></FormField>
  ```
- Compose with **Button** — Buttons inside addons are the action affordance — ghost/variant='ghost' keeps the flush look
  
  ```tsx
  <InputGroupAddon side="right"><Button size="sm">Go</Button></InputGroupAddon>
  ```
- Related: Input, FormField, Search, Button

