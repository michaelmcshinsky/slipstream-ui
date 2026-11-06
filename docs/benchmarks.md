# Validation benchmark

**Published:** 2026-11-05
**Dataset:** [`benchmarks/cases/cases.json`](../benchmarks/cases/cases.json)
**Harness:** [`benchmarks/`](../benchmarks/)
**Baseline provider:** `mock` (deterministic; measures the validator, not a model)

## The question

Slipstream UI claims that `validate_usage` catches AI-generated component
mistakes before they ship. This benchmark tests that claim against 100 known
cases instead of asserting it.

It answers two separate questions:

1. **Coverage:** which defect classes does the validator catch?
2. **Repair:** when the validator catches a defect, does a validation-driven
   repair produce a valid result?

## Method

- **100 cases**: 30 valid, 70 defective, 10 per defect class.
- **7 classes**: unknown prop, invalid enum, missing required prop, invalid
  composition, invalid accessibility, unsupported state, invalid streaming state.
- **4 conditions**: docs only (A), TypeScript source (B), manifest only (C),
  manifest + validator + repair (D).
- **Provider**: mock, so every condition receives the same known candidate
  output. This isolates the validator; it is not a model-quality comparison.
- **Scoring**: recall, precision, false-positive rate, repair success. A
  validator-clean output is not treated as proof of semantic correctness.

Reproduce:

```bash
pnpm bench:test
pnpm bench -- --provider mock
```

## Results (mock baseline)

400 runs: 100 cases × 4 conditions.

| Metric | Value |
|---|---|
| Recall before repair | **65.7%** |
| Precision | **100%** |
| False-positive rate | **0%** |
| Repair success | **100%** (46 attempted) |

### Coverage by defect class

| Class | Cases per condition | Detected | Recall |
|---|---:|---:|---:|
| Unknown prop | 10 | 10 | **100%** |
| Invalid enum | 10 | 10 | **100%** |
| Missing required prop | 10 | 10 | **100%** |
| Invalid composition (missing root) | 10 | 10 | **100%** |
| Invalid accessibility | 10 | 4 | **40%** |
| Unsupported state | 10 | 1 | **10%** |
| Invalid streaming state | 10 | 1 | **10%** |

### Condition comparison

| Condition | Recall | Validator-flagged after repair |
|---|---|---|
| A — docs only | 65.7% | 46% |
| B — TypeScript source | 65.7% | 46% |
| C — manifest only | 65.7% | 46% |
| D — manifest + validator + repair | 65.7% | 0% |

The mock provider returns the same output for A–C and the fixed output for D, so
the identical recall is expected. The meaningful result is that the validator
detects 65.7% of the defects and every detected defect is repaired; the remaining
34.3% are classes the validator does not model.

## Interpretation

**What is proven:** the validator reliably catches the structural errors that
cause most "this prop does not exist" failures — unknown props, invalid enums,
missing required props, and compound components rendered without their root. It
does so with no false positives on the 30 valid cases.

**What is not proven:** accessibility, contradictory state, and streaming
semantics. The validator passes those defective cases. This is the honest
boundary of the current claim.

**Implication for the product:** "validate generated usage" is defensible only
when scoped to the classes above. The next differentiator is a semantic layer:
accessible-name checks, prop-combination rules, and agent-state invariants. Until
then, marketing must not imply zero hallucinations.

## Limitations

- The mock baseline is not a model benchmark. Live runs with
  `--provider openai` or `--provider anthropic` require API keys and produce
  model-dependent results.
- The validator is a heuristic parser, not an AST/TypeScript checker. It does
  not evaluate expressions.
- The ground truth is the authored case, not a human review of model output.
- Scores are comparable only within the same dataset version, provider and model.

## Next steps

1. Run the benchmark against two live models and publish both results.
2. Add a composite condition (manifest + validator) without repair to separate
   detection from repair.
3. Add semantic checks for accessible names and agent-state invariants, then
   re-run; target >80% recall on a11y/state classes without raising false
   positives.
