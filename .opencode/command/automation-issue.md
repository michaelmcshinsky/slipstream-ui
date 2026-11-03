---
description: Implement one Slipstream UI GitHub issue — branch, focused fix with tests/manifests, full CI gate, commit, push, and PR. Long-running; use a runner that allows more than a few minutes.
agent: build
---

# Slipstream UI single-issue implementation

Run from `D:/Documents/Projects/slipstream-ui`. Do not use `D:/Projects/_modernization/slipstream-ui`.

## Argument

`$ARGUMENTS` must contain an issue number, for example: `automation-issue 21`.
If no issue number is present, stop and report that one is required.

## Hard rules

1. One issue, one branch, one PR. No unrelated refactors.
2. Never merge, force-push, amend, or skip hooks.
3. Follow `AGENTS.md` (`type` over `interface`, no `any`) and `CONTRIBUTING.md` (tests, docs, focused changes).
4. Every new/changed component keeps a valid `COMPONENT_MANIFEST`.
5. If the issue is ambiguous or blocked, comment on it and stop instead of guessing.
6. Never stage secrets, `node_modules`, build output, `.turbo`, or pre-existing dirty files.

## Step 1 — Read the issue

```powershell
git status --short --branch
gh issue view <number> --repo michaelmcshinsky/slipstream-ui --comments
```

If the issue is closed, a duplicate, or not actionable, report that and stop.

## Step 2 — Branch

```powershell
git switch main
git pull --ff-only origin main
git switch -c fix/<number>-<short-slug>
```

Use `feat/` for a new component/API, `docs/` for docs-only.

## Step 3 — Implement

- Make the smallest correct change that closes the issue.
- Add or update tests for behavior changes.
- Update docs and the component manifest when a public component changes.
- Do not reformat unrelated files.

## Step 4 — Verify

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm validate:manifests
```

If manifests/registry changed:

```powershell
pnpm generate:registry
pnpm generate:llm-docs
```

Then re-run the gates. Stop on failure.

## Step 5 — Commit and push

```powershell
git status --short
git diff --stat
git add <explicit paths>
git commit -m "fix: <what changed> (#<number>)"
git push -u origin HEAD
```

Never use `git add -A`, `git add .`, or `git commit -a`.

## Step 6 — Open the PR

```powershell
gh pr create --repo michaelmcshinsky/slipstream-ui --base main --head <branch> --title "<type>: <title> (#<number>)" --body "Closes #<number>`n`n## Summary`n<what changed and why>`n`n## Verification`n- pnpm lint`n- pnpm typecheck`n- pnpm test`n- pnpm build`n- pnpm validate:manifests"
```

Do not merge. Report the PR URL.

If CI fails, fix the branch and push again.

## Step 7 — Report

Output a plain-text report with:

- Issue number/title.
- Branch and commit SHA.
- PR URL.
- Verification results.
- Any blocker or CI failure with the exact error.

## Output rule

Your final action must be a plain-text assistant message. Do not end the run on a tool call.
