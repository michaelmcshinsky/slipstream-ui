# PageHeader

Standard page heading: optional breadcrumbs, level-1 title, description, right-aligned actions and a sub-row slot.

> Import: `import { PageHeader } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/page-header.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Every list/detail page repeats breadcrumb + title + description + actions with drifting spacing. PageHeader fixes the hierarchy (one h1 per page) and the responsive wrap, so pages stay consistent.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Page heading rendered as h1. |
| description | `string` | — | no | Supporting summary under the title. |
| subtitle | `string` | — | no | Alias for description (migration-friendly). |
| breadcrumbs | `ReactNode` | — | no | Trail rendered above the title. |
| actions | `ReactNode` | — | no | Right-aligned actions (buttons, menus). |
| children | `ReactNode` | — | no | Sub-row under the title (tabs, filters). |
| eyebrow | `ReactNode` | — | no | Kicker above the title. |
| size | `'sm' | 'md' | 'lg' | 'hero'` | `md` | no | Heading scale; hero is for marketing pages. |
| align | `'left' | 'center'` | `left` | no | Text alignment. |
| titleClassName | `string` | — | no | Extra classes merged onto the h1 for host display typography. |
| descriptionClassName | `string` | — | no | Extra classes merged onto the description paragraph. |
| eyebrowClassName | `string` | — | no | Extra classes merged onto the eyebrow/kicker. |

## Examples

### List page header

One h1, one action cluster.

```tsx
<PageHeader
  title="Classes"
  description="Manage your weekly schedule."
  breadcrumbs={<Breadcrumb … />}
  actions={<Button>New class</Button>}
/>
```

## Anti-patterns

- **Don't stack multiple h1s** — PageHeader renders the page's h1; section headings inside the page should be h2 via Heading.

## Accessibility

- **Heading hierarchy**: Renders exactly one level-1 heading

## Composition

- Compose with **Breadcrumb** — Pass a Breadcrumb as breadcrumbs for hierarchy context
  
  ```tsx
  <PageHeader breadcrumbs={<Breadcrumb items={trail} />} title="Detail" />
  ```
- Compose with **documentHead** — Build title, description, canonical and robots once for the router's head adapter (Next generateMetadata, Inertia Head, React Router meta).
  
  ```tsx
  const head = documentHead({ title, description, canonical, noindex });
  ```
- Related: Breadcrumb, Heading, Tabs

