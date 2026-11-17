# Release checklist

Run from the repository root before tagging or publishing.

## Gates

- [ ] `pnpm install`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm validate:manifests` (schema, drift, versions, counts, tokens, release notes)
- [ ] `pnpm check:llm`
- [ ] `pnpm check:components`
- [ ] `pnpm check:tokens`
- [ ] `pnpm check:release`
- [ ] `pnpm check:audit` (allowlists only the documented unpatched picomatch advisory)
- [ ] `node scripts/test-packaged-styles.mjs`
- [ ] `pnpm verify:tailwind-v4`
- [ ] `pnpm verify:tailwind3`
- [ ] `pnpm build`
- [ ] `node scripts/audit-sizes.mjs` (budgets in `docs/bundle-size.md`)
- [ ] `pnpm bench:check` when benchmark cases changed

## Site evidence (built docs)

- [ ] `pnpm --filter slipstream-ui-docs build`
- [ ] `pnpm --filter slipstream-ui-docs start -- -p 3111`
- [ ] `pnpm --filter slipstream-ui-docs audit:a11y -- http://localhost:3111` (58 page runs)
- [ ] `pnpm --filter slipstream-ui-docs smoke:routes -- http://localhost:3111` (135 routes)
- [ ] `pnpm --filter slipstream-ui-docs audit:perf -- http://localhost:3111` (98–100 performance)
- [ ] `E2E_BASE_URL=http://localhost:3111 pnpm test:e2e` (16 journeys)

## Packaging

- [ ] A changeset exists for every published package (`core`, `ai`, `themes`, `cli`, `registry`, `mcp-server`)
- [ ] Add the release entry to `apps/docs/lib/releases.ts` and bump `release.json` before `version-packages` (the version PR may be opened by CI; edit that branch and rerun `pnpm validate:manifests` — `version-packages` only warns, CI blocks the merge)
- [ ] `packages/mcp-server/server.json` version matches `packages/mcp-server/package.json`
- [ ] `pnpm generate:registry` and `pnpm generate:llm-docs` output is committed
- [ ] `README.md` component counts match the manifests
- [ ] `node scripts/test-packaged-styles.mjs` resolves the packed `styles.css`, `styles-full.css` and themes sheet
- [ ] No generated file references a component without a source

## Publish

- [ ] `pnpm version-packages`
- [ ] Commit the version bump and push; CI publishes with npm provenance
- [ ] Verify the npm dist-tags and the docs deployment
