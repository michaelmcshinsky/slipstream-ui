---
id: SLIP-077
title: "Forms conversion kit: wizard, phone, currency, error summary and result panels"
epic: 7
priority: P0
estimate_hours: 24
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p0"]
depends_on: ["SLIP-070"]
---

**Context.** Multi-step forms, payment/quote flows, and application forms need
shared primitives beyond the current `Form`/`FormField` set.

**Scope.**
- `FormWizard` (steps, progress, next/back, validation gate).
- `PhoneInput` (country code, formatting, E.164 output).
- `CurrencyInput` (locale, decimals, minor-unit output).
- `FormErrorSummary` (focusable summary linked to fields).
- `ResultPanel` (success/error/pending with next actions).

**Acceptance criteria**

- [ ] Wizard preserves values across steps and blocks on invalid steps.
- [ ] Phone and currency inputs expose a documented value contract.
- [ ] Error summary moves focus and links each error to its field.
- [ ] ResultPanel announces status and offers a clear next action.
- [ ] Manifests, tests, axe, docs, registry/LLM output.
- [ ] No new runtime dependency unless justified.

**Out of scope.** Payment provider integration.
