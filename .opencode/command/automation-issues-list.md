---
description: Fast Slipstream UI issue triage — list open GitHub issues, rank them, and recommend one. Read-only; no branches, commits, or PRs. Safe for a short automation timeout.
agent: build
---

# Slipstream UI issue list (fast lane)

Run from `D:/Projects/slipstream-ui`.
This command is read-only. It does not create branches, edit files, commit, push, or open PRs.

## Step 1 — List open issues

```powershell
gh issue list --repo michaelmcshinsky/slipstream-ui --state open --limit 50 --json number,title,labels,updatedAt
```

## Step 2 — Decide

If the result is empty, output exactly:

```text
No open issues.
```

and stop. Do not invent work.

If there are issues, rank them:

1. `bug` + high priority (`priority:high`, `P1`).
2. `bug`.
3. `good first issue`.
4. Everything else actionable.

Skip `blocked`, `needs-design`, `question`, `wontfix`, `duplicate`, and `stale` unless the user named them.

## Step 3 — Report

Output a short plain-text report:

- The open issue count.
- The recommended issue: number, title, labels, and one-line reason.
- Any issues skipped and why.
- The exact command the user can run next to implement it.

## Output rule

Your final action must be a plain-text assistant message. Do not end the run on a tool call.
