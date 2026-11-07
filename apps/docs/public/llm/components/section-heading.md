# SectionHeading

Section heading block: eyebrow, title (level 2-4), description and actions, with left/center alignment and three sizes.

> Import: `import { SectionHeading } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/section-heading.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Marketing and content pages repeat the same eyebrow/title/description/actions cluster for every section. SectionHeading standardizes it without claiming the page h1 (that is PageHeader's job).

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Section title. |
| description | `string` | — | no | Supporting copy. |
| eyebrow | `ReactNode` | — | no | Kicker above the title. |
| actions | `ReactNode` | — | no | Right-aligned actions. |
| level | `2 | 3 | 4` | `2` | no | Heading level rendered for the title. |
| align | `'left' | 'center'` | `left` | no | Text and action alignment. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Title scale. |
| titleClassName | `string` | — | no | Extra classes merged onto the title element for host display typography. |
| descriptionClassName | `string` | — | no | Extra classes merged onto the description paragraph. |
| eyebrowClassName | `string` | — | no | Extra classes merged onto the eyebrow/kicker. |

## Examples

### Marketing section

Eyebrow + title + copy + action link.

```tsx
<SectionHeading
  eyebrow="Components"
  title="Built for agents"
  description="Every component ships a spec."
  actions={<Link href="/docs">All docs</Link>}
/>
```

## Anti-patterns

- **Don't use it for the page title** — PageHeader owns the single h1; SectionHeading defaults to h2.

## Accessibility

- **Configurable heading level**: Renders h2/h3/h4 via the level prop

## Composition

- Compose with **PageHeader** — PageHeader for the h1; SectionHeading for h2+ sections
  
  ```tsx
  <PageHeader title="…" /><SectionHeading title="…" />
  ```
- Related: PageHeader, Heading, Text

