---
id: SLIP-047
title: "Package, license, and purchase flow"
epic: 4
priority: P0
estimate_hours: 5
milestone: "M4 AI Chat Starter"
labels: ["epic:starter", "type:feature", "p0"]
depends_on: ["SLIP-041"]
---

**Context.** `apps/app` already has Stripe + mock billing, plans, licence keys, and teams. Reuse it; do not build a second billing stack.

**Acceptance criteria**
- [ ] Checkout creates a licence and delivers the product (private repo access or registry token).
- [ ] Licence activation/deactivation is idempotent.
- [ ] Refund/revocation path exists.
- [ ] Purchase requires no sales call.
- [ ] The product page states exactly what is included.

---
