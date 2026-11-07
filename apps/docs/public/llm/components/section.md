# Section

Full-width page section with a surface tone, vertical rhythm and an optional centered container.

> Import: `import { Section } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/section.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Marketing and content pages alternate background bands and vertical padding. Section owns the band and the inner container so pages stop repeating py-* and background classes, and tone="inverse" scopes the token ladder for a readable dark band.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| tone | `'default' | 'muted' | 'subtle' | 'brand' | 'inverse'` | `default` | no | Surface treatment. inverse flips background, foreground, card, border and muted tokens for its subtree. |
| padding | `'none' | 'sm' | 'md' | 'lg' | 'xl'` | `md` | no | Vertical rhythm. md is py-14 / sm:py-16. |
| width | `'sm' | 'md' | 'lg' | 'xl' | 'full'` | `lg` | no | Inner Container width. |
| container | `boolean` | `true` | no | Wrap children in a centered Container. |
| containerClassName | `string` | — | no | Extra classes for the inner Container. |
| as | `'section' | 'div' | 'article' | 'header' | 'footer' | 'main' | 'aside'` | `section` | no | Semantic element to render. |

## Examples

### Inverse CTA band

A dark band whose child components inherit inverse surface tokens.

```tsx
<Section tone="inverse" padding="lg">
  <SectionHeading title="Ready to exit?" align="center" />
</Section>
```

### Muted feature band

A tinted band with a wider content cap.

```tsx
<Section tone="muted" width="xl">
  <FeatureGrid />
</Section>
```

## Anti-patterns

- **Don't put a Section inside a Section** — Nesting bands doubles padding and can reset the tone. Use one Section per band and plain layout elements inside it.
- **Don't hardcode colors inside a tone** — Use semantic tokens so the inverse scope can flip card, border and muted text automatically.

## Accessibility

- **Tone scoping**: tone=inverse sets background, foreground, card, border and muted CSS variables on the section
- **Landmark**: Renders a section element by default

## Composition

- Compose with **Container** — Section renders Container when container is true
  
  ```tsx
  <Section width="lg"><Hero /></Section>
  ```
- Compose with **Hero** — Hero is placed inside Section; Section owns the band
  
  ```tsx
  <Section tone="inverse"><Hero title="." /></Section>
  ```
- Related: Container, Hero, CTASection, PageHeader

