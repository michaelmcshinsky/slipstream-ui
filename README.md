# Slipstream UI

The AI-first React component library — your AI already knows how to use it.

## Overview

Slipstream UI is a modern React component library designed specifically for AI-assisted development. Every component ships a machine-readable `COMPONENT_MANIFEST` so coding agents like Claude, Cursor, and Copilot can generate correct UI the first time.

## Key Features

- **AI-Native Design**: Every component includes a machine-readable manifest for AI agents
- **Composable Primitives**: Build complex UIs from simple, focused components
- **Deep AI SDK Support**: First-class streaming, tool calls, and generative UI
- **MCP Server**: Zero-hallucination surface for agents to query component specs
- **TypeScript**: Full type safety with excellent IntelliSense
 - **Accessible**: Keyboard and screen-reader behavior covered by jest-axe tests; Avatar and slot composition use Radix UI primitives

## Quick Start

```bash
# Initialize with CLI
npx slipstream-ui@latest init

# Or install manually
pnpm add @slipstream-ui/core @slipstream-ui/ai
```

## Documentation

Visit [slipstreamui.com/docs](https://slipstreamui.com/docs) for full documentation.

## Packages

- `@slipstream-ui/core` - Base atoms and molecules
- `@slipstream-ui/ai` - AI interaction components (Message, Conversation, Reasoning, etc.)
- `@slipstream-ui/themes` - Theming system with presets
- `@slipstream-ui/mcp-server` - MCP server for AI agents
- `@slipstream-ui/cli` - CLI tool for installation and management

## Development

```bash
# Install dependencies
pnpm install

# Run all packages in dev mode
pnpm dev

# Build all packages
pnpm build

# Type check
pnpm typecheck

# Validate component manifests
pnpm validate:manifests
```

## License

MIT
