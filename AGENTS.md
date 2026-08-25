# Slipstream UI - Agent Guidelines

This document contains rules and guidelines for AI agents working in this repository.

## Project Overview

Slipstream UI is an AI-first React component library. Every component ships a machine-readable `COMPONENT_MANIFEST` so coding agents can generate correct UI the first time.

## Architecture

- **Monorepo**: Uses pnpm workspaces + Turborepo
- **Packages**:
  - `@slipstream-ui/core` - Base atoms and molecules
  - `@slipstream-ui/ai` - AI interaction components
  - `@slipstream-ui/themes` - Theming system
  - `@slipstream-ui/mcp-server` - MCP server for agents
  - `@slipstream-ui/cli` - CLI tool
- **Apps**:
  - `docs` - Next.js documentation site
  - `playground` - Vite playground for testing

## Component Development Rules

1. **Every component must have a COMPONENT_MANIFEST**
   - Manifests live in `packages/core/src/manifests/` or `packages/ai/src/manifests/`
   - Run `pnpm validate:manifests` to validate all manifests against required fields
   - Schema defined in `packages/core/src/types/manifest.ts`

2. **Component structure**:
   - Use Radix UI primitives for accessibility
   - Follow atomic design principles (atom, molecule, organism)
   - Export from `index.ts` in component directory
   - Include proper TypeScript types and JSDoc

3. **Styling**:
   - Use Tailwind CSS v3 with the shared config from `tooling/tailwind-config`
   - Support dark mode via CSS variables (`darkMode: ['class']`)
   - Follow theming system from `@slipstream-ui/themes`

4. **Testing**:
   - Add unit tests for all components (vitest + @testing-library/react)
   - Test accessibility with jest-axe
   - Test dark mode variants

## Build Commands

- `pnpm install` - Install all dependencies
- `pnpm dev` - Run all packages in dev mode
- `pnpm build` - Build all packages
- `pnpm typecheck` - Type check all packages
- `pnpm lint` - Lint all packages
- `pnpm validate:manifests` - Validate all component manifests

## MCP Server

The MCP server (`packages/mcp-server`) provides tools for agents to:
- List all available components
- Get component manifests
- Query component properties
- Get usage examples

## CLI Development

The CLI (`packages/cli`) should support:
- `slipstream-ui init` - Initialize in a new project
- `slipstream-ui add <component>` - Add a specific component
- `slipstream-ui list` - List available components

## Documentation

- Docs site uses Next.js 14 with App Router
- Content lives in `apps/docs/content/docs/**/*.mdx`
- Component pages should be auto-generated from manifests where possible
- Always include live, interactive examples

## Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Prefer composition over inheritance
- Keep components focused and single-purpose
- Document intent, not mechanics

## When Adding New Components

1. Create component in appropriate package (core or ai)
2. Add TypeScript types with proper JSDoc
3. Create COMPONENT_MANIFEST in the package's `src/manifests/` directory
4. Add unit tests
5. Add to component index
6. Update documentation (add page + sidebar entry in `apps/docs/app/docs/layout.tsx`)
7. Run `pnpm validate:manifests` to verify the manifest

## Priority Order

When making decisions:
1. Correctness and robustness
2. Maintainability and readability
3. Performance
4. Convention
