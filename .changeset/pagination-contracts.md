---
"@slipstream-ui/core": minor
---

Pagination contracts and item summary.

- Accept `currentPage` / `totalPages` as aliases for `page` / `pageCount`
  (migration-friendly for codebases using that naming).
- Derive the page count from `total` + `pageSize` and render a
  "Showing 26–50 of 312 students" summary (`itemLabel`, `showSummary`).
- Both `page` and `pageCount` are now optional; the nav falls back to
  page 1 of 1 when nothing is provided.
