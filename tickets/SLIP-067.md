---
id: SLIP-067
title: "Localize transactional emails"
epic: 6
priority: P2
estimate_hours: 12
milestone: "M6 Internationalization"
labels: ["epic:i18n", "type:feature", "p2"]
depends_on: ["SLIP-066"]
---
**Context.** Invite, verification and password-reset emails are English.

**Acceptance criteria**
- [ ] One template per locale, selected from `User.locale`.
- [ ] Subject, body, CTA and footer are translated.
- [ ] Token/link logic is unchanged and covered by tests.
- [ ] Snapshot per locale; no PII in logs.
- [ ] Fallback to English when a locale template is missing.
