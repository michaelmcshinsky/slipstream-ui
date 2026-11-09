# Stepper

Multi-step flow indicator: ordered list, aria-current step, text state for complete/current/upcoming, horizontal or vertical, numbered or dots.

> Import: `import { Stepper } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/stepper.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Wizards need orientation: where am I, what is done, what is next. A stepper built on an ordered list keeps the sequence structural and announces state in text, not just color. Four responsive shapes (inline labels, labels below, vertical timeline, compact dots) cover onboarding, checkout, and narrow sidebars.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| steps | `{ label: string; description?: string }[]` | — | yes | Ordered step definitions. |
| current | `number` | — | yes | Zero-based index of the active step. |
| orientation | `'horizontal' | 'vertical'` | `horizontal` | no | Layout direction. |
| variant | `'numbered' | 'dots'` | `numbered` | no | Marker style. numbered shows the step number and a check when complete; dots is the compact progress variant with no numbers. |
| size | `'sm' | 'md'` | `md` | no | Marker and label scale. |
| labelPlacement | `'inline' | 'below'` | `inline` | no | Horizontal only: place the label beside the marker or beneath it. |
| alignTitles | `'start' | 'center'` | `center` | no | Center a title vertically against its marker when that step has no description. Titles with a description stay top aligned. |
| onStepClick | `(index: number) => void` | — | no | Makes steps clickable (for revisit flows). |

## Examples

### Horizontal onboarding wizard

Current step is announced; completed steps show a check.

```tsx
<Stepper
  current={step}
  steps={[{ label: 'Account' }, { label: 'Studio details' }, { label: 'Invite team' }, { label: 'Review' }]}
  onStepClick={setStep}
/>
```

### Labels below the markers

A wider, marketing-friendly horizontal shape.

```tsx
<Stepper
  current={2}
  labelPlacement="below"
  steps={[{ label: 'Account' }, { label: 'Studio' }, { label: 'Review' }]}
/>
```

### Vertical timeline

A vertical connector joins the markers, suited to sidebars and activity feeds.

```tsx
<Stepper
  current={1}
  orientation="vertical"
  steps={[
    { label: 'Submitted', description: 'Mar 2' },
    { label: 'Under review', description: 'Mar 4' },
    { label: 'Decision', description: 'Mar 9' },
  ]}
/>
```

### Compact dots

No numbers, small markers, for tight toolbars or mobile.

```tsx
<Stepper current={1} variant="dots" size="sm" steps={[{ label: 'Plan' }, { label: 'Build' }, { label: 'Ship' }]} />
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
- Compose with **Drawer** — A vertical dots Stepper fits a narrow drawer or settings sidebar
  
  ```tsx
  <Drawer><Stepper current={1} orientation="vertical" variant="dots" steps={steps} /></Drawer>
  ```
- Related: Progress, Tabs, Form

