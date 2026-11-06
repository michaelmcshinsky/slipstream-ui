# Publishing the MCP server

The registry metadata is prepared at [`packages/mcp-server/server.json`](../packages/mcp-server/server.json).
The npm package declares the matching `mcpName`.

## Official MCP Registry

Prerequisites: an npm account that can publish `@slipstream-ui/mcp-server` and a
GitHub account whose login owns the `io.github.michaelmcshinsky` namespace.

```bash
# 1. Publish the package (CI does this on version commits)
npm publish --access public

# 2. Install the publisher and authenticate
npx @modelcontextprotocol/publisher init
npx @modelcontextprotocol/publisher login github

# 3. Publish the metadata
npx @modelcontextprotocol/publisher publish packages/mcp-server/server.json
```

The server name in `server.json` is:

```
io.github.michaelmcshinsky/slipstream-ui
```

## Smithery

1. Connect the repository `michaelmcshinsky/slipstream-ui`.
2. Set the start command to `npx -y @slipstream-ui/mcp-server`.
3. Transport: `stdio`.
4. Tools: `list_components`, `search_components`, `get_component_manifest`,
   `get_usage_examples`, `validate_usage`.

## mcp.so

Submit the npm package name and repository URL. No remote endpoint is required;
the server is stdio-only.

## Verification

After publishing:

- [ ] The listing resolves and shows five tools.
- [ ] A fresh client can run `list_components` and `validate_usage`.
- [ ] The listing links to `https://slipstreamui.com/docs/mcp`.
- [ ] The version matches the published npm package.

## Status

- Metadata: **prepared**.
- Submission: **not performed** — requires npm publish rights and registry
  authentication. Do not mark SLIP-050 complete until the listing URLs exist.
- Remote transport: not offered. The server is local stdio only.
