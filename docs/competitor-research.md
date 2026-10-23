# Competitor research (KC-045)

Recorded 2026-10-19 from official sources. Findings inform the acceptance
criteria for Slipstream UI features; public behavior may be reimplemented,
proprietary assets may not be copied. License obligations are noted per
project.

## shadcn/ui

- **Sources**: https://ui.shadcn.com/docs · https://github.com/shadcn-ui/ui/blob/main/LICENSE.md
- **Recorded**: 2026-10-19
- **License**: MIT (copyright 2023 shadcn). Attribution via license copy; commercially usable.
- **Model**: not an npm component library — a code-distribution platform. Components are
  copied into the consumer repo ("Open Code"), a flat-file registry schema + `shadcn`
  CLI distribute them, and the design is explicitly "AI-Ready" (LLMs read the source).
- **Relevance**: Slipstream's registry (`/registry/<id>.json` shadcn-compatible payloads),
  `add`/`diff` CLI, and per-component manifests follow this distribution model. Our
  `diff` stays content-based (non-destructive) rather than version-only.

## Vercel AI Elements

- **Sources**: https://elements.ai-sdk.dev · https://www.npmjs.com/package/ai-elements ·
  https://vercel.com/changelog/introducing-ai-elements
- **Recorded**: 2026-10-19
- **License**: Apache-2.0 (npm). GitHub shows "Other" — npm is authoritative for the
  published package.
- **Status**: announced 2025-08-06; **deprecating end of November 2026**, migrating into
  shadcn/ui. New projects should target the shadcn/ui version.
- **Model**: AI components (conversation, message, reasoning, tool, response, citations…)
  on top of shadcn/ui, installed via its own CLI or `shadcn add <registry url>`, deep
  AI SDK (`useChat`) integration, Tailwind CSS variables only.
- **Relevance**: validates our AI-component set (message/conversation/reasoning/tool-call/
  response/citations/branch/suggestions). Our `@slipstream-ui/ai/adapter` deliberately
  stays runtime-independent (structural types, no SDK dependency) so consumers are not
  coupled to one SDK generation — a differentiator while AI Elements deprecates.

## assistant-ui

- **Sources**: https://github.com/assistant-ui/assistant-ui · https://www.assistant-ui.com/pricing
- **Recorded**: 2026-10-19
- **License**: MIT (copyright 2026 AgentbaseAI Inc.). Optional paid "Assistant Cloud"
  for hosted thread persistence; the library itself is free forever.
- **Model**: runtime/adapter architecture (`AssistantRuntimeProvider` + `useChatRuntime`,
  LangGraph, data-stream runtimes), composable primitives (Thread, Message, Composer,
  ActionBar), shadcn-style theming via CLI, React/React Native/Ink surfaces.
- **Relevance**: strongest architectural overlap with our AI SDK adapter. Their
  runtime-provider pattern supports our "bring your own backend" stance; our MCP server
  and machine-readable manifests remain unique (they ship no agent-facing spec layer).

## Mantine

- **Sources**: https://mantine.dev/getting-started/ · https://ui.mantine.dev/
- **Recorded**: 2026-10-19
- **License**: MIT — explicit: "All @mantine/* packages are distributed under MIT
  license… commercial or not, with or without attribution."
- **Model**: full framework-scale component library (core/hooks/form/dates/charts/
  notifications/spotlight/modals…), npm packages, its own theming system; Mantine UI
  adds 123 premade sections/components free forever.
- **Relevance**: benchmark for breadth and docs quality. Their `@mantine/spotlight`
  (command center) informed the acceptance bar for our CommandPalette (combobox/listbox
  semantics, keyboard navigation) — we implement the accessible pattern natively with
  no extra dependency.

## daisyUI

- **Source**: https://daisyui.com/docs/intro/
- **Recorded**: 2026-10-19 (page returned binary/garbled content to the crawler; license
  is historically MIT per the project's repo — verify before relying on this entry)
- **Model**: Tailwind CSS component classes (plugin, no runtime JS), theme system,
  npm distribution.

## Differentiated acceptance criteria (applied to KC-025–031)

1. **Runtime-independent AI conversion** — `@slipstream-ui/ai/adapter` maps structural
   AI-SDK-shaped state to Slipstream types with zero SDK dependency (KC-025 tests).
2. **Deterministic capability search with explanation** — MCP `search_components` is
   lexical, scores deterministically, and reports matched fields (KC-026 tests).
3. **Non-destructive content-based CLI diff** — `slipstream-ui diff` compares file
   hashes, never writes, exits 1 on drift for CI (KC-027 tests).
4. **Accessible composable primitives** — Toast/Dialog/Select/CommandPalette ship with
   axe + keyboard/focus tests, controlled and uncontrolled states (KC-028–031 tests).
5. **Search stays lexical** until semantic ranking is actually implemented.
6. **No proprietary assets copied** — all implementations are original; MIT/Apache-2.0
   projects informed behavior only, and their license texts require no action for us
   because no code was incorporated.
