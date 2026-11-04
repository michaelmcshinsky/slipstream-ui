# Form

Semantic form element with even-spacing layouts: stacked (default), bordered card, or inline row — native submit and validation untouched.

> Import: `import { Form } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/form.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Forms need two things the DOM gives you: a real <form> (submit, Enter, validation) and even, tokenized spacing between fields. Form bakes the layout into variants so field rhythm stays consistent without wrapper divs or one-off gap classes.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| variant | `'default' | 'card' | 'inline'` | `default` | no | Visual container: plain vertical stack, bordered card, or inline row with aligned ends. |
| gap | `'none' | 'sm' | 'md' | 'lg' | 'xl' | number` | — | no | Even spacing between children — token ('md' default) or exact pixels (16). |
| onSubmit | `(event: React.FormEvent<HTMLFormElement>) => void` | — | no | Native submit handler — Enter in a text input submits like any form. |
| noValidate | `boolean` | `false` | no | Skip native validation when you drive errors through FormField error props. |

## Examples

### Stacked settings form

Fields space evenly on the md token; errors come from FormField.

```tsx
<Form onSubmit={save} noValidate className="max-w-md">
  <FormField id="name" label="Display name" error={errors.name} required>
    <Input value={name} onChange={(e) => setName(e.target.value)} />
  </FormField>
  <FormField id="email" label="Email" error={errors.email}>
    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
  </FormField>
  <Button type="submit">Save settings</Button>
</Form>
```

### Card and inline variants

```tsx
<Form variant="card" gap={16}>…</Form>

<Form variant="inline" onSubmit={search}>
  <FormField id="q" label="Search"><Input type="search" /></FormField>
  <Button type="submit">Go</Button>
</Form>
```

## Anti-patterns

- **Don't nest forms** — Nested <form> elements are invalid HTML — browsers drop the inner form's submit association. Compose with FormLayout sections instead.
- **Don't fight native validation blindly** — Passing noValidate means YOU own every error message — pair it with FormField error props or keep native validation on.

## Accessibility

- **Native form semantics**: Renders <form> — Enter-to-submit, browser validation, and autocomplete all work
- **Even spacing is tokenized**: gap defaults to the md token and accepts exact pixels — rhythm stays consistent across forms

## Composition

- Compose with **FormField** — Each field is a FormField; Form spaces them evenly
  
  ```tsx
  <Form onSubmit={save}><FormField …>…</FormField></Form>
  ```
- Compose with **FormLayout** — Multi-column or grouped sections inside a form
- Compose with **Button** — Submit button with type="submit" — native Enter handling comes free
- Related: FormField, FormLayout, Fieldset, Input

