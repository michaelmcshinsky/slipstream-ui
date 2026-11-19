# Give Claude Code a component contract, not a component gallery

*Published 2026-11-05 · Slipstream UI*

Coding agents are good at writing React. They are bad at knowing your component
API. The failure is quiet: the code compiles, the page renders, and then a prop
that never existed shows up in review — or worse, in production.

A gallery does not fix this. A contract does.

## The problem with “here are the components”

A component gallery tells an agent what exists. It does not tell the agent what
is allowed. The model still has to infer:

- which props are required
- which enum values are valid
- which compound parts need a parent
- which combinations are contradictory
- what the accessible name should be

It infers all of that from the statistical average of the React it was trained
on. That average is not your design system.

## A contract has three parts

**1. A machine-readable manifest per component.** Not a prose page — a JSON
object with the prop schema, required flags, defaults, enums, anti-patterns,
accessibility requirements and composition rules.

**2. A discovery surface the agent can call.** An MCP server exposes
`list_components`, `search_components`, `get_component_manifest` and
`get_usage_examples`. The agent asks; it does not guess.

**3. A validator.** After the agent writes JSX, `validate_usage` checks it
against the manifest before it lands in the diff. Unknown props, invalid enum
values, missing required props and missing compound roots fail.

The third part is the difference between documentation and enforcement.

## Wiring it up

Add the MCP server to Claude Code, Cursor, Codex or any MCP client:

```json
{
  "mcpServers": {
    "slipstream-ui": {
      "command": "npx",
      "args": ["-y", "@slipstream-ui/mcp-server"]
    }
  }
}
```

Then give the agent a rule it cannot skip, in `AGENTS.md` or the project rules:

```md
When building UI with Slipstream UI:
1. Call search_components to find the component.
2. Read get_component_manifest before writing JSX.
3. Call validate_usage on the JSX. Fix every error before returning code.
4. Never invent a prop. If the manifest does not list it, it does not exist.
```

That last instruction is the whole point. It turns “the model probably knows”
into “the tool checked.”

## What it catches, and what it does not

Our 100-case benchmark measured 65.7% recall before repair, with 100% precision
and zero false positives on the valid cases. It caught every structural defect:
unknown props, invalid enums, missing required props, missing compound roots.

It did not catch missing accessible names, contradictory state, or broken
streaming state. Those need a semantic layer the validator does not have yet.
Publishing that gap is more useful than claiming a perfect score.

## The practical setup

- 80 components, each with a manifest.
- Five MCP tools.
- A validator that runs before code ships.
- 3.4 tested; Tailwind v4 theme compiles against the component sources.
- Stateless components: bring Vercel AI SDK, LangGraph, or a raw stream.

The agent still writes the UI. The contract makes sure it writes *your* UI.

Repository: https://github.com/michaelmcshinsky/slipstream-ui
Benchmark: [`docs/benchmarks.md`](../benchmarks.md)
