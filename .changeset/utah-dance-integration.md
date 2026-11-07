---
"@slipstream-ui/core": minor
"@slipstream-ui/registry": patch
---

Add `contrast`/`onDark` button variants and link-mode pagination (`pageHrefs`,
`linkComponent`, `linkHrefProp`) for Server Components. Invalidate the manifest
registry cache when manifest files change so a running MCP server sees edits
without a restart.
