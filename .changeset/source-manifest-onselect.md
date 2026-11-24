---
'@slipstream-ui/ai': patch
---

Remove the undocumented `onSelect` prop from the Source/Sources manifest; neither component implements it, so registry, LLM docs, and MCP responses no longer advertise a phantom callback.
