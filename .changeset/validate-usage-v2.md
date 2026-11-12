---
"@slipstream-ui/mcp-server": minor
---

`validate_usage` v2: fix suggestions and whole-tree validation.

- Every issue now carries a `fix` string with the concrete next action: the documented prop a misspelled name probably meant, the nearest allowed enum value, the required props to add, or the element to render when the component is missing.
- Pass `files: [{ path, code }]` instead of `componentId` + `code` to validate a whole tree in one call. Each Slipstream component in a file is inferred from its JSX, non-Slipstream tags are reported in `summary.skippedTags` instead of being flagged, and every result is grouped by file path.
- The single-component response shape is unchanged, so existing callers keep working.
