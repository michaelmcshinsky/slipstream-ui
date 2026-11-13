---
description: Address open GitHub issues in Slipstream UI from D:/Projects/slipstream-ui - pick issues, implement focused fixes, run the full CI gate, push branches, and open PRs. Never merges or force-pushes.
agent: build
---

# Slipstream UI issue automation

Run from the active repo: `D:/Projects/slipstream-ui`.
Do not use the stale copies at `D:/Projects/_modernization/slipstream-ui` or `D:/Documents/Projects/slipstream-ui`.

For a fast read-only check, use `automation-issues-list` instead. Use this full run only when there is a selected issue and the runner allows more than a few minutes.

## Arguments

`$ARGUMENTS` may contain:

- `--issue N` — work one specific issue (repeatable).
- `--limit N` — max issues to address (default 1).
- `--label NAME` — only issues with this label.
- `--no-pr` — commit and push the branch, but do not open a PR.
- `--draft` — open the PR as a draft.
- `--no-push` — local commit only.

## Hard rules

1. Never print or commit secrets, tokens, `.env*`, `node_modules`, build output, or `.turbo` caches.
2. Never merge a PR. Never force-push. Never amend a shared commit. Never skip hooks.
3. One issue per branch and PR. Keep each change focused; no drive-by refactors.
4. Do not touch unrelated open PRs or issues.
5. Every new/changed component must keep its `COMPONENT_MANIFEST` valid and in sync.
6. If an issue is ambiguous, blocked, or needs a design decision, comment on the issue and skip it rather than guessing.
7. Preserve the existing public API unless the issue explicitly calls for a breaking change.

## Phase 0 — Preflight

```powershell
Get-Location
git status --short --branch
gh auth status
gh repo view michaelmcshinsky/slipstream-ui --json nameWithOwner,defaultBranchRef
node --version
pnpm --version
```

Record the starting branch/commit and any pre-existing dirty files:

```powershell
$startBranch = git branch --show-current
$startCommit = git rev-parse HEAD
$startDirty = @(git status --porcelain)
Write-Output "branch=$startBranch commit=$startCommit preDirty=$($startDirty.Count)"
```

If the tree is dirty, stop unless every dirty file is intentional and you will not commit it. Prefer a clean start:

```powershell
git fetch origin
```

## Phase 1 — Select issues

```powershell
gh issue list --repo michaelmcshinsky/slipstream-ui --state open --limit 50 `
  --json number,title,labels,body,updatedAt,assignees
```

If the result is empty, report `No open issues` and stop. Do not invent work.

Selection order:

1. `--issue` values, if given.
2. `bug` + `priority:high` / `P1`.
3. `bug`.
4. `good first issue`.
5. Other actionable issues.

Skip issues labelled `blocked`, `needs-design`, `question`, `wontfix`, `duplicate`, or `stale` unless the user explicitly named them.

Read the full issue and comments before coding:

```powershell
gh issue view <number> --repo michaelmcshinsky/slipstream-ui --comments
```

## Phase 2 — Branch and implement

For each selected issue:

```powershell
git switch main
git pull --ff-only origin main
git switch -c fix/<number>-<short-slug>
```

Use `feat/` for a new component or API, `fix/` for a bug, `docs/` for documentation-only issues.

Implement the smallest correct change that closes the issue:

- Follow `AGENTS.md`: `type` over `interface`, no `any`, strict null checks.
- Follow `CONTRIBUTING.md`: focused changes, tests for behavior, docs for public API changes.
- New or changed components need a `COMPONENT_MANIFEST` and unit/accessibility tests.
- Update the docs page and sidebar entry when a public component changes.
- Do not reformat unrelated files.

## Phase 3 — Verify

Run the same gates as CI:

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm validate:manifests
```

If manifests or registry output changed, regenerate the derived artifacts:

```powershell
pnpm generate:registry
pnpm generate:llm-docs
```

Re-run the gates after regenerating. Stop and report if anything fails.

## Phase 4 — Commit and push

```powershell
git status --short
git diff --stat
```

Stage only files for this issue, explicitly by path. Never use `git add -A`, `git add .`, or `git commit -a`.

```powershell
git add <explicit paths>
git commit -m "fix: <what changed> (#<number>)"
```

Use `feat:` for new functionality, `docs:` for docs-only, `chore:` for tooling. Reference the issue number.

```powershell
git push -u origin HEAD
```

Never force-push.

## Phase 5 — Open a PR

Unless `--no-pr`:

```powershell
gh pr create --repo michaelmcshinsky/slipstream-ui --base main --head <branch> `
  --title "<type>: <concise title> (#<number>)" `
  --body "Closes #<number>`n`n## Summary`n<what changed and why>`n`n## Verification`n- pnpm lint`n- pnpm typecheck`n- pnpm test`n- pnpm build`n- pnpm validate:manifests"
```

Add `--draft` when requested. Do not merge. Report the PR URL.

If CI fails, read the failing job logs, fix the branch, and push again. Do not skip hooks or force-push.

## Phase 6 — Report

- Issues considered and why each was selected or skipped.
- For each addressed issue: branch, commit SHA, PR URL, tests run.
- Any issue left with a comment explaining the blocker.
- Failures with exact command and error.
- Confirm: no merges, no force-pushes, no secrets printed, no unrelated files committed.

## Output rule

Your final action must be a plain-text assistant message. Do not end the run on a tool call.
