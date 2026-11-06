# Competitor matrix — documented capabilities

**Recorded:** 2026-11-05
**Method:** official documentation, package metadata and pricing pages only.
**Not a runtime benchmark.** Cells marked *documented* are what the vendor claims
or what its docs show; cells marked **unverified** were not reproducible without
an account, install, or API key.

| Capability | Slipstream UI | shadcn/ui + AI Elements | assistant-ui | Nexera UI | Matrix UI | Lucent UI |
|---|---|---|---|---|---|---|
| Licence | MIT | MIT | MIT (+ paid cloud) | MIT | MIT (claimed) | MIT |
| Component count | **80** (63 core + 17 AI) | ~76 core + 21 AI patterns | Chat primitives | **180** | unverified | 67 |
| Distribution | npm + shadcn registry | Copy-in registry + CLI | npm | npm | npm (claimed) | npm |
| Per-component manifest | **80 JSON manifests** | Registry schema; markdown docs | No | Live prop docs / manifest | Documented MCP specs | **COMPONENT_MANIFEST** |
| MCP server | **5 tools** | Yes (docs MCP) | No | Yes (guidebook) | **Yes** | Yes (3 tools) |
| Usage validation | **`validate_usage`** (props, enums, required, missing root) | No dedicated validator | No | Validation marketed; server "soon" per About page | **Validation marketed** | No |
| Runtime independence | **Yes** (structural adapter) | Tied to AI SDK patterns | Runtime adapters | React only | unverified | React only |
| AI chat components | **17** | 21 patterns | Strongest | Included in 180 | unverified | AI set exists |
| Tailwind support | 3.4 tested; **4.x theme compiles** | 4.x | Via shadcn | 4.x optional / precompiled CSS | unverified | 3.4/4 |
| RTL | Logical properties; not separately audited | **First-class CLI transform** | Via app | **Yes** (logical properties) | unverified | unverified |
| Accessibility evidence | axe + keyboard tests | axe + docs | Strong focus | **WCAG 2.2 evidence per component** | Claims checks | axe |
| Pricing | Free / Pro $29 / Team $99 / Ent $499 | Free | Free; cloud paid | Free | Free (claimed) | Free early access |
| Biggest weakness | Distribution | No validator; migration churn | AI-chat only | Very large surface; MCP validation not live | Unverified | Early; smaller surface |

## What is actually differentiated

1. **A standalone validator that an agent can call** across a full component
   surface. Nexera and Matrix market validation, but neither exposes a
   reproducible public validator result; Slipstream publishes one for its own
   components.
2. **Breadth plus AI**: 63 core components and 17 AI components in one manifest
   system. shadcn has more AI patterns; Nexera has more total components; neither
   combines the full app surface with a five-tool MCP server.
3. **Runtime independence**: the AI adapter does not import an SDK.

## What is not differentiated

- Copy-in distribution (shadcn pioneered it; everyone copied it).
- Tailwind support (table stakes; v4 now compiles for Slipstream too).
- RTL (shadcn shipped first-class RTL in January 2026).
- “AI-native” branding (FrogiUI, Lucent, Nexera, Matrix, Lightswind, 21st all claim it).
- Component count (Nexera has 180; 21st has 12,000+ in its catalog).

## Honest positioning

> Slipstream UI is the AI-first React library that **enforces the component
> contract** — 80 components, 80 manifests, and a validator that catches
> structural AI mistakes before they ship, without locking you to a model SDK.

The claim stops at structural mistakes. The benchmark shows **65.7% recall** on
the 100-case set, with 100% precision and 0% false positives; accessibility,
state and streaming defects are not yet modelled. Do not claim “zero
hallucinations.”

## Sources

- shadcn/ui AI Elements: https://ui.shadcn.com/docs/ai-elements
- shadcn/ui RTL: https://ui.shadcn.com/docs/changelog/2026-01-rtl
- assistant-ui: https://github.com/assistant-ui/assistant-ui
- Nexera UI: https://www.nexera-ui.com/get-started · https://www.nexera-ui.com/about
- Matrix UI: https://matrix-ui.com/docs/ai/mcp-overview
- Lucent UI: https://www.lucentui.com/
- Slipstream benchmark: [benchmarks.md](./benchmarks.md)
