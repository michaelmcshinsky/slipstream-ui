# Internationalization plan — all apps

**Date:** 2026-11-06
**Scope:** `apps/docs`, `apps/app`, `apps/starters/ai-chat`, `apps/playground`,
`packages/core`, `packages/ai`, `packages/cli`, MCP/registry surfaces
**Status:** shared runtime shipped; AI Chat Starter fully localized (en, ar, es);
docs, dashboard and playground have locale providers, switchers and shell copy.
Content, path-prefixed docs URLs, dashboard flows and emails remain.

---

## 1. Goals and non-goals

### Goals

- Every user-facing string, date, number, currency and plural is locale-aware.
- Correct `lang` and `dir` on the server-rendered HTML, not only after hydration.
- English remains the source of truth; a missing key fails CI.
- Locale is explicit and shareable (URL or cookie), never guessed silently.
- RTL is a first-class layout and accessibility state, not a CSS afterthought.

### Non-goals

- Translating code identifiers, API names, manifest JSON keys or MCP tool names.
- Machine-translating component examples or code blocks.
- Per-user content translation (chat messages, user data).
- Automatic geo-redirects. Users choose; search engines see every locale.

---

## 2. Current audit

| Surface | Locale today | Strings | Direction | Notes |
|---|---|---|---|---|
| `apps/starters/ai-chat` | en, ar, es | **Done** | `dir` from locale | Cookie + switcher; localized mock backend and checkout error |
| `apps/docs` | en only | ~80 component pages, 9 guides, marketing, legal | `lang="en"` | Largest content surface |
| `apps/app` | en only | auth, billing, team, admin, emails | `lang="en"` | Server actions/API errors, currency, dates |
| `apps/playground` | en only | dev chrome | `lang="en"` | Internal; low priority |
| `packages/core` | en defaults | see §5 | LTR classes mostly | Label props exist on some components |
| `packages/ai` | en defaults | see §5 | LTR | `Message`, `Reasoning`, `ToolCall` now accept labels |
| `packages/cli` | en | help/errors | n/a | Developer tool; defer |

Hardcoded strings found in the component library include:

- `Button`: loading screen-reader text (`Loading`).
- `Pagination`: `Pagination`, `First/Previous/Next/Last page`.
- `DataTable`: `No results.`, `Select all rows`.
- `Dialog` / `Drawer`: `Close dialog` / `Close drawer`.
- `Autocomplete`: `Clear input`, `Suggestions`.
- `Breadcrumb`: `Breadcrumb` landmark label.
- `DatePicker`: `Clear date`.
- `FileUpload`: `Selected files`.
- `PasswordInput`: show/hide password labels.
- `Search`: default empty text.
- `CommandPalette`: default placeholder.
- `Toast`: close label / region label.
- `Spinner` / `Skeleton`: loading labels.
- `Message`: `You`, `Assistant`, `Retry`, `Edit`, `Save & resend`, `Cancel`, `Edit message`.
- `Reasoning`: `Reasoning`, `step(s)`, `Step n`, `thinking…`.
- `ToolCall`: `Pending/Running/Completed/Failed`, `Arguments`, `Result`, `Error`.
- `Confirmation`: `Approve/Reject/Approved/Rejected`.
- `StreamingIndicator`: `Generating...`.
- `MessageActions`: `Copy`, `Copied`, helpful/not helpful, `Regenerate`.
- `PromptInput`: caller-supplied placeholder/send/stop, but defaults are English.
- AI components format timestamps with `toLocaleTimeString()` and no locale argument.

---

## 3. Architecture (implemented foundation)

`@slipstream-ui/i18n` is a standalone package with no framework coupling except
an optional React entry.

```
packages/i18n/
  src/locales.ts        supported locales, labels, direction, resolution
  src/messages/en.ts    source catalog (typed)
  src/messages/ar.ts    Arabic (RTL)
  src/messages/es.ts    Spanish
  src/translate.ts      dot paths, interpolation, plural selection
  src/format.ts         Intl number/date/date-time/relative time
  src/react-entry.ts    'use client' boundary -> I18nProvider, useI18n
  src/index.ts          server-safe runtime (no React)
```

**Why two entry points.** Next.js server components use the `react-server`
condition, where client-only React APIs are unavailable. The provider lives at
`@slipstream-ui/i18n/react` and is marked `'use client'`; the pure runtime stays
in `@slipstream-ui/i18n`. This is the difference between a working RSC build and
`React.createContext is not a function`.

**Locale transport.**

- Next apps: `slipstream-locale` cookie, read with `cookies()` in the root layout.
- First visit: `Accept-Language` fallback for routes/errors that run before the
  cookie exists.
- Vite/playground: `localStorage` + `document.documentElement.lang/dir`.
- Docs (planned): locale-prefixed URLs, with the cookie only as a preference.

**Pluralization.** `Intl.PluralRules` selects a category; the catalog provides
`key_one` / `key_other` and falls back to `_other`. Arabic categories such as
`two` / `few` / `many` currently fall back to `_other`; add explicit forms when
the copy needs them.

---

## 4. Per-app plan

### 4.1 AI Chat Starter — DONE

Implemented:

- `en` / `ar` / `es` catalogs; typed keys; `satisfies Messages`.
- Server-rendered `<html lang dir>` from the cookie.
- Header language switcher; cookie persistence; reload.
- All shell, empty state, activity panel, backend panel, attachments and
  consent copy translated.
- `Message`, `Reasoning`, `ToolCall`, `Confirmation`, `MessageActions`,
  `PromptInput`, `StreamingIndicator` receive localized labels.
- Mock backend reasoning/text/tool/citation/approval localized.
- OpenAI-compatible adapter adds a “respond in X” system message.
- Checkout 503 error localized from `Accept-Language`.
- Tests: locale resolution, interpolation, plurals, RTL render, Arabic/Spanish
  shell copy, localized mock events, localized checkout error, axe on empty state.

Follow-ups:

- Add `dateStyle`/`timeStyle` props to `Message`/`Reasoning` timestamps (see §5).
- Add a pseudo-locale (`en-XA`) for layout stress testing.
- Add a real `ar` plural audit for `two`/`few`/`many`.

### 4.2 Docs site — the largest effort

**Implemented interim:** cookie locale, `I18nProvider`, navbar language switcher,
translated primary nav/search/theme labels, and server `lang`/`dir`.
**Remaining:** path-prefixed URLs, per-locale metadata/`hreflang`/sitemap,
locale-keyed search index, and translated content.

Recommended URL strategy: **path prefix**, not subdomain.

```
/                 en (default, no prefix)
/ar               ar
/es               es
/ar/docs/...      ar docs
```

Why: one deployment, one sitemap, simple `hreflang`, no cross-domain cookies,
and the existing Next App Router can generate static params per locale.

Work breakdown:

1. **Routing.** Add `app/[locale]/...` or a middleware rewrite that maps
   `/ar/...` to a locale segment. Keep `/` as English. Do not auto-redirect.
2. **Layout shell.** Move `SiteHeader`, `SiteFooter`, nav, search palette,
   cookie banner, 404 and legal chrome behind the provider.
3. **Metadata.** Localized `title`/`description`, canonical per locale,
   `alternates.languages` (`hreflang`) for every route, localized OG images.
4. **Navigation and search.** `NAV_SECTIONS` and `SEARCH_INDEX` become
   locale-keyed. Search must index the translated page, or explicitly fall back
   to English with a badge.
5. **Guides (9).** Translate the prose. Code blocks and API identifiers stay
   English. Add locale-specific screenshots only when the UI is localized.
6. **Component pages (80).** Highest volume. Translate the page intro,
   design intent, prop descriptions, anti-patterns and accessibility notes.
   The manifest JSON remains English; if localized manifests are desired, add a
   `description_i18n` overlay rather than translating the contract keys.
7. **Sitemap/robots.** Emit one URL per locale; `hreflang` pairs; no duplicate
   canonical.
8. **Fallback.** If a page is missing a translation, show the English page with
   a visible language note and a link to the English canonical; never return a
   soft 404.
9. **Testing.** Link checker per locale, axe in `ar`/RTL, visual diff for the
   header/footer/component demos, Lighthouse per locale.

Effort: ~3–5 engineer-weeks for infrastructure + shell + 9 guides; 80 component
pages are translation/vendor work (~1–2 weeks of review) plus automation.

### 4.3 Dashboard app (`apps/app`)

**Implemented interim:** root locale provider, dashboard language switcher,
translated dashboard nav, sign-out, and suspended-account copy.

**Remaining:** auth/billing/team/admin copy, validation/API errors, `User.locale`
persistence, `Intl` currency/dates, emails and RTL audit. Scope: auth, billing,
team, admin, emails.

1. Add the same cookie/`lang`/`dir` root layout and a locale switcher in the
   dashboard header.
2. Store `User.locale` (Prisma migration) and use it as the default after login;
   cookie overrides for the session.
3. Translate server actions, route-handler errors and Zod messages. Error codes
   stay stable; map codes to localized messages at the boundary.
4. Currency and dates: use `Intl.NumberFormat(locale, { style: 'currency',
   currency })` and `Intl.DateTimeFormat(locale)`. Never `toLocaleString()`
   without a locale.
5. RTL tables: use logical `ps-*`/`pe-*`/`text-start`/`text-end`; audit the
   DataTable sticky columns and drawer side.
6. Emails: one template per locale, selected from `User.locale`; translate
   subject, body, CTA and footer. Keep the token/link logic identical.
7. Stripe: pass `locale` to Checkout; keep prices in one currency unless a
   multi-currency product decision is made.
8. Legal pages: translate privacy/terms with counsel review; the English version
   remains the governing text and must say so.
9. Tests: authenticated flow in `ar` and `es`, RTL screenshot, email snapshot per
   locale, currency formatting, plural date strings.

Effort: ~2–3 engineer-weeks plus translation and legal review.

### 4.4 Playground

**Implemented interim:** provider + shared locale switcher. Remaining:
pseudo-locale and CI/visual checks.

Internal. Add a locale toggle that sets the provider and `dir`, plus an RTL
layout stress switch. Do not translate the dev copy as a product requirement.

### 4.5 Component library (`packages/core`, `packages/ai`)

**Decision: labels as props, not a global context.** A global context forces
every consumer into a client component and breaks RSC. Props keep components
server-safe and make the contract explicit in the manifest.

Pattern:

```tsx
type Labels = { close?: string; loading?: string };
<Button loadingLabel={labels.loading} />
```

Already shipped with labels:

- `Message` (user/assistant labels + retry/edit/save/cancel)
- `Reasoning` (title, count, thinking, step)
- `ToolCall` (status, arguments, result, error)
- `MessageActions` (copy/copied/thumb/regenerate)
- `Confirmation` (approve/reject/approved/rejected)
- `PromptInput` (placeholder/send/stop)
- `StreamingIndicator` (text)

Remaining work, by priority:

| Priority | Component | Add |
|---|---|---|
| P0 | `Button` | `loadingLabel` |
| P0 | `Pagination` | landmark + first/previous/next/last labels |
| P0 | `DataTable` | `emptyMessage`, `selectAllLabel` |
| P0 | `Dialog` / `Drawer` | close label |
| P1 | `Autocomplete` | clear input, suggestions landmark |
| P1 | `Breadcrumb` | landmark label |
| P1 | `DatePicker` | clear date |
| P1 | `FileUpload` | selected files, remove |
| P1 | `PasswordInput` | show/hide labels (already props; verify defaults) |
| P1 | `Search` | empty text |
| P1 | `CommandPalette` | placeholder |
| P2 | `Toast` | close/region labels |
| P2 | `Spinner` / `Skeleton` | loading labels |
| P2 | `Message` / `Reasoning` | `formatTime` / `Intl` locale prop |

For each: add prop, default to current English, update the manifest prop schema
and accessibility notes, add a test that the override renders, and add an
`ar` RTL axe case where the component is interactive.

### 4.6 CLI, MCP and registry

- **Do not localize** manifest JSON keys, tool names, or registry metadata. They
  are contracts; translating them breaks agents.
- CLI help/errors can be localized later with the same catalogs; defer until the
  apps are done.
- If localized component descriptions are wanted for humans, add a separate
  `i18n` overlay in the docs, not in the manifest contract.

---

## 5. Translation workflow

1. **English is the source.** Add keys to `en.ts` first; make the type fail in
   `ar.ts`/`es.ts` until translated (`satisfies Messages`).
2. **Key naming:** `area.thing`, e.g. `app.emptyTitle`, `tools.failed`. Never
   encode English text in the key.
3. **Interpolation:** `{name}` only; no HTML. For rich text, split into keys and
   compose in the component.
4. **Plurals:** `key_one` / `key_other`; add `_two`/`_few`/`_many` for Arabic
   where the copy needs them.
5. **Review:** native review for ar/es; a screenshot of the screen in that
   locale; RTL review for layout and icon direction.
6. **CI:** key parity test (already in `i18n.test.ts`), missing-key search,
   pseudo-locale build, no hardcoded-string lint on app source (add a custom
   rule or a grep gate).
7. **Vendor:** Crowdin/Lokalise or a translator with the repo glossary. Do not
   machine-translate legal or security copy without review.

---

## 6. Testing matrix

| Test | Scope |
|---|---|
| Catalog key parity | `en` vs every locale (unit) |
| Interpolation / plural | unit, per locale |
| Locale resolution | cookie, BCP-47, Accept-Language q-values |
| RTL render | provider sets `dir=rtl`; axe in `ar` |
| Page smoke | every route in en/ar/es/ko/ja/ru/zh, no missing keys |
| Visual regression | header, footer, forms, tables, chat in LTR/RTL |
| SEO | `hreflang`, canonical, sitemap per locale |
| Emails | subject/body snapshot per locale |
| Currency/date | `Intl` output per locale |

---

## 7. Rollout phases

| Phase | Deliverable | Estimate |
|---|---|---|
| 0 | `@slipstream-ui/i18n` runtime + starter localization | **Done** |
| 1 | Component labels (P0 table) + manifests/tests | 3–5 days |
| 2 | Docs routing, shell, nav, search, metadata, sitemap | 1–2 weeks |
| 3 | Docs guides (9) + component pages (80) translation | 2–4 weeks (content) |
| 4 | Dashboard auth/billing/team/admin + emails | 2–3 weeks |
| 5 | RTL/visual/SEO audit, pseudo-locale, launch | 1 week |

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| RSC/client boundary breaks (`createContext`) | Split pure and `/react` entries; keep `'use client'` on the entry |
| RTL layout bugs in tables/drawers | Logical classes + RTL visual tests |
| Translation drift | Typed catalogs + key parity CI |
| SEO duplicate content | `hreflang` + canonical per locale; no auto-redirect |
| Legal copy mistranslated | English governs; counsel review |
| Component API churn from labels | Optional props with English defaults; manifest update per component |
| Email/currency mistakes | One locale per email; `Intl` only; snapshot tests |

---

## 9. Definition of done (per app)

- [ ] `lang` and `dir` are correct in server HTML.
- [ ] Locale is switchable and persists.
- [ ] No hardcoded user-facing strings in the app shell or forms.
- [ ] Dates, numbers and currency use `Intl` with the active locale.
- [ ] `ar` renders RTL without overlap or clipped content.
- [ ] Key parity test passes; missing keys fail CI.
- [ ] Axe passes in `en` and `ar`.
- [ ] SEO: canonical + `hreflang` + sitemap per locale.
- [ ] Translation reviewed by a native speaker for launch locales.
