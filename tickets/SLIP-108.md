---
id: SLIP-108
title: "a11y: success text on a tinted surface needs an ink token"
epic: 6
priority: P2
estimate_hours: 3
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:accessibility", "p2"]
depends_on: []
status: ready
---

**Context.** `warning` and `info` each ship a dedicated ink token
(`warning-ink`, `info-ink`) for text on a tinted surface. `success` does not, so
every `bg-success/10 text-success` pairing is one tint step away from failing
4.5:1 at small sizes.

Measured on `/docs/roadmap` (12px, normal weight): `text-success` #1e8544 on
`bg-success/10` over white composited to #e9f3ec = **4.11:1**, under the 4.5:1
minimum. The roadmap badge was changed to `border-success/40 bg-card
text-success` (4.67:1 on the card) to clear the gate.

**The same pairing ships in the library**:

- `ToolCall` status chip, `completed` state
- `Confirmation` status chip, `approved` state

Both render at 12px on `bg-muted/30`, so the composited background is not white
and the ratio is at best marginal. They are not covered by the current axe
routes, which is why the gate stayed green.

**Desired state.** `success` gets an ink token that holds 4.5:1 on a 10% tint in
both schemes, and the library chips use it.

**Acceptance criteria**

- [ ] `success-ink` added to `create-theme.ts`, `types.ts`, the Tailwind v3
      preset and `tailwind-v4.css`, matching the `warning-ink` pattern.
- [ ] Light value clears 4.5:1 on `bg-success/10` over white; dark value clears
      it on the dark card.
- [ ] `ToolCall` and `Confirmation` chips switch to `text-success-ink`.
- [ ] Component tests still pass; a token contrast test pins both values.
- [ ] `/docs/components/tool-call` and `/docs/components/confirmation` added to
      the axe route list so the pairing stays covered.
- [ ] Changeset added; `pnpm verify:tailwind-v4` and `verify:tailwind3` green.

**Files.** `packages/themes/src/create-theme.ts`, `packages/themes/src/types.ts`,
`packages/themes/tailwind-v4.css`, `tooling/tailwind-config`,
`packages/ai/src/components/tool-call/ToolCall.tsx`,
`packages/core/src/components/confirmation/Confirmation.tsx`,
`apps/docs/scripts/audit-a11y.ts`, manifests and docs token tables.

**Out of scope.** Auditing every component demo route; that is a separate
coverage ticket.
