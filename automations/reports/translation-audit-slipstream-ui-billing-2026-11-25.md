# Translation Status Audit - slipstream-ui-billing
**Report generated:** 2026-11-25

## Project Overview

- **Project:** slipstream-ui-billing
- **i18n Config:** `@slipstream-ui/i18n` — shared runtime with seven locales (en, ar, es, ko, ja, ru, zh)
- **Source language:** English
- **Target languages:** Arabic (ar), Spanish (es), Korean (ko), Japanese (ja), Russian (ru), Chinese (zh)
- **Audit date:** 2026-11-25

## Translation Coverage

| Language | Keys Translated | Total Keys | Completion % |
|----------|----------------|------------|--------------|
| English | 200+ | 200+ | 100% |
| Arabic | ~20 | 200+ | ~10% |
| Spanish | ~50 | 200+ | ~25% |
| Korean | ~10 | 200+ | ~5% |
| Japanese | ~10 | 200+ | ~5% |
| Russian | ~10 | 200+ | ~5% |
| Chinese (Simplified) | ~10 | 200+ | ~5% |

## Missing Keys (grouped by language)

### Arabic (ar):
- Component library hardcoded strings (60+ items listed in i18n-plan.md):
  - Button: loading screen-reader text (`Loading`)
  - Pagination: `Pagination`, `First/Previous/Next/Last page`
  - DataTable: `No results.`, `Select all rows`
  - Dialog / Drawer: `Close dialog` / `Close drawer`
  - Autocomplete: `Clear input`, `Suggestions`
  - Breadcrumb: `Breadcrumb` landmark label
  - DatePicker: `Clear date`
  - FileUpload: `Selected files`
  - PasswordInput: show/hide password labels
  - Search: default empty text
  - CommandPalette: default placeholder
  - Toast: close label / region label
  - Spinner / Skeleton: loading labels
  - Message: `You`, `Assistant`, `Retry`, `Edit`, `Save & resend`, `Cancel`, `Edit message`
  - Reasoning: `Reasoning`, `step(s)`, `Step n`, `thinking…`
  - ToolCall: `Pending/Running/Completed/Failed`, `Arguments`, `Result`, `Error`
  - Confirmation: `Approve/Reject/Approved/Rejected`
  - StreamingIndicator: `Generating...`
  - MessageActions: `Copy`, `Copied`, helpful/not helpful, `Regenerate`
  - PromptInput: caller-supplied placeholder/send/stop, but defaults are English
- AI Chat Starter: Message/Reasoning/ToolCall/Confirmation/MessageActions/PromptInput/StreamingIndicator labels missing Arabic forms

### Spanish (es):
- AI Chat Starter: Full localization done
- Docs site: ~80 component pages, 9 guides, marketing, legal all English-only (`lang="en"`)
- Dashboard app: auth, billing, team, admin copy, validation/API errors, emails unlocalized
- Component library P0 labels missing: Button loadingLabel, Pagination landmark + first/previous/next/last, DataTable emptyMessage/selectAllLabel
- Component library P1 labels missing: Autocomplete clear/input/suggestions, Breadcrumb landmark, DatePicker clear, FileUpload selected files/remove, PasswordInput show/hide labels, Search empty text, CommandPalette placeholder
- Component library P2 labels: Toast close/region labels, Spinner/Skeleton loading labels, Message/Reasoning formatTime/Intl locale prop

### Korean/Japanese/Russian/Chinese:
- Minimal coverage — mostly AI Chat Starter backend and error messages
- Component library catalogs empty or with English defaults only
- Hardcoded English strings across all component library components

## Errors Found

- Direction (dir) not set on html element for RTL locales (Arabic) — layout may have overlap/cliped content
- Hardcoded English strings in component library across all locales (60+ items)
- `toLocaleTimeString()` and `toLocaleString()` calls without locale argument in AI components
- Plural forms: Arabic `two`/`few`/`many` categories fall back to `_other`; explicit forms needed when copy needs them
- Pseudo-locale (`en-XA`) not used for layout stress testing
- Component manifest drift between TS types and JSON manifests

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

- English catalog: ~200 keys (AI Chat Starter + core components)
- Arabic catalog: ~20 keys (10% coverage — AI Chat Starter backend messages)
- Spanish catalog: ~50 keys (25% coverage — AI Chat Starter + some docs shell copy)
- Korean/Japanese/Russian/Chinese catalogs: ~10 keys each (5% coverage — minimal AI Chat Starter messages)
- Key parity: Very low across all non-English locales

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