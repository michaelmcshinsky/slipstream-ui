---
"@slipstream-ui/mcp-server": patch
---

Fix `validate_usage` so JSX-valued props and nested arrow functions no longer hide later props, and inherited native HTML attributes (`id`, `name`, `aria-*`, `data-*`, event handlers) are not reported as hallucinated props.
