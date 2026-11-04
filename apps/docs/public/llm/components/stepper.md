# Stepper

Multi-step flow indicator: ordered list, aria-current step, text state for complete/current/upcoming.

> Import: `import { Stepper } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/stepper.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Wizards need orientation: where am I, what is done, what is next. A stepper built on an ordered list keeps the sequence structural and announces state in text, not just color.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| steps | `{ label: string; description?: string }[]` | — | yes | Ordered step definitions. |
| current | `number` | — | yes | Zero-based index of the active step. |
| orientation | `'horizontal' | 'vertical'` | `horizontal` | no | Layout direction. |
| onStepClick | `(index: number) => void` | — | no | Makes steps clickable (for revisit flows). |

## Examples

### Onboarding wizard

Current step is announced; completed steps show a check.

```tsx
<Stepper
  current={step}
  steps={[{ label: 'Account' }, { label: 'Studio details' }, { label: 'Invite team' }, { label: 'Review' }]}
/>
```

## Anti-patterns

- **Don't use it for progress percentage** — Use Progress for measurable 0-100 progress; Stepper is discrete stages.

## Accessibility

- **Sequence + state**: Ordered list with aria-current=step and sr-only state text

## Composition

- Compose with **Form** — One Form (or Form step) per Stepper stage
  
  ```tsx
  <Stepper current={1} steps={steps} />
  ```
- Related: Progress, Tabs, Form

