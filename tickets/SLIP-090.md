---
id: SLIP-090
title: "fix: validate_usage handles JSX-valued props and native attributes"
epic: 6
priority: P0
estimate_hours: 3
milestone: "M6 Integration hardening"
labels: ["epic:integration", "type:test", "p0"]
depends_on: []
status: done
---

**Context.** `validate_usage` used a regex that stopped at the first `>` inside
a JSX-valued prop such as `brand={<Logo />}`, so later props (including required
`items`) were reported missing. It also flagged inherited HTML attributes
(`id`, `name`, `aria-*`, `data-*`, event handlers) as hallucinated props.

**Delivered.** A brace/quote-aware opening-tag scanner and attribute parser,
plus a native-attribute allowlist. Regression tests cover JSX-valued props,
nested arrow functions, and native attributes.

**Verification.** `@slipstream-ui/mcp-server` 14 tests pass; local
`validate_usage` returns valid for `SiteHeader`, `Select`, `LinkTabs`, and
`ThemeToggle`.

**Commit.** `f134b5b`.

