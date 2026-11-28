# MediaCard

Media card for event, article and listing grids: CoverImage cover, title, description, metadata, status chips and a footer, with an optional whole-card link.

> Component ID: `media-card`
> Import: `import { MediaCard } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/media-card
> Registry: https://slipstreamui.com/registry/media-card.json
> Tier: molecule · Package: @slipstream-ui/core@0.12.1
> Manifest schema: v1 · manifest: v1

## Design intent

Every media surface rebuilds the same card: cover art, a title, a date or location line, status chips and a details affordance. MediaCard composes CoverImage, Badge and the ArticleCard stretched-link pattern so imageless entities still look intentional and the card is one target, one hover state, one focus ring.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Card title. |
| description | `ReactNode` | — | no | Supporting copy under the title. |
| href | `string` | — | no | Destination URL; the whole card becomes a single link when set. |
| cover | `CoverImageProps` | — | no | Cover art rendered through CoverImage; seeded gradient fallback included. Pass src, alt, aspect, seed, mark, priority and sizes. |
| meta | `ReactNode` | — | no | Metadata line under the description, e.g. date, location or registration deadline. |
| chips | `MediaCardChip[]` | — | no | Status or category chips rendered as Badges; each chip takes label, variant and dot. |
| footer | `ReactNode` | — | no | Bottom slot for a details affordance or secondary text. Keep it non-interactive when the card is a link. |
| layout | `'vertical' | 'row'` | `vertical` | no | 'vertical' stacks the cover over the content; 'row' puts a fixed-width cover beside it for list rows. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers such as Next Link or react-router Link. |
| linkHrefProp | `'href' | 'to'` | `href` | no | Prop name used to pass the destination to linkComponent. |

## Examples

### Event card in a grid

Whole-card link with a seeded cover fallback, a deadline meta line and a status chip.

```tsx
<MediaCard
  href={event.href}
  title={event.title}
  description={event.summary}
  cover={{ src: event.imageUrl, alt: event.title, seed: event.slug, sizes: '(min-width: 1024px) 33vw, 100vw' }}
  meta={event.date + ' · ' + event.venue}
  chips={[{ label: 'Registration open', variant: 'outline-success', dot: true }]}
  footer='Details →'
/>
```

### List row

Fixed-width cover beside the content for compact result rows.

```tsx
<MediaCard
  layout="row"
  href={article.href}
  title={article.title}
  cover={{ alt: article.title, seed: article.slug, aspect: 'square' }}
  meta={article.date}
/>
```

## Anti-patterns

- **Don't nest links or buttons in the footer** — With href set the whole card is one link, so nested interactive elements are invalid HTML. Keep footer to text, or drop href and compose your own actions.
- **Don't use it for directory profiles** — Entity profiles with avatars, stats and tags belong in EntityCard; MediaCard is for media-first surfaces (events, articles, listings).

## Accessibility

- **Single link target**: With href the entire card is one anchor with a visible focus ring; without href it is a static article
- **Cover semantics**: CoverImage renders a real img with alt when src is present; the gradient fallback is aria-hidden

## Composition

- Compose with **CoverImage** — The cover prop is forwarded to CoverImage, inheriting its seeded gradient fallback and aspect box
  
  ```tsx
  <MediaCard cover={{ src, alt, seed: slug, aspect: 'video' }} title={title} />
  ```
- Compose with **Badge** — chips render as sm Badges; quiet outline tones (outline-success, outline-warning) fit status metadata
  
  ```tsx
  chips={[{ label: 'Open', variant: 'outline-success', dot: true }]}
  ```
- Compose with **ListToolbar** — Pair with ListToolbar above the grid and Pagination below it for a complete filtered-list surface
  
  ```tsx
  <ListToolbar count={items.length} />
<div className="grid gap-4"><MediaCard … /></div>
  ```
- Related: CoverImage, Badge, ArticleCard, EntityCard, ListToolbar

