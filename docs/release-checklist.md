# Release checklist

Run from the repository root before tagging or publishing.

## Gates

- [ ] `pnpm install`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm validate:manifests`
- [ ] `pnpm check:llm`
- [ ] `pnpm check:components`
- [ ] `node scripts/test-packaged-styles.mjs`
- [ ] `pnpm verify:tailwind-v4`
- [ ] `pnpm verify:tailwind3`
- [ ] `pnpm build`
- [ ] `pnpm bench:check` when benchmark cases changed

## Packaging

- [ ] A changeset exists for every published package (`core`, `ai`, `themes`, `cli`, `registry`, `mcp-server`)
- [ ] `pnpm generate:registry` and `pnpm generate:llm-docs` output is committed
- [ ] `README.md` component counts match the manifests
- [ ] `node scripts/test-packaged-styles.mjs` resolves the packed `styles.css`, `styles-full.css` and themes sheet
- [ ] No generated file references a component without a source

## Publish

- [ ] `pnpm version-packages`
- [ ] Commit the version bump and push; CI publishes with npm provenance
- [ ] Verify the npm dist-tags and the docs deployment
