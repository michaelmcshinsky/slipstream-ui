Here’s a concrete website + docs plan for Slipstream UI, distilled from what works on FrogiUI, Lucent UI, AI Elements, assistant-ui, shadcn.io/ai, and modern design-system sites.

1. Overall Goals





























GoalHow we hit itConvert visitors in < 10 secondsHero that states the AI-first promise + one-line install + live demoServe both humans and AI agentsParallel human docs + machine-readable surfaces (llms.txt, manifests, MCP)Feel premium & modernClean typography, dark-first, fluid “slipstream” motion languageDrive adoptionCopy-paste / CLI path + “works with Claude / Cursor / v0” proofStay maintainableDocs co-located with components, auto-generated from manifests where possible
Primary domains

Marketing / landing: slipstreamui.com
Docs: slipstreamui.com/docs (or docs.slipstreamui.com)


2. Site Map (High Level)
textslipstreamui.com
│
├── /                          Landing (marketing)
├── /docs                      Docs home
├── /docs/introduction
├── /docs/installation
├── /docs/theming
├── /docs/ai-manifests         ← differentiator page
├── /docs/mcp                  MCP setup
├── /docs/cli
├── /docs/components           Component index
│   ├── /docs/components/button
│   ├── /docs/components/message
│   ├── … (one page per component)
├── /docs/patterns             Composition patterns
├── /docs/examples             Full examples (Chat, Agent, IDE-like)
├── /docs/changelog
├── /playground                Live interactive playground (or /examples)
├── /blog                      Optional (later)
└── /llms.txt                  Machine-readable entry for agents

3. Landing Page (/) — Structure
Inspired by Lucent + FrogiUI + AI Elements.
Sections (top → bottom)

Nav
Logo · Docs · Components · Examples · GitHub · “Get Started” CTA
Hero
Headline: “Your AI already knows your design system.”
Sub: Slipstream UI is an AI-first React component library. Every component ships a machine-readable manifest so Claude, Cursor, and Copilot generate correct UI the first time.
CTAs: Get Started · View Components · npx slipstream-ui init (copy button)
Optional: live mini chat or button morph demo

Social proof / logos (later: “Used by…”)
The Differentiator — COMPONENT_MANIFEST
Split view: left = code of a component, right = its JSON manifest.
Copy: “AI reads the spec, not the source.”
Three pillars (cards)
Fully composable primitives
Deep AI SDK + streaming support
MCP server + zero-hallucination surface

Component showcase
Horizontal or grid of 6–8 live components (Message, Reasoning, ToolCall, Button, etc.) with “View all →”
How it works for AI agents
Install MCP or point agent at llms.txt
Agent queries manifests
Generates correct props / layouts / content

CLI / InstallBashnpx slipstream-ui@latest init
# or
pnpm add @slipstream-ui/core @slipstream-ui/ai
Comparison / “Why Slipstream” (optional, light)
vs plain shadcn, vs generic AI chat kits
Footer
Docs · GitHub · Discord · Twitter/X · License · Status

Tone & visuals

Dark-first, subtle gradient or fluid “stream” background
High-contrast typography
Prefer live interactive demos over static screenshots


4. Docs Information Architecture
Top-level sidebar (docs)
textGetting Started
  Introduction
  Installation
  Theming
  Dark Mode
  CLI

AI-First
  COMPONENT_MANIFEST
  MCP Server
  llms.txt & Skills
  Content Guidelines
  Working with Agents

Components
  Overview
  Atoms
    Button
    Input
    Badge
    Avatar
    …
  AI Interaction
    Message
    Conversation
    PromptInput
    Reasoning
    ToolCall / Tool
    Sources
    Suggestion
    Chain of Thought
    Streaming indicators
  Layout & Patterns
    ChatLayout
    Sidebar
    CommandPalette
    EmptyState
    …

Patterns & Examples
  Basic Chat
  Agent with Tools
  Multi-modal
  Generative UI
  Full App Starters

API Reference          (auto from TS)
Changelog
Individual Component Page Template
Every component page follows the same structure (inspired by AI Elements + Lucent + shadcn):

Title + one-line description
Live preview (interactive, themeable, dark/light toggle)
Install / Add
npx slipstream-ui add message
or import snippet
Usage — primary code example
Examples — 3–6 variants (tabs or accordion)
Props table (generated from types + enriched by manifest)
COMPONENT_MANIFEST (collapsible JSON or pretty view) ← unique
Accessibility notes
Content guidelines (for AI text generation)
Related components / composition

This consistency makes both humans and agents happy.

5. Special Docs Pages (Differentiators)





























PagePurpose/docs/ai-manifestsDeep dive: schema, why it exists, how agents use it, examples/docs/mcpOne-command MCP setup for Claude Desktop, Cursor, Copilot, Windsurf/docs/cliFull CLI reference (init, add, list, flags)/docs/content-guidelinesHow to write good AI-facing text for each component/docs/examples/*Full working apps (Chat, Agent dashboard, IDE-like) with source
Also ship:

https://slipstreamui.com/llms.txt — curated, concise overview for agents
Optional: /docs/llms-full.txt or per-component .md for RAG


6. Technical Stack for the Site









































LayerRecommendationFrameworkNext.js 15 (App Router) — same as apps/docsStylingTailwind v4 + CSS variables from @slipstream-ui/themesContentMDX (for docs) + generated props/manifest tablesComponent demosClient components that import from @slipstream-ui/*SearchFlexsearch or Pagefind (local) + later AlgoliaCode blocksShiki + copy button + “Open in Playground”AnalyticsLightweight (Plausible / PostHog)DeploymentVercel (natural fit)
Docs content lives in apps/docs/content/docs/**/*.mdx (or src/content).
Component pages can be partially auto-generated from manifests + TypeScript.

7. Page Priority / Phased Rollout
Phase 1 — MVP (launchable)

Landing page (hero + manifesto + install + 4–6 live components)
Docs: Introduction, Installation, Theming
1–2 atom pages (Button, Input)
3 AI component pages (Message, Conversation, PromptInput)
MCP page (even if server is basic)
llms.txt
GitHub + basic footer

Phase 2

Full component index + remaining core atoms
Reasoning, ToolCall, Sources, Suggestion
Patterns / Examples section
CLI docs
Dark/light + theme switcher on every demo

Phase 3

Full example apps
Blog / changelog polish
Search
“Used by” logos, Discord community


8. Content Voice & Copy Guidelines

Confident, clear, slightly futuristic — never hype-y
Prefer short sentences and concrete claims
Always show the AI benefit next to the human benefit
Code first, explanation second
Every major claim should be demonstrable in a live example

Example tone:
“Stop debugging AI-generated buttons. Slipstream ships the contract the model needs.”

9. Visual / Brand Direction (for the site)

Logo: existing Slipstream mark
Name treatment: “Slipstream UI” (or simply “Slipstream”)
Color: deep neutrals + one electric accent (cyan / electric blue / soft violet — to be decided with logo)
Motion: subtle stream / trail effects on hero and loading states
Typography: modern geometric sans (e.g. Geist, Inter, or a distinctive display face for headlines)
Density: comfortable for docs, slightly tighter for marketing


10. Success Metrics (early)

Time to first successful npx slipstream-ui init
% of docs traffic that hits the MCP / Manifest pages
GitHub stars + npm downloads
Agent success rate (qualitative feedback from Cursor/Claude users)


Summary Recommendation
Build the site as a single Next.js app (apps/docs) that serves both marketing and docs, with:

Strong AI-first story on the homepage
Consistent component page template that always includes the manifest
First-class MCP + llms.txt surfaces
Live, themeable demos everywhere