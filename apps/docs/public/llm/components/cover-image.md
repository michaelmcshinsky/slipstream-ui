# CoverImage

Fixed-aspect media cover that shows the image when present and a deterministic seed-derived token gradient when the entity has no art.

> Component ID: `cover-image`
> Import: `import { CoverImage } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/cover-image
> Registry: https://slipstreamui.com/registry/cover-image.json
> Tier: molecule · Package: @slipstream-ui/core@0.11.4
> Manifest schema: v1 · manifest: v1

## Design intent

Media cards need a cover that never looks broken: imageless entities still get an intentional, per-entity placeholder instead of a reused generic social card. CoverImage wraps Image's src->fallback chain inside an aspect-ratio box so grids stay aligned and never shift layout.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| src | `string | null` | — | no | Cover URL. When absent or broken, the seeded fallback renders instead. |
| alt | `string` | — | yes | Accessible description of the image. |
| aspect | `'video' | 'square' | 'wide' | string` | `video` | no | Aspect ratio: presets map to 16:9, 1:1 and 2:1; any CSS aspect-ratio value like '16/10' also works. |
| seed | `string` | — | no | Stable key selecting the fallback gradient (e.g. entity slug), so the same entity always gets the same placeholder. |
| priority | `boolean` | `false` | no | Load eagerly and fetch at high priority for the LCP image. |
| sizes | `string` | — | no | Responsive sizes hint forwarded to the image element. |
| fallback | `React.ReactNode` | — | no | Custom fallback content; defaults to the seed-derived token gradient. |
| mark | `React.ReactNode` | — | no | Optional mark (icon, monogram) centered on the default gradient. |
| className | `string` | — | no | Classes merged onto the aspect-ratio container. |

## Examples

### Entity cover with seeded placeholder

16:9 cover; imageless events get a stable per-slug gradient.

```tsx
<CoverImage
  src={event.imageUrl}
  alt={event.title}
  seed={event.slug}
  aspect="video"
  sizes="(min-width: 1024px) 33vw, 100vw"
/>
```

### Square avatar-style cover

Square cover with a mark on the gradient fallback.

```tsx
<CoverImage alt={studio.name} seed={studio.slug} aspect="square" mark={<StudioIcon />} />
```

## Anti-patterns

- **Don't use it for photos of people** — Use Avatar for people and firms; CoverImage is for media covers (events, articles, listings).
- **Don't skip the seed** — Without a stable seed the fallback falls back to alt text, so two entities can share a gradient by accident. Pass the entity slug.

## Accessibility

- **Image semantics**: Renders a real img with alt when src is present; the gradient fallback is aria-hidden decoration
- **Layout stability**: The aspect-ratio box reserves space before the image loads, so grids never shift

## Composition

- Compose with **Card** — CoverImage is the media slot at the top of a Card or listing tile
  
  ```tsx
  <Card><CoverImage src={item.image} alt={item.title} seed={item.slug} /><CardContent>…</CardContent></Card>
  ```
- Compose with **Image** — CoverImage wraps Image, inheriting its src->fallbackSrc->fallback resilience chain
  
  ```tsx
  <CoverImage src={url} alt={alt} />
  ```
- Related: Image, Avatar, Card

