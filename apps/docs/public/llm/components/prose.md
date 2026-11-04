# Prose

Self-contained long-form typography for rendered markdown/MDX: headings, links, lists, code, tables, quotes and figures.

> Import: `import { Prose } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/prose.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Content sites need consistent article typography without depending on the Tailwind typography plugin. Prose styles rendered HTML via child selectors, so any remark/MDX pipeline can drop output inside.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| size | `'sm' | 'md' | 'lg'` | `md` | no | Type scale for body and headings. |

## Examples

### Article body

Wrap MDX/remark output; keep Shiki/KaTeX as-is.

```tsx
<Prose size="md">
  {renderedMarkdown}
</Prose>
```

## Anti-patterns

- **Don't use prose for app UI** — Prose targets article content; forms and dashboards use Text/Heading.

## Accessibility

- **Heading anchors**: scroll-mt offsets headings under sticky headers

## Composition

- Compose with **TableOfContents** — Pair long articles with a TOC + useScrollSpy
  
  ```tsx
  <Prose>{content}</Prose><TableOfContents headings={headings} />
  ```
- Related: TableOfContents, Heading, Text, CodeBlock

