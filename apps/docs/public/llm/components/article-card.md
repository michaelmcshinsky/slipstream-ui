# ArticleCard

Linked article or resource card with media, eyebrow, title, summary and metadata.

> Import: `import { ArticleCard } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/article-card.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Content hubs repeat the same article tile. ArticleCard owns the image aspect, title hierarchy, excerpt clamp and metadata row so blog, resource and LOI pages do not each invent a card.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Article title. |
| description | `string` | — | no | Summary copy. |
| href | `string` | — | yes | Destination URL. |
| eyebrow | `string` | — | no | Category or content type. |
| media | `ReactNode` | — | no | Image, illustration or video poster. |
| meta | `ReactNode` | — | no | Date, read time, author or other metadata. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers. |
| variant | `'default' | 'compact'` | `default` | no | Standard card or a denser compact card. |

## Examples

### Resource card

A linked article tile for a resource grid.

```tsx
<ArticleCard
  href="/articles/exit-planning"
  eyebrow="Advisors"
  title="The 2026 exit planning guide"
  description="What buyers are looking for."
  meta="8 min read"
  media={<img src="/cover.jpg" alt="" />}
/>
```

## Anti-patterns

- **Don't nest controls in the card** — The whole card is one link. Put save, share or menu actions outside the card or redesign the card as a non-link panel.

## Accessibility

- **Single link**: The card is one link containing the title, summary and metadata
- **Decorative media**: Media is a slot

## Composition

- Compose with **Grid** — Place cards in a responsive Grid
  
  ```tsx
  <Grid mdCols={3} gap="lg"><ArticleCard ... /></Grid>
  ```
- Related: Card, Grid, FeaturedPost, ResourceHub

