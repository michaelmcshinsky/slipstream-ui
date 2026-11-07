---
"@slipstream-ui/core": patch
---

Fix pagination typography and harden the Tailwind v4 verification fixture.

- Pagination now renders an ellipsis glyph, en-dash range summaries and
  `«` / `»` boundary glyphs, matching the documented summary and tests.
- `verify:tailwind-v4` runs the installed `@tailwindcss/cli` binary directly
  instead of calling `npx --no-install @tailwindcss/cli`, which fails on
  Windows. The fixture also verifies the new inverse selectors.
