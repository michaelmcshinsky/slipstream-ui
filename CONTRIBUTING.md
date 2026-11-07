# Contributing

Thanks for your interest in contributing.

## Ground rules

- Open an issue before large changes to discuss direction.
- Keep pull requests focused: one concern per PR.
- Follow the existing code style (lint must pass locally).
- Add or update tests for behavior changes.
- Update docs **and manifests** when a public API changes.

## Development

```bash
pnpm install
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm validate:manifests
```

CI runs the same gate (typecheck → lint → test → build → manifest validation → registry/LLM generation). Green CI is required before review.

## Adding or changing a component

1. Source in `packages/<pkg>/src/components/<dir>/` (`type` over `interface`, no `any`, `'use client'` only with hooks).
2. Barrel export in the directory `index.ts`; re-export from the package `src/index.ts`.
3. `COMPONENT_MANIFEST` in `src/manifests/<id>.manifest.json` documenting every non-inherited prop, plus examples, anti-patterns, accessibility and composition rules.
4. Tests: behavior + keyboard where relevant + a `jest-axe` assertion.
5. Docs: `apps/docs/app/docs/components/<slug>/page.tsx` (metadata) and `demo.tsx` (interactive), then add entries to `lib/nav.ts` and `lib/search-index.ts`.
6. Regenerate: `pnpm generate:registry && pnpm generate:llm-docs`.
7. Verify: `pnpm validate:manifests`.

## Docs component pages

Component documentation uses a two-file split in `apps/docs/app/docs/components/<slug>/`:

- `page.tsx` — server component: exports `metadata` (title/description) and renders the demo.
- `demo.tsx` — the interactive content (mark `'use client'` at the top when it needs hooks).

Keep the wrapper's title/description in sync with the component's `COMPONENT_MANIFEST`. When the manifest id differs from the route id, pass `manifestId` to `ComponentPage` so registry/CLI/llm links stay correct.

## Accessibility

Every interactive component must be keyboard operable, expose correct roles/aria, show a focus ring, respect `prefers-reduced-motion`, and pass jest-axe. Accessibility regressions are treated as bugs.

## Styling

Use semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`…), literal Tailwind class maps for dynamic values (class names in template strings are purged), and stay inside the documented z-index ladder.

## Releases

Use Changesets. Any change to a published package (`core`, `ai`, `themes`, `cli`, `registry`, `mcp-server`) needs a changeset:

```bash
pnpm changeset
```

- **minor** - new components, new props, new tokens
- **patch** - fixes, docs, internal changes

Release gates and packaging steps live in [docs/release-checklist.md](docs/release-checklist.md).

## Commits

Use clear, descriptive commit messages. Reference issue numbers when applicable.
