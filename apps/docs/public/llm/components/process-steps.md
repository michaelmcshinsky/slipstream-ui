# ProcessSteps

Ordered process cards with derived step numbers or custom icons.

> Import: `import { ProcessSteps } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/process-steps.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Marketing pages explain a process as 01/02/03 cards. ProcessSteps uses an ordered list so the sequence is structural, derives the numbers from order and supports icons without turning the section into arbitrary divs.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| steps | `ProcessStep[]` | — | yes | Ordered steps: title, optional description and icon. |
| columns | `2 | 3 | 4` | `3` | no | Desktop column count. |
| numbered | `boolean` | `true` | no | Show step numbers when no icon is provided. |
| align | `'left' | 'center'` | `left` | no | Content alignment. |

## Examples

### Advisor process

Three numbered process steps.

```tsx
<ProcessSteps
  steps={[
    { title: 'Meet your consultant', description: 'Share your goals.' },
    { title: 'Review advisors', description: 'Compare recommendations.' },
    { title: 'Interview and hire', description: 'Choose with confidence.' },
  ]}
/>
```

## Anti-patterns

- **Don't hardcode step numbers** — Numbers come from the list order. Hardcoded numbers drift when steps are inserted or reordered.

## Accessibility

- **Ordered sequence**: Renders ol/li so the order is announced
- **Icon or number**: The marker is visual; the list order carries the sequence

## Composition

- Compose with **Section** — Place ProcessSteps inside a Section band
  
  ```tsx
  <Section><ProcessSteps steps={steps} /></Section>
  ```
- Related: Stepper, Timeline, FeatureGrid

