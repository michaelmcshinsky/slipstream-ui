---
id: SLIP-078
title: "SEO package: metadata, JSON-LD, FAQ, article, breadcrumb and sitemap helpers"
epic: 7
priority: P0
estimate_hours: 14
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p0"]
depends_on: []
---

**Context.** Consumers re-implement metadata, canonical URLs, Open Graph,
JSON-LD, FAQ/Article/Breadcrumb schema, and sitemap helpers for every site.

**Scope.**
- Router-agnostic metadata builders (title, description, canonical, OG, Twitter).
- JSON-LD builders: Organization, WebSite, SoftwareApplication, Article, FAQ,
  BreadcrumbList.
- Sitemap and robots helpers.
- A small `Seo` component or head-slot adapter for Next/Inertia/React Router.

**Acceptance criteria**

- [ ] Builders are pure functions with typed inputs and tests.
- [ ] No router or framework is a hard dependency.
- [ ] JSON-LD output is valid and escaped safely.
- [ ] Docs show Next, Inertia, and React Router examples.
- [ ] Manifests/tests/docs/registry where applicable.

**Out of scope.** Crawling or search-console integration.
