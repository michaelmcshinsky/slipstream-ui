# EmptyState

Placeholder for empty collections, zero-result searches and unconfigured features, with title, description and action slots.

> Import: `import { EmptyState } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/empty-state.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Empty states are where users decide what to do next. A consistent icon/title/description/action hierarchy beats ad-hoc 'No data' strings, and a stable structure is easier for screen readers and tests.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Primary message. |
| description | `string` | — | no | Supporting line explaining the next step. |
| icon | `ReactNode` | — | no | Decorative icon/illustration above the title. |
| action | `ReactNode` | — | no | Primary action (Button or link). |
| actions | `ReactNode` | — | no | Alias for `action` for codebases that pass a list of actions. |
| secondaryAction | `ReactNode` | — | no | Secondary action beside the primary one. |
| titleAs | `'p' | 'h2' | 'h3' | 'h4'` | `p` | no | Heading level for the title. Defaults to a paragraph. |
| size | `'sm' | 'md'` | `md` | no | Compact padding for panels/table bodies. |

## Examples

### Empty collection

Title, explanation and one primary action.

```tsx
<EmptyState
  title="No classes yet"
  description="Create your first class to get started."
  action={<Button>New class</Button>}
/>
```

## Anti-patterns

- **Don't use it for errors** — Empty is a normal state; failures need Alert/ErrorAlert with retry affordances.

## Accessibility

- **Action targets**: Actions are whatever you pass — use Button/link components so they stay focusable and announced

## Composition

- Compose with **Card** — Often rendered inside a Card body or a DataTable empty slot
  
  ```tsx
  <Card><CardContent><EmptyState … /></CardContent></Card>
  ```
- Related: Alert, Card, DataTable

