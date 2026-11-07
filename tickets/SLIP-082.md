---
id: SLIP-082
title: "Block manifests, page recipes and validate_page for the AI-first layer"
epic: 7
priority: P0
estimate_hours: 24
milestone: "M7 Axial adoption"
labels: ["epic:adoption", "type:feature", "p0"]
depends_on: ["SLIP-070", "SLIP-081"]
---

**Context.** Manifests stop at the component boundary. Agents can validate props
but not page composition, heading order, alt text or required SEO fields. This
is the library's main differentiator and the largest remaining adoption gap.

**Scope.**
- `BLOCK_MANIFEST` schema with slots, content rules, responsive behavior and
  accessibility requirements.
- `PAGE_RECIPE` schema: landing, dashboard, directory, content hub, lead form,
  article, pricing and auth.
- MCP tools: `list_blocks`, `get_page_template`, `validate_page`.
- CLI surface for the same checks.
- Canonical markdown routes for blocks and page recipes.

**Acceptance criteria**
- [ ] Every block and page recipe has a machine-readable manifest.
- [ ] `validate_page` catches: multiple h1s, skipped heading levels, missing alt
      text, missing SEO title/description, invalid block slots and unknown blocks.
- [ ] Validation returns actionable fixes, not only errors.
- [ ] Recipes compose only exported components and blocks.
- [ ] MCP tool schemas and manifests stay in sync in CI.
- [ ] `llms.txt` and `/llm` include blocks and recipes.
- [ ] A page generated from a recipe passes the docs build and axe.

**Technical notes**
- Keep `COMPONENT_MANIFEST` unchanged; add a sibling schema.
- Page validation should be structural, not a full HTML parser initially.
- Do not require an LLM to validate.
