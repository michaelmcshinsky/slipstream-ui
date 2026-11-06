---
id: SLIP-065
title: "Translate docs navigation, search and content"
epic: 6
priority: P2
estimate_hours: 80
milestone: "M6 Internationalization"
labels: ["epic:i18n", "type:content", "p2"]
depends_on: ["SLIP-064"]
---
**Context.** 9 guides and 80 component pages are English. Code samples stay English.

**Acceptance criteria**
- [ ] Nav, search index and metadata are locale-keyed.
- [ ] Guides are translated and reviewed by a native speaker.
- [ ] Component page intro, design intent, prop descriptions, anti-patterns and a11y notes are translated.
- [ ] Manifest JSON keys and code samples remain English.
- [ ] Missing pages fall back to English with a visible note.
- [ ] Sitemap contains one URL per locale with `hreflang`.
