# Image

A resilient image with a two-step fallback chain, intrinsic dimensions, and an LCP priority flag

> Component ID: `image`
> Import: `import { Image } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/image
> Registry: https://slipstreamui.com/registry/image.json
> Tier: atom · Package: @slipstream-ui/core@0.11.6
> Manifest schema: v1 · manifest: v1

## Design intent

Organizer images are hotlinked and periodically 403, move, or die. Image keeps cards and banners free of broken-image boxes and layout shift by always emitting intrinsic dimensions, trying a known-good fallback source, and finally rendering consumer-provided fallback content. Priority is opt-in for the one above-the-fold image per page.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| src | `string` | — | yes | Primary image URL; hotlinked sources are expected |
| alt | `string` | — | yes | Accessible description of the image content |
| fallbackSrc | `string` | — | no | Second URL tried before the fallback node, such as generated placeholder art |
| fallback | `React.ReactNode` | — | no | Content rendered when every URL has failed (icon, initials, empty panel) |
| priority | `boolean` | `false` | no | Load eagerly with high fetch priority for the LCP image |
| width | `number` | `1200` | no | Intrinsic width used to reserve layout space (CLS) |
| height | `number` | `630` | no | Intrinsic height used to reserve layout space (CLS) |
| className | `string` | — | no | Classes applied to the image element |
| imgClassName | `string` | — | no | Additional image classes, merged with className |
| sizes | `string` | — | no | Responsive sizes hint for the browser's source selection |
| style | `React.CSSProperties` | — | no | Inline styles for the image element |

## Examples

### Event card image

Hotlinked organizer image with a generated fallback

```tsx
<Image
  src={event.imageUrl}
  fallbackSrc="/images/event-placeholder.svg"
  alt={`${event.title} event image`}
  width={1200}
  height={630}
/>
```

### Hero image

The single above-the-fold image loads eagerly

```tsx
<Image
  src="/hero.jpg"
  alt="Dancers on the competition floor"
  width={1600}
  height={900}
  priority
/>
```

### Initials fallback

Render an identity tile when no image survives

```tsx
<Image
  src={org.imageUrl ?? ''}
  alt={org.name}
  width={96}
  height={96}
  fallback={<span aria-hidden>{initials(org.name)}</span>}
/>
```

## Anti-patterns

- **Don't omit width and height** — Without intrinsic dimensions the browser cannot reserve space and a failed image shifts the page. The defaults exist so there is no reason to omit them; override them to the real aspect ratio.
- **Don't set priority on every image** — Only one image should compete for LCP priority. Marking a grid eager delays everything else.
- **Don't describe the component in alt text** — Alt text describes the content. Screen readers already announce that it is an image.

## Accessibility

- **Alternative text**: alt is required by the type system and rendered on every img
- **Layout stability**: Intrinsic width and height are always rendered, including after a fallback swap
- **Failed image**: A failed chain renders fallback content instead of a broken-image glyph

## Composition

- Related: ArticleCard, EntityCard, Hero, PageHeader

