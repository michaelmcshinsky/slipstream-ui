# Progress

A determinate progress bar with role=progressbar and exact value semantics

> Import: `import { Progress } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/progress.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Progress shows completion of a known-length task (uploads, installs, multi-step flows). It exposes exact values so assistive tech reports percentages, not just a moving bar.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `number` | `0` | no | Current value between 0 and max |
| max | `number` | `100` | no | Upper bound of the progress scale |
| label | `string` | — | no | Accessible label announced by screen readers |
| className | `string` | — | no | Additional CSS classes to apply |

## Examples

### Upload progress

Track an upload percentage

```tsx
<Progress value={uploadPercent} label="Upload progress" />
```

### Step completion

Progress through a finite set of steps

```tsx
<Progress value={step} max={totalSteps} label="Setup progress" />
```

## Anti-patterns

- **Don't use Progress for indeterminate work** — When the duration is unknown, use Spinner or StreamingIndicator instead.
- **Don't animate progress beyond its value** — Fabricating movement misleads users; only reflect real task progress.

## Accessibility

- **Progressbar semantics**: role="progressbar" with aria-valuenow/min/max
- **Exact values**: aria-valuenow reflects the clamped value

## Composition

- Compose with **Skeleton** — Use Skeleton for unknown-length content, Progress for known-length tasks
  
  ```tsx
  <Progress value={50} label="Upload" />
  ```
- Related: Skeleton, Spinner

