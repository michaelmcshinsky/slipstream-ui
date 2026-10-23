# CodeBlock

Syntax-highlighted code block with language label and copy-to-clipboard button.

> Import: `import { CodeBlock } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/code-block.json
> Tier: atom · Package: @slipstream-ui/ai

## Design intent

Display AI-generated or referenced code readably with one-click copy.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| code | `string` | — | yes | Raw code to display. |
| language | `string` | `tsx` | no | Prism language identifier. |
| showCopyButton | `boolean` | `true` | no | Show/hide the copy control. |

## Examples

### Basic

```tsx
<CodeBlock code={sourceCode} language="ts" />
```

## Anti-patterns

- **Do not nest CodeBlock in Response code fences manually** — Response already routes fenced code to CodeBlock.

## Accessibility

- **Copy button**: Icon-labeled button with aria-label that flips to Copied.

