# CodeBlock

Syntax-highlighted code block with language label and copy-to-clipboard button.

> Component ID: `code-block`
> Import: `import { CodeBlock } from '@slipstream-ui/ai'`
> Docs: https://slipstreamui.com/docs/components/code-block
> Registry: https://slipstreamui.com/registry/code-block.json
> Tier: atom · Package: @slipstream-ui/ai@0.11.3
> Manifest schema: v1 · manifest: v1

## Design intent

Display AI-generated or referenced code readably with one-click copy.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| code | `string` | — | yes | Raw code to display. |
| language | `string` | `tsx` | no | Prism language identifier. |
| showCopyButton | `boolean` | `true` | no | Show/hide the copy control. |
| onCopied | `(code: string) => void` | — | no | Called with the code after a successful clipboard write. |

## Examples

### Basic

```tsx
<CodeBlock code={sourceCode} language="ts" />
```

## Anti-patterns

- **Do not nest CodeBlock in Response code fences manually** — Response already routes fenced code to CodeBlock.

## Accessibility

- **Copy button**: Icon-labeled button with aria-label that flips to Copied.

