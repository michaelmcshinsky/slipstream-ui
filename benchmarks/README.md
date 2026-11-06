# Slipstream UI validation benchmark

A reproducible 100-case benchmark for the claim behind Slipstream UI:
**does `validate_usage` catch AI-generated component mistakes that ordinary docs
and TypeScript do not?**

The dataset is committed at [`cases/cases.json`](./cases/cases.json). The
generator is [`generate-cases.ts`](./generate-cases.ts); regenerate and check it
with `pnpm bench:generate` and `pnpm bench:check`.

## Quick start

```bash
pnpm bench:generate                 # write cases/cases.json
pnpm bench:check                    # fail if the committed dataset is stale
pnpm bench:test                     # unit tests for cases, validator, repair loop, scoring
pnpm bench -- --provider mock       # deterministic end-to-end run (no API keys)
pnpm bench -- --provider openai     # needs OPENAI_API_KEY
pnpm bench -- --provider anthropic  # needs ANTHROPIC_API_KEY
```

Useful flags: `--condition A|B|C|D|all`, `--limit 10`.

Results are written to `benchmarks/results/` (gitignored) as JSON + Markdown.

## What is measured

Each case has a prompt, a known candidate output (defective or valid), a fixed
output, and a defect class. Two things are measured:

1. **Validator coverage (deterministic).** Does `validate_usage` reject the
   known-defective output and accept the known-valid output?
2. **Generation + repair (model-dependent).** Given condition-specific context,
   does the model produce valid code, and does a validation-driven repair fix it?

The mock provider returns the candidate (or the fixed output when repairing), so
it measures the harness and the validator — **not** model quality.

## Conditions

| Condition | Context given to the model |
|---|---|
| **A** | Canonical component markdown (`/llm/components/<id>.md`) |
| **B** | TypeScript source for the component |
| **C** | `COMPONENT_MANIFEST` only |
| **D** | Manifest + examples + anti-patterns + a validate-and-repair step |

Condition D is the only one that sees the validator. That isolates the value of
the tool from the value of the context.

## Case taxonomy

100 cases: 30 valid, 70 defective, 10 per defect class.

| Class | What it tests |
|---|---|
| `unknown-prop` | Hallucinated prop name |
| `invalid-enum` | Value outside a documented enum |
| `missing-required` | Required prop omitted |
| `invalid-composition` | Compound component used without its root |
| `invalid-a11y` | Missing accessible name / empty label |
| `unsupported-state` | Contradictory props (loading + error, etc.) |
| `streaming-state` | Contradictory agent/streaming state |

## Metrics

- **Recall** — defective outputs rejected before repair.
- **Precision** — rejected outputs that were genuinely defective.
- **False-positive rate** — valid outputs wrongly rejected.
- **Validator-flagged rate (post-repair)** — outputs the validator still rejects.
- **Repair success** — repairs that end validator-clean.

A validator-clean output is not proof of semantic correctness. Classes the
validator does not model can pass while remaining defective.

## Current baseline (mock, 2026-11-05)

100 cases × 4 conditions = 400 runs.

| Metric | Value |
|---|---|
| Recall (pre-repair) | 65.7% |
| Precision | 100% |
| False-positive rate | 0% |
| Repair success | 100% (46 attempted) |

| Defect class | Recall |
|---|---|
| unknown-prop | 100% |
| invalid-enum | 100% |
| missing-required | 100% |
| invalid-composition | 100% |
| invalid-a11y | 40% |
| unsupported-state | 10% |
| streaming-state | 10% |

The structural classes are covered. Accessibility and agent-state semantics are
not. That is the product gap, stated as a number instead of a claim.

## Adding cases

1. Add the case to `benchmarks/src/cases.ts` (generated or curated).
2. Run `pnpm bench:generate && pnpm bench:check && pnpm bench:test`.
3. A case must have a ground-truth verdict; do not add cases whose correctness
   depends on taste.
4. Keep 30 valid / 70 defective and at least 10 per class.
