# Flex / FlexItem

Typed flexbox container (direction/align/justify/wrap/gap) with FlexItem for per-child grow/shrink/basis controls.

> Import: `import { Flex } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/flex.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Layout utilities should be discoverable and tokenized: Flex turns display:flex into named props with token gaps, so spacing comes from the design system instead of scattered arbitrary classes. FlexItem handles per-child flex values through style (not runtime-built classes) so nothing gets purged from the stylesheet.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| direction | `'row' | 'column'` | `row` | no | Main axis direction. |
| align | `'start' | 'center' | 'end' | 'stretch' | 'baseline'` | — | no | Cross-axis alignment (align-items; align-self on FlexItem). |
| justify | `'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'` | — | no | Main-axis distribution (justify-content). |
| wrap | `boolean` | `false` | no | Allow items to wrap onto multiple lines. |
| gap | `'none' | 'sm' | 'md' | 'lg' | 'xl'` | `md` | no | Token gap between children. |
| as | `'div' | 'span' | 'section' | 'article' | 'nav' | 'header' | 'footer' | 'li'` | — | no | Semantic element (FlexItem also supports 'li', Flex supports the structural elements). |
| grow | `boolean | string` | — | no | flex-grow for this FlexItem (true = 1, or a numeric string). |
| shrink | `boolean | string` | — | no | flex-shrink for this FlexItem (false = 0, or a numeric string). |
| basis | `string` | — | no | flex-basis for this FlexItem (e.g. '0', '200px', 'auto'). |

## Examples

### Toolbar row

Token gaps keep spacing on the design system grid.

```tsx
<Flex align="center" justify="between" gap="sm">
  <Text size="sm" weight="medium">Title</Text>
  <Flex gap="sm">
    <Button size="sm" variant="ghost">Cancel</Button>
    <Button size="sm">Save</Button>
  </Flex>
</Flex>
```

### Sidebar + content

FlexItem values render via inline style — arbitrary numeric utilities would be purged.

```tsx
<Flex gap="lg">
  <FlexItem basis="240px" shrink={false}>
    <SidebarNav />
  </FlexItem>
  <FlexItem grow>
    <Article />
  </FlexItem>
</Flex>
```

## Anti-patterns

- **Don't rebuild layout primitives with arbitrary classes** — Runtime-built class strings (grow-[${value}]) never make it into the compiled CSS. Use Flex/FlexItem props — they emit style values where Tailwind can't.
- **Don't wrap a single child** — A Flex with one child adds a pointless layout layer — use Block with utilities instead.

## Accessibility

- **Layout-only semantics**: Renders div/span/section… — no interactive or live behavior is added
- **Wrap keeps reading order**: flex-wrap reflows visually; DOM order (reading order) never changes

## Composition

- Compose with **Grid** — Flex for one-axis alignment; Grid for two-axis layout
- Compose with **Block** — Blocks are the semantic wrappers Flex arranges
- Related: Grid, Block, List

