---
"@slipstream-ui/core": minor
---

The last P1 migration gaps: marketing chrome, content typography, TOC and
confirmations.

New components:
- SiteHeader — sticky marketing header: brand, horizontal nav with
  prefix-aware active states (aria-current), right-aligned actions and a
  built-in mobile Drawer; router-agnostic via linkComponent
- SiteFooter — brand/tagline column, link columns and a legal bar, with
  safe external links and linkComponent for routers
- Prose — self-contained long-form typography for rendered markdown/MDX
  (headings, links, lists, code, tables, quotes, figures); no
  @tailwindcss/typography dependency, keeps Shiki/KaTeX pipelines intact
- TableOfContents + useScrollSpy — sticky "On this page" nav with nested
  levels and aria-current, plus an IntersectionObserver scroll-spy hook
- ConfirmDialog — accessible confirmation built on Dialog with async
  pending state, destructive variant and cancellable actions

Docs: five new pages, nav + search entries; registry/LLM regenerate to
80 components (63 core / 17 AI).

Verified: typecheck 14/14, lint 8/8, tests 10/10, build 10/10, 80
manifests with zero drift, docs smoke 6/6.
