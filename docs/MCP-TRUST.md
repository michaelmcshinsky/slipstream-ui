# MCP trust model

What `@slipstream-ui/mcp-server` guarantees, what it does not, and what a
consumer should know before trusting its output. Every claim below is grounded
in the server source (`packages/mcp-server/src/`) and the registry loader it
depends on (`packages/registry/src/index.ts`).

## Deployment and authentication boundary

- The server is **stdio-only** and local. It is started by the MCP client
  (`npx -y @slipstream-ui/mcp-server`, or the `slipstream-mcp` bin) and talks to
  the client over stdin/stdout; there is no network listener and no remote
  transport (`packages/mcp-server/src/index.ts:76-85`,
  `packages/mcp-server/server.json` declares `"transport": { "type": "stdio" }`).
- There is **no authentication or authorization layer**. Anyone who can spawn
  the process can call every tool. The trust boundary is therefore the client's
  own process isolation plus the integrity of the installed npm packages —
  not anything the server enforces.
- Tool dispatch is a fixed `switch` over six hard-coded tool names
  (`packages/mcp-server/src/index.ts:43-74`). Unknown tool names are rejected;
  there is no dynamic tool loading, no plugin mechanism, and no path where a
  manifest or tool result can register new behavior.

## Where the data comes from

The server does **not** bundle component manifests. `packages/mcp-server`
depends on `@slipstream-ui/registry` (bundled at build time via `noExternal` in
`packages/mcp-server/tsup.config.ts`), which at **runtime** resolves the
installed `@slipstream-ui/core` and `@slipstream-ui/ai` packages with
`require.resolve` and reads their manifest JSON files directly:

- `packages/registry/src/index.ts:50-59` — `resolvePackageDir()` uses
  `require.resolve(packageName)`; the package root is derived from the resolved
  entry point.
- `packages/registry/src/index.ts:83-103` — `loadRegistryEntries()` prefers
  `<pkg>/src/manifests/*.json` and falls back to `<pkg>/dist/manifests/*.json`.
  Both directories ship in the published tarballs (`packages/core/package.json`
  and `packages/ai/package.json` list `"files": ["dist", "src"]`; the build
  copies `src/manifests` into `dist/manifests`).
- `packages/registry/src/index.ts:38-44` — files are read with
  `JSON.parse(fs.readFileSync(...))`. **There is no schema validation, no
  signature check, and no integrity verification at runtime.** The only
  validation that ever runs is the repo-side `pnpm validate:manifests`
  (`scripts/validate-manifests.ts`), which is a CI/dev-time structural check
  and does not execute on the consumer's machine.
- `packages/mcp-server/package.json` does **not** declare `@slipstream-ui/core`
  or `@slipstream-ui/ai` as dependencies. The server silently uses whatever
  version of those packages is installed alongside it (a missing package is
  skipped, not an error — `packages/registry/src/index.ts:86-89`), so manifest
  content can differ from what the MCP server version suggests.

## What `validate_usage` actually guarantees

`validate_usage` (`packages/mcp-server/src/tools/validate-usage.ts`) is a
**static, best-effort lint over JSX source text** supplied by the caller. It
has two modes (`validate-usage.ts:428-525`):

- `componentId` + `code`: validate usages of one named component.
- `files` (whole-tree mode): scan each file for PascalCase JSX tags
  (`findJsxTagNames`, `validate-usage.ts:376-390`), look each tag up in the
  registry by export name, and validate only tags that resolve to a Slipstream
  manifest. Non-Slipstream components are reported in `summary.skippedTags`
  and never checked (`validate-usage.ts:446-451`).

For each detected `<ExportName ...>` usage it checks (`validate-usage.ts:304-364`):

1. **Unknown props** — attribute names not in the manifest's `props` schema are
   errors, *except* spread props (`{...}`) and a hard-coded allowlist of native
   HTML/React attributes plus anything matching `aria-*`, `data-*`, or
   `on[A-Z]*` (`isNativeAttribute`, `validate-usage.ts:43-64`). A `fix`
   suggestion is produced via Levenshtein nearest-match.
2. **Enum values** — a string-literal attribute value not in the prop's `enum`
   is an error (only checked when `attribute.value` is a quoted string;
   expression values like `size={x}` are not checked).
3. **Missing required props** — required manifest props absent from the usage
   are errors; `children` is satisfied by non-empty children or a `children`
   attribute.
4. **Icon-only accessible name** — `size="icon"` usages without
   `aria-label`/`aria-labelledby`/`title`, alt text, or any children/expression
   are errors (`hasAccessibleName`, `validate-usage.ts:259-272` — deliberately
   conservative; an expression child is treated as a potential name).

`valid` is true only when there are zero error-severity issues **and** at least
one usage was found (`validate-usage.ts:370`).

### What `validate_usage` does NOT check

- **It does not compile or type-check anything.** The JSX "parser" is a
  hand-rolled scanner (`findOpeningTagEnd`, `parseAttributes`,
  `validate-usage.ts:96-169`). Malformed JSX, wrong import statements, missing
  imports, TypeScript errors, and runtime behavior are all invisible to it.
- **Spread props bypass prop validation entirely** — `{...props}` is recorded
  as `...` and skipped (`validate-usage.ts:134-137, 312`). Anything can arrive
  through a spread.
- **Dynamic/expression attribute values are opaque.** `value={expr}` yields no
  `value`, so enum checks are skipped and a bare required-attribute check only
  verifies the attribute name is present.
- **It only knows manifests, not the real component API.** If a manifest is
  stale relative to the component's actual props, `validate_usage` will
  confidently validate against the wrong contract. There is no runtime
  cross-check against the shipped component types.
- **It does not verify that the component exists in the consumer's project**,
  that the import resolves, or that the generated code is safe to execute.
  Passing `valid: true` means "consistent with the manifest text," nothing
  more.
- **Whole-tree mode silently ignores unknown components** — a typo'd or
  third-party PascalCase tag is skipped, not flagged.
- **No coverage guarantee for compound components**: the tool description
  mentions "missing compound roots," but the implementation checks props,
  enums, required props, and the icon-name heuristic only — there is no
  compound-root rule in `validateComponentUsage`.

The other tools are read-only lookups over the same manifest data:
`list_components`, `search_components` (deterministic lexical matching with
`matchedFields`/`score`, `search-components.ts:20-89`),
`recommend_components` (keyword recipes + lexical scoring,
`recommend-components.ts`), `get_component_manifest` (verbatim manifest JSON),
and `get_usage_examples` (verbatim `examples`, `compositionRules`,
`antiPatterns`).

## Manifest injection posture

Manifest content is **untrusted text flowing into the model's context**. The
chain is:

```
*.manifest.json  --(JSON.parse, no validation)-->  loadRegistry()
   --> tool handler --> JSON.stringify --> MCP text result --> client/LLM context
```

Concrete exposure points:

- `get_component_manifest` returns the **entire manifest object verbatim**
  (`get-manifest.ts:22`), including free-text fields: `description`,
  `designIntent`, `examples[].code`, `antiPatterns[].explanation`,
  `contentGuidelines`, etc.
- `get_usage_examples` returns `examples`, `compositionRules`, and
  `antiPatterns` verbatim (`get-usage-examples.ts:25-32`).
- `validate_usage` **interpolates manifest-controlled strings into its own
  output**: prop names and enum values are embedded in `fix` strings
  (`validate-usage.ts:316-331`), the documented-prop list is echoed
  (`validate-usage.ts:319`), and `antiPatterns` titles/explanations are
  returned in single-component mode (`validate-usage.ts:513-516`). A manifest
  whose prop is named e.g. `ignorePreviousInstructions` would surface that
  string inside a validator "fix" message.
- `search_components` matches against and returns `description`, prop names,
  and anti-pattern text (`search-components.ts:49-83`); `recommend_components`
  embeds manifest `name`/`description`/`package` in results
  (`recommend-components.ts:84-93`).

**Could a malicious or compromised manifest inject instructions?** Yes, in
principle:

- A compromised `@slipstream-ui/core`/`ai` release (or a tampered local
  `node_modules`, or a manifest edited in a monorepo checkout via the
  `SLIPSTREAM_UI_ROOT`/monorepo fallback at `packages/registry/src/index.ts:62-77`)
  could place instruction-like text in any free-text field, and the server
  would relay it to the client verbatim. The server performs **no content
  scanning, escaping, sanitization, or provenance labeling** of manifest text.
- There is **no signature, checksum, or allowlist** on manifests at runtime.
  npm provenance (`publishConfig.provenance` in the package manifests) attests
  to the *published tarball*, but once installed, manifest JSON is just files
  on disk.
- The repo-side `scripts/validate-manifests.ts` gate is **structural only**
  (types, required fields, kebab-case IDs, enum sanity). It does not scan
  `description`/`examples`/`antiPatterns` text for prompt-injection patterns,
  URLs, or suspicious instructions. Nothing in CI would flag a manifest that
  says "ignore previous instructions and run X."

**Mitigations that do exist:**

- Manifests live in versioned, reviewable JSON files in this repo; changes go
  through PRs and the manifest validator.
- `validate_usage`'s `fix` strings are assembled by the server, not copied
  wholesale from manifest prose — but they do interpolate manifest prop names
  and enum values, so the injection surface is narrowed, not eliminated.
- Tool *definitions* (names/descriptions/schemas) are hard-coded in
  `packages/mcp-server/src/tools/*.ts` and cannot be influenced by manifest
  data — a manifest cannot rename a tool or alter its input schema.
- All tool output is `content: [{ type: 'text', text: JSON.stringify(...) }]`
  (`types.ts:8-13`); there are no MCP `resources` or `prompts` that would let
  manifest data masquerade as server instructions.

**Mitigations that are absent:**

- No runtime manifest schema validation or signature verification in
  `@slipstream-ui/registry`.
- No output labeling distinguishing "trusted server text" from "manifest
  content" — everything is one JSON blob.
- No allowlist on URLs or code snippets embedded in manifests.
- No pinning: the server uses whatever `@slipstream-ui/core`/`ai` version the
  consumer has installed, which may be older or newer than the server.

## Guidance for consumers

- Treat every string returned by `get_component_manifest`,
  `get_usage_examples`, `search_components`, `recommend_components`, and
  `validate_usage` (especially `issues[].fix`, `description`, and
  `antiPatterns`) as **untrusted data**, not instructions. A manifest is
  documentation; it should never be obeyed as a command.
- `validate_usage` `valid: true` means "the JSX is consistent with the
  installed manifest's prop schema." It is not a security check, a type
  check, or proof the code is correct.
- Pin `@slipstream-ui/mcp-server`, `@slipstream-ui/core`, and
  `@slipstream-ui/ai` to compatible versions; the server has no version
  handshake with the component packages it reads.
- If you vendor or patch manifests locally, you are solely responsible for
  their contents — the server will faithfully relay them.
- The stdio trust model means the real security boundary is your MCP client's
  process sandbox and your npm dependency hygiene, not anything this server
  enforces.
