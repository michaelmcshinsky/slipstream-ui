# AnnouncementBar

Dismissible announcement bar with optional action, tone and sticky positioning.

> Import: `import { AnnouncementBar } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/announcement-bar.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Launches, content hubs and network notices need a thin bar above the header. AnnouncementBar owns the message, action and dismissal without forcing the site header to grow more props.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| message | `ReactNode` | — | yes | Message shown in the bar. |
| href | `string` | — | no | Optional destination for the action. |
| actionLabel | `string` | — | no | Action text, shown when href is provided. |
| dismissible | `boolean` | `true` | no | Show a close control. |
| onDismiss | `() => void` | — | no | Called after the user dismisses the bar. |
| tone | `'muted' | 'brand' | 'inverse'` | `muted` | no | Surface treatment. |
| sticky | `boolean` | `false` | no | Pin the bar to the top of the viewport. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers. |

## Examples

### Content hub launch

A branded announcement with a link and dismissal.

```tsx
<AnnouncementBar
  message="The 2026 Middle Market Review is live"
  href="/forum"
  actionLabel="Read it"
  tone="brand"
/>
```

## Anti-patterns

- **Don't stack multiple announcements** — One bar per page. Multiple messages compete and push the header down.

## Accessibility

- **Named region**: Renders role=region with aria-label Announcement
- **Dismiss control**: The close button is named Dismiss announcement

## Composition

- Compose with **SiteHeader** — Place AnnouncementBar above the sticky header
  
  ```tsx
  <AnnouncementBar message="." /><SiteHeader ... />
  ```
- Related: SiteHeader, Alert, Banner

