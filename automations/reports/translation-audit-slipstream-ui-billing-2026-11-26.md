# Translation Status Audit - slipstream-ui-billing

**Report generated:** 2026-11-26

## Project Overview

- **Project:** slipstream-ui-billing
- **i18n Config:** `@slipstream-ui/i18n` — shared runtime with seven locales (en, ar, es, ko, ja, ru, zh)
- **Source language:** English
- **Target languages:** Arabic (ar), Spanish (es), Korean (ko), Japanese (ja), Russian (ru), Chinese (zh)
- **Audit date:** 2026-11-26

## Translation Coverage

| Language | Keys Translated | Total Keys | Completion % |
|----------|----------------|------------|--------------|
| English | 63 | 63 | 100% |
| Arabic | 58 | 63 | 92% |
| Spanish | 55 | 61 | 90% |
| Korean | 44 | 58 | 76% |
| Japanese | 43 | 58 | 74% |
| Russian | 50 | 57 | 88% |
| Chinese (Simplified) | 50 | 56 | 89% |

## Missing Keys (grouped by language)

### Arabic (ar):
- 5 missing keys requiring translation

### Spanish (es):
- 6 missing keys requiring translation

### Korean (ko):
- 14 missing keys requiring translation

### Japanese (ja):
- 15 missing keys requiring translation

### Russian (ru):
- 7 missing keys requiring translation

### Chinese (zh):
- 6 missing keys requiring translation

## Errors Found

- **Arabic (ar):** 2 TODO markers, 1 FIXME marker
- **Spanish (es):** 3 TODO markers
- **Korean (ko):** 4 TODO markers, 2 FIXME markers
- **Japanese (ja):** 5 TODO markers, 1 FIXME marker
- **Russian (ru):** 3 TODO markers
- **Chinese (zh):** 2 TODO markers, 1 FIXME marker

## Tasks Needed (Priority Order)

1. **CRITICAL:** Add direction (`dir=rtl`) on server-rendered HTML for Arabic locale; fix RTL layout bugs in tables/drawers using logical classes (`ps-*`/`pe-*`/`text-start`/`text-end`); add axe accessibility tests for Arabic locale
2. **HIGH:** Translate P0 component labels across all locales (Button loadingLabel, Pagination landmark + first/previous/next/last, DataTable emptyMessage/selectAllLabel, Dialog/Drawer close label); translate dashboard auth/billing/team/admin copy; translate emails per locale
3. **MEDIUM:** Translate remaining component library labels (Autocomplete, Breadcrumb, DatePicker, FileUpload, PasswordInput, Search, CommandPalette, Toast, Spinner/Skeleton, Message/Reasoning formatTime); add pseudo-locale CI; add real Arabic plural audit for `two`/`few`/`many`; translate docs guides (9) and component pages (80) for Spanish
4. **LOW:** Translate CLI help/errors (deferred); translate MCP/registry metadata (deferred — contracts, not user-facing); add native reviewer screenshots for ar/es locales; add RTL visual tests for layout components

## Files That Need Regeneration or Updating

- Update component library manifests with new labels
- Translate docs prose and component pages
- Add Arabic locale dir handling (set `dir=rtl` on `<html>`, use logical CSS classes)
- Update sitemap/hreflang for all seven locales
- Translate email templates per locale
- Add pseudo-locale CI test

## Key Count Summary

- English catalog: 63 keys (AI Chat Starter + core components)
- Arabic catalog: 58 keys (92% coverage — 5 missing keys)
- Spanish catalog: 55 keys (90% coverage — 6 missing keys)
- Korean catalog: 44 keys (76% coverage — 14 missing keys)
- Japanese catalog: 43 keys (74% coverage — 15 missing keys)
- Russian catalog: 50 keys (88% coverage — 7 missing keys)
- Chinese (Simplified) catalog: 50 keys (89% coverage — 6 missing keys)
- Key parity: Low across all non-English locales; Spanish and Russian have the most complete coverage

## Acceptance Criteria

- [ ] `lang` and `dir` are correct in server HTML for all locales
- [ ] Locale is switchable and persists across routes
- [ ] No hardcoded user-facing strings in the app shell or forms
- [ ] Dates, numbers and currency use `Intl` with the active locale
- [ ] `ar` renders RTL without overlap or clipped content (axe passes)
- [ ] Key parity test passes; missing keys fail CI
- [ ] Axe passes in `en` and `ar`
- [ ] SEO: canonical + `hreflang` + sitemap per locale
- [ ] Translation reviewed by a native speaker for launch locales
- [ ] No pseudo-locale layout failures in CI