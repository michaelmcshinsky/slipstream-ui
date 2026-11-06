# We tested 100 AI-generated component usages. Here is what the validator caught.

*Published 2026-11-05 · Slipstream UI*

Every AI UI library says its components are “agent-ready.” Almost none publish a
number. We built a 100-case benchmark and ran it against our own validator. The
result is more useful than a slogan, and less flattering than a launch page.

## The setup

The dataset has 100 cases: 30 valid usages and 70 defects, ten in each class:

- unknown/hallucinated prop
- invalid enum value
- missing required prop
- compound component used without its root
- missing accessible name
- contradictory state
- contradictory streaming/agent state

Each case is run under four conditions:

| Condition | Context |
|---|---|
| A | canonical component markdown |
| B | TypeScript source |
| C | the component manifest |
| D | manifest + `validate_usage` + repair |

The published baseline uses a deterministic mock provider, so A–C receive the
same known output and D receives the known fix. This measures the **harness and
the validator**, not model quality. A live model run is a separate experiment.

## The result

| Metric | Value |
|---|---|
| Recall before repair | **65.7%** |
| Precision | **100%** |
| False-positive rate | **0%** |
| Repair success on detected defects | **100%** |

Coverage by class:

| Class | Recall |
|---|---|
| Unknown prop | **100%** |
| Invalid enum | **100%** |
| Missing required prop | **100%** |
| Missing compound root | **100%** |
| Accessibility | **40%** |
| Unsupported state | **10%** |
| Streaming state | **10%** |

## What this means

The validator is good at the failure mode that produces the most obvious broken
UI: a prop that does not exist, a value outside an enum, a required prop omitted,
or a `SelectItem` rendered without a `Select`. Those are exactly the errors a
model makes when it guesses an API from training data.

It is not a semantic reviewer. It does not know that an icon-only button needs an
accessible name, that `isStreaming` and `error` contradict each other, or that
`streamingMessageId` points at a message that is not in the list. Those cases
passed.

That is the honest boundary of the claim. “Validate generated usage” is true for
the structural contract. “Zero hallucinations” is not.

## Why publish the misses?

Because the misses are the roadmap. A benchmark that only reports the 100% rows
is marketing. The 40% and 10% rows tell us what to build next:

1. Accessible-name checks derived from the manifest’s accessibility section.
2. Prop-combination rules for state machines (`isStreaming` + `error`,
   `isLoading` + `hasError`).
3. Agent-state invariants for tool calls, reasoning and streaming.

Each one can be added to the validator and re-measured against the same 100
cases. That is the point of committing the dataset and the harness.

## Reproduce it

```bash
pnpm bench:test
pnpm bench -- --provider mock
```

The dataset is at `benchmarks/cases/cases.json`; results are written to
`benchmarks/results/`. Live runs require `OPENAI_API_KEY` or
`ANTHROPIC_API_KEY`.

The full report, including limitations, is at
[`docs/benchmarks.md`](../benchmarks.md).
