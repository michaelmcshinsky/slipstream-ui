# Seven ways AI-generated UI breaks, with real before/after cases

*Published 2026-11-18 · Slipstream UI*

Our [100-case validation benchmark](/articles/validation-benchmark-100-cases)
reported the numbers: 65.7% recall, 100% precision, zero false positives. The
numbers are easy to quote and hard to picture. This article walks through the
actual cases: the broken JSX an agent produces, what the validator reports, and
what a repair looks like.

Every example below is a real entry in `benchmarks/cases/cases.json`, run through
the same `validate_usage` path an MCP client uses. The snippets are minimal
reproductions of each defect class, not full component trees.

## 1. The hallucinated prop

Agents guess API names from training data. When the guess is wrong, the prop is
invented:

```tsx
// candidate
<Alert hallucinatedProp="true">Content</Alert>

// validate_usage
{
  "valid": false,
  "issues": [
    { "severity": "error", "message": "Unknown prop \"hallucinatedProp\" on <Alert> (usage). This prop does not exist in the manifest." }
  ]
}

// repaired
<Alert>Content</Alert>
```

This is the highest-value catch. Unknown props are the most common way generated
UI diverges from the library's actual contract, and TypeScript cannot always see
them when the code lives in a `.md` prompt or a string the agent assembles at
runtime.

## 2. The missing required prop

```tsx
// candidate
<AppShell />

// validate_usage
{
  "valid": false,
  "issues": [
    { "severity": "error", "message": "Missing required prop(s) on <AppShell> (usage): \"sections\"." }
  ]
}

// repaired
<AppShell sections={[]} />
```

An omitted required prop usually surfaces as a runtime crash or a silently empty
region. Catching it statically turns a production bug into a pre-merge warning.

## 3. The invalid enum value

```tsx
// candidate
<AnnouncementBar message="example" tone="__invalid__" />

// validate_usage
{
  "valid": false,
  "issues": [
    { "severity": "error", "message": "Invalid value \"__invalid__\" for prop \"tone\" on <AnnouncementBar>." }
  ]
}

// repaired
<AnnouncementBar message="example" />
```

Enum drift is subtle: the code compiles, the component renders, and the variant
falls back to a default the author did not choose. The manifest knows the legal
values; the validator enforces them.

## 4. The orphaned compound part

```tsx
// candidate
<DialogContent><DialogTitle>Confirm</DialogTitle></DialogContent>

// validate_usage
{
  "valid": false,
  "issues": [
    { "severity": "error", "message": "<DialogContent> rendered without a <Dialog> root." }
  ]
}

// repaired
<Dialog open={true} onOpenChange={true}>
  <DialogContent><DialogTitle>Confirm</DialogTitle></DialogContent>
</Dialog>
```

Compound components are where agents fail most creatively. Rendering `TabPanel`
without `Tabs`, or `DialogContent` without `Dialog`, produces markup that looks
plausible and behaves incorrectly: context is missing, state is unreachable,
and no type error points at the real problem.

## 5. The placeholder that is not a label

```tsx
// candidate
<Input placeholder="Email" />

// expected issue
Input is labelled only by placeholder text.
```

This one is in the benchmark's honest-miss column. The validator does not yet
catch accessible-name violations derived from the manifest's accessibility
section: recall on that class is 40%. We publish the miss because it is the
roadmap: accessible-name checks are next, and the same 100 cases will measure
whether they work.

## 6. The contradictory state pair

```tsx
// candidate
<Reasoning steps={[]} isStreaming duration={1200} />

// expected issue
Reasoning reports a duration while still streaming.
```

State-machine invariants (`isStreaming` alongside `duration`, `isLoading`
alongside `hasError`) are semantic, not structural. Current recall on these
classes is 10%. They need prop-combination rules in the manifest, not just prop
lists. Same story: measured, published, queued.

## 7. The streaming claim with nothing streaming

```tsx
// candidate
<ToolCall toolCall={{ id: "1", name: "search", state: "output-error" }} />

// expected issue
Tool call is output-error without an error payload.
```

Agent-state coherence (a tool call marked `output-error` with no error object, a
streaming message with empty content) is the newest defect class and the least
covered. It is also the one most likely to ship broken UI to a user, because the
failure only appears mid-conversation.

## What this adds up to

| Defect class | Validator recall |
|---|---|
| Unknown prop | 100% |
| Missing required prop | 100% |
| Invalid enum | 100% |
| Missing compound root | 100% |
| Accessibility | 40% |
| Unsupported state | 10% |
| Streaming state | 10% |

The pattern is consistent: the validator is strong exactly where the failure is
structural and the manifest is unambiguous, and weak exactly where judgment is
required. That is the correct shape for a first version: precise, honest about
its boundary, and improvable against a fixed dataset.

## Try it yourself

```bash
pnpm bench:test        # run the 100 cases against the validator
pnpm bench -- --provider mock
```

The dataset is committed at `benchmarks/cases/cases.json`; results land in
`benchmarks/results/`. To see `validate_usage` on your own code, point any MCP
client at the [Slipstream MCP server](/docs/mcp) or use
[`npx @slipstream-ui/cli@latest`](/docs/cli) in a project that already has the
components installed.

Related: [the benchmark methodology and full report](/articles/validation-benchmark-100-cases),
[docs/benchmarks.md](https://github.com/michaelmcshinsky/slipstream-ui/blob/main/docs/benchmarks.md).

*These cases come from a deterministic mock provider. They measure the harness
and the validator, not any specific model's output quality.*
