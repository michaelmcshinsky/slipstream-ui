# Contributing

Thanks for your interest in contributing.

## Ground rules

- Open an issue before large changes to discuss direction.
- Keep pull requests focused: one concern per PR.
- Follow the existing code style (lint should pass locally before you push).
- Add or update tests for behavior changes.
- Update documentation when behavior or public API changes.

## Development

1. Install dependencies with the package manager documented in the README.
2. Use the scripts in package.json for lint, test, and build.
3. Ensure CI is green before requesting review.

## Docs component pages

Component documentation uses a two-file split in `apps/docs/app/docs/components/<slug>/`:

- `page.tsx` — server component: exports `metadata` (title/description) and renders the demo.
- `demo.tsx` — the interactive content (mark `'use client'` at the top when it needs hooks).

Keep the wrapper's title/description in sync with the component's
`COMPONENT_MANIFEST`. When the manifest id differs from the route id
(route `sources` → manifest `source`), pass `manifestId` to `ComponentPage`
so registry/CLI/llm links stay correct.

## Commits

Use clear, descriptive commit messages. Reference issue numbers when applicable.