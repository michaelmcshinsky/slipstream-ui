# Fieldset

Groups related form controls in a native fieldset with a legend, optional description, and an error slot.

> Import: `import { Fieldset } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/fieldset.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Radio groups, checkbox groups, and multi-control sections need an accessible group name. Fieldset provides the native <fieldset>/<legend> semantics with token-based styling (borderless by default) plus description and error slots so related controls read as one unit.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| legend | `string` | — | no | Legend rendered as the group's accessible name. |
| description | `string` | — | no | Muted supporting line rendered under the legend. |
| error | `string` | — | no | Error line rendered under the controls; announced via role=alert. |

## Examples

### Grouped radio-style options

Legend names the group; description adds context.

```tsx
<Fieldset legend="Export format" description="Applied to every selected row">
  <Checkbox id="csv" /><Label htmlFor="csv">CSV</Label>
  <Checkbox id="json" /><Label htmlFor="json">JSON</Label>
</Fieldset>
```

### With a group-level error

Errors that belong to the whole group live on the fieldset, not each control.

```tsx
<Fieldset legend="Visibility" error="Choose who can see this project">
  <RadioGroupItem value="private" label="Private" />
  <RadioGroupItem value="team" label="Team" />
</Fieldset>
```

## Anti-patterns

- **Don't use a fieldset for layout grouping** — Fieldset is for FORM controls that share one accessible name. For purely visual grouping use Card or a plain div — screen readers announce every fieldset as a landmark-ish group and excess ones add noise.
- **Don't skip the legend** — A fieldset without legend (or without aria-label) leaves the group unnamed — controls inside lose their grouping context for screen reader users.

## Accessibility

- **Native group semantics**: Renders <fieldset> with <legend>; the legend is the group's accessible name announced before each control
- **Group-level errors**: The error slot renders with role=alert so it is announced when it appears

## Composition

- Compose with **RadioGroup / Checkbox** — Wrap mutually exclusive or multi-select controls so their group name is announced
  
  ```tsx
  <Fieldset legend="Plan"><RadioGroup name="plan">…</RadioGroup></Fieldset>
  ```
- Compose with **FormField** — For a single labeled control prefer FormField; Fieldset is for GROUPS of controls
- Related: Radio, Checkbox, FormField, Label

