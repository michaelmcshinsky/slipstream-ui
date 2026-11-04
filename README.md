# Slipstream UI

The AI-first React component library — your AI already knows how to use it.

[![CI](https://github.com/michaelmcshinsky/slipstream-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/michaelmcshinsky/slipstream-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/michaelmcshinsky/slipstream-ui?style=flat&logo=github)](https://github.com/michaelmcshinsky/slipstream-ui/stargazers)
[![Known vulnerabilities](https://img.shields.io/badge/audit-0%20known%20vulnerabilities-brightgreen.svg)](https://github.com/michaelmcshinsky/slipstream-ui/security/dependabot)

<!-- generated:stats:start -->
**75 components** · 75 machine-readable specs · MCP `validate_usage` · MIT
<!-- generated:stats:end -->

[Docs](https://slipstreamui.com/docs) · [Changelog](https://slipstreamui.com/changelog) · [Templates](https://slipstreamui.com/docs/templates) · [MCP server](https://slipstreamui.com/docs/mcp)

## Overview

Slipstream UI is a React component library designed for AI-assisted development. Every component ships a machine-readable `COMPONENT_MANIFEST` so coding agents like Claude, Cursor, and Copilot generate correct UI the first time — exact props, defaults, anti-patterns, and accessibility rules, queryable instead of scraped from training data.

- **AI reads the spec, not the source** — manifests over MCP, canonical markdown routes, and a `validate_usage` tool that rejects hallucinated props before they ship
- **shadcn-compatible registry** — install real source files with `npx shadcn add`, or use the packages; your codebase, your rules
- **Fully stateless** — bring any backend (Vercel AI SDK, LangGraph, raw streams); components render, you own state
- **Accessible** — jest-axe suites on every component, keyboard and screen-reader behavior, reduced-motion variants
- **Themeable to the token** — one `createTheme()` call emits every CSS variable; dark mode and presets switch instantly

## Quick Start

```bash
# 1. Initialize (detects Next/Vite + Tailwind, writes config and theme variables)
npx slipstream-ui@latest init

# 2. Or install packages directly
pnpm add @slipstream-ui/core @slipstream-ui/ai

# 3. Or copy source files through the shadcn-compatible registry
npx shadcn@latest add https://slipstreamui.com/registry/message.json
```

## For AI agents

- [`/llms.txt`](https://slipstreamui.com/llms.txt) — top-level agent index
- [`/llm/index.md`](https://slipstreamui.com/llm/index.md) — full component index; per-component references at `/llm/components/<id>.md`
- [`/registry/all.json`](https://slipstreamui.com/registry/all.json) — every COMPONENT_MANIFEST plus installer payload
- **MCP server** — `list_components`, `get_component_manifest`, `get_usage_examples`, `validate_usage` ([setup](https://slipstreamui.com/docs/mcp))

```tsx
import { Button } from '@slipstream-ui/core';
import { Conversation, PromptInput } from '@slipstream-ui/ai';

export function ChatApp() {
  const [messages, setMessages] = useState([{ id: '1', role: 'user', content: 'Hello!' }]);
  return (
    <>
      <Conversation messages={messages} />
      <PromptInput onSubmit={(text) => setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', content: text }])} />
    </>
  );
}
```

## Packages

- `@slipstream-ui/core` — base atoms and molecules (Button, Input, Dialog, Table, …)
- `@slipstream-ui/ai` — AI interaction components (Conversation, PromptInput, Response, ToolCall, …)
- `@slipstream-ui/themes` — `createTheme()` and default/violet/zinc presets
- `@slipstream-ui/mcp-server` — MCP server for AI agents
- `@slipstream-ui/cli` — `init` / `add` / `list` / `diff` commands

## Development

```bash
pnpm install            # install dependencies
pnpm dev                # run all packages in dev mode
pnpm build              # build all packages
pnpm typecheck          # type check
pnpm lint               # lint
pnpm test               # test
pnpm validate:manifests # validate COMPONENT_MANIFESTs + TS↔manifest drift
```

## Community

- **Star history:** [stargazers](https://github.com/michaelmcshinsky/slipstream-ui/stargazers) — if Slipstream saves you a hallucinated-props debugging session, a star helps others find it.
- **Used by:** _no public adopters yet — if you ship with Slipstream, open a PR adding your project here (or an issue and we will add it)._
- **Decisions are public:** the [roadmap](https://slipstreamui.com/docs/roadmap) lists what lands in each minor and what 1.0 guarantees.

## Contributing

PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Open an issue before large changes.

## License

MIT
