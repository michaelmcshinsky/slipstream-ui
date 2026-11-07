# ThemeToggle

Presentational light/dark toggle with accessible labels and sun/moon state.

> Import: `import { ThemeToggle } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/theme-toggle.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Theme persistence is app-specific (cookie, localStorage, server session), but the control is the same everywhere. ThemeToggle owns the button, icon state, and accessible label while the consumer owns storage and the actual class/attribute switch.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| theme | `'light' | 'dark'` | — | yes | Current theme. |
| onThemeChange | `(theme: 'light' | 'dark') => void` | — | yes | Fired with the next theme when the user toggles. |
| labels | `{ toLight?: string; toDark?: string }` | — | no | Accessible labels for the action that will happen next. |
| size | `'sm' | 'md'` | `md` | no | Control size. |
| className | `string` | — | no | Additional CSS classes to apply. |

## Examples

### Cookie-backed theme

The consumer persists the theme; the component only renders and reports the next value.

```tsx
const [theme, setTheme] = useState<'light' | 'dark'>('light')

function change(next: 'light' | 'dark') {
  setTheme(next)
  document.documentElement.dataset.theme = next
  document.cookie = `theme=${next}; path=/; max-age=31536000`
}

<ThemeToggle theme={theme} onThemeChange={change} />
```

### Custom labels

```tsx
<ThemeToggle theme={theme} onThemeChange={setTheme} labels={{ toDark: 'Dark mode', toLight: 'Light mode' }} />
```

## Anti-patterns

- **Don't let the component own persistence** — Theme storage differs by app (cookie for SSR, localStorage for SPAs). Keep persistence in the consumer and pass theme/onThemeChange.
- **Don't use an icon-only button without a label** — The component always sets aria-label and title; don't override them with empty values.

## Accessibility

- **Accessible name**: aria-label and title describe the next action, not the current state.
- **Keyboard**: Native button, Enter/Space activation, visible focus ring.
- **Icon semantics**: Icons are aria-hidden; the button label carries the meaning.

## Composition

- Compose with **SiteHeader** — Place in SiteHeader actions or the app shell header.
- Related: Button, SiteHeader, AppShell

