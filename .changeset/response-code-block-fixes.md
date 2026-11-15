---
"@slipstream-ui/ai": patch
---

fix(ai): render unlabelled fenced code as a block, and stop repairing identifiers

- `Response` treated a fenced block with no language and a single line as inline code,
  because the inline test looked at the text after its trailing newline was stripped. It
  now tests the source text, so ```` ```\nfoo\n``` ```` renders through `CodeBlock`.
- `closeIncompleteMarkdown` no longer appends a stray closer for identifiers: complete
  inline code spans are ignored when counting emphasis, and intraword underscores in
  `snake_case` are not treated as italic markers.
- `CodeBlock` and `Response` now ship the jest-axe assertion the component pipeline
  requires, plus coverage for clipboard failure, overflow tab stops, unknown languages,
  empty input, raw HTML and unsafe link protocols, and dark-theme syntax switching.
