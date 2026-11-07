---
"@slipstream-ui/core": patch
"@slipstream-ui/themes": patch
"@slipstream-ui/cli": patch
---

Integration fixes surfaced by adopting Slipstream in a Next.js App Router site: `Badge` gains `neutral` and `accent` variants and now renders an inline `span`, `Alert` accepts `danger` as an alias of `destructive`, `EmptyState` accepts an `actions` alias and a `titleAs` heading level, `Textarea` stops narrowing native `value`/`onChange` so react-hook-form and other native form libraries type-check, the `add` command resolves peer dependencies from the correct manifest and drops two unused bindings, and the Tailwind v4 docs point at the prebuilt `@slipstream-ui/themes/styles.css` defaults.
