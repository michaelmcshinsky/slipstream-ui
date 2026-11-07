---
"@slipstream-ui/core": minor
"@slipstream-ui/cli": patch
"@slipstream-ui/themes": minor
---

Add integration escape hatches and fix the registry install path.

- SectionHeading, PageHeader: `titleClassName`, `descriptionClassName` and
  `eyebrowClassName` for host display typography.
- TableOfContents: `ariaLabel` and `labelClassName`; active links are
  underlined.
- Breadcrumb: `truncateCurrent` for long current-page labels.
- Select: native `<option>` children in addition to `options`/`groups`.
- CLI `add`: copy the component's relative dependency closure and
  `components/slipstream/utils/`, rewrite support imports, and skip existing
  files unless `--overwrite`.
- CLI `diff` and `add`: read `componentsDir` from `slipstream.config.json`
  and reject paths outside the project.
- CLI `diff`: normalize support imports and line endings before comparing, so
  a copied install does not report false drift.
- Dialog and Drawer: share a modal layer stack for body scroll lock and
  nested Escape handling.
- CLI `init`: extend an existing CSS-variable theme with only the missing
  Slipstream tokens instead of skipping stylesheet setup.
- Themes: publish the Tailwind CSS 3 preset at
  `@slipstream-ui/themes/tailwind-preset`.
- Tailwind 3 preset: map timing keys as `standard`, `in`, and `out` so
  `ease-standard` compiles. The previous `ease-*` keys generated
  `ease-ease-*` and never produced the utility.
- Registry payloads stamp the package version instead of stale
  per-component versions.
- Docs: use `npx @slipstream-ui/cli@latest`, and document the new add/init
  behaviour and the Tailwind preset.
