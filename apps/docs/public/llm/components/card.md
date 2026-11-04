# Card

A content container with header, body, and footer sections for grouping related information

> Import: `import { Card } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/card.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Card groups related content into a scannable container. Use it for settings panels, feature highlights, user profiles, and any content that benefits from visual grouping.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| children | `ReactNode` | — | yes | Card sub-components (CardHeader, CardContent, CardFooter) |
| className | `string` | — | no | Additional CSS classes to apply |
| asChild | `boolean` | `false` | no | Render the child element (router Link, <a>) with card styling instead of a div. |

## Examples

### Card as a link

Whole card becomes a semantic link without losing styling.

```tsx
<Card asChild>
  <Link href="/writing/hello">
    <CardHeader><CardTitle>Hello</CardTitle></CardHeader>
  </Link>
</Card>
```

### Basic card

Card with header, content, and footer

```tsx
<Card>
  <CardHeader>
    <CardTitle>Profile</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
  </CardHeader>
  <CardContent>Form fields here</CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

### Simple card

Minimal card without header or footer

```tsx
<Card>
  <CardContent>
    <p>Just a content block with a border.</p>
  </CardContent>
</Card>
```

## Anti-patterns

- **Don't nest Cards** — Nesting cards creates visual noise. Use dividers or spacing within a single Card.

## Accessibility

- **Heading hierarchy**: CardTitle renders as h3

## Composition

- Compose with **Button** — Place primary actions in CardFooter
  
  ```tsx
  <CardFooter><Button>Save</Button></CardFooter>
  ```
- Related: Separator, Tabs

