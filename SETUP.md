# Slipstream UI - Setup Guide

This guide will help you set up the Slipstream UI development environment and get started with building.

## Prerequisites

- **Node.js**: 18.0.0 or higher
- **pnpm**: 8.0.0 or higher (recommended package manager)
- **Git**: For cloning the repository

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd slipstream-ui
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the monorepo, including:
- Root dependencies (Turbo, Changesets, TypeScript)
- All package dependencies
- Tooling packages

### 3. Verify Installation

```bash
# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Build all packages
pnpm build
```

## Development

### Running All Packages

```bash
# Run all packages in development mode
pnpm dev
```

This will start:
- Core package in watch mode
- AI package in watch mode
- Themes package in watch mode
- MCP server in watch mode
- CLI in watch mode
- Docs site (Next.js)
- Playground (Vite)

### Running Specific Apps

```bash
# Run only the docs site
pnpm dev:docs

# Run only the playground
pnpm dev:playground
```

### Building Packages

```bash
# Build all packages
pnpm build

# Build specific package
cd packages/core
pnpm build
```

## Package Structure

```
slipstream-ui/
├── packages/
│   ├── core/           # @slipstream-ui/core
│   ├── ai/             # @slipstream-ui/ai
│   ├── themes/         # @slipstream-ui/themes
│   ├── mcp-server/     # @slipstream-ui/mcp-server
│   └── cli/            # @slipstream-ui/cli
├── apps/
│   ├── docs/           # Next.js documentation site
│   └── playground/     # Vite playground
└── tooling/
    ├── typescript-config/
    ├── eslint-config/
    └── tailwind-config/
```

## Working with Components

### Adding a New Core Component

1. Create the component in `packages/core/src/components/<component-name>/`
2. Add TypeScript types and JSDoc comments
3. Create the component manifest in `packages/core/src/manifests/<component-name>.manifest.json`
4. Export from component directory
5. Add to `packages/core/src/index.ts`
6. Update MCP server and CLI to include the new component
7. Run `pnpm validate:manifests` to validate

### Adding a New AI Component

1. Create the component in `packages/ai/src/components/<component-name>/`
2. Add TypeScript types to `packages/ai/src/types/index.ts` if needed
3. Create the component manifest in `packages/ai/src/manifests/<component-name>.manifest.json`
4. Export from component directory
5. Add to `packages/ai/src/index.ts`
6. Update MCP server and CLI to include the new component
7. Run `pnpm validate:manifests` to validate

### Component Manifest Template

```json
{
  "id": "component-name",
  "name": "ComponentName",
  "tier": "atom|molecule|organism|pattern",
  "description": "One-line description",
  "designIntent": "Why this component exists",
  "props": [
    {
      "name": "propName",
      "type": "string|number|boolean|...",
      "defaultValue": "default-value",
      "required": false,
      "description": "What the prop does",
      "enum": ["option1", "option2"],
      "examples": ["example1", "example2"]
    }
  ],
  "examples": [
    {
      "title": "Example title",
      "code": "<Component />",
      "description": "When to use this pattern"
    }
  ],
  "antiPatterns": [
    {
      "title": "Don't do this",
      "code": "// Bad example",
      "description": "Why this is bad"
    }
  ],
  "accessibility": [
    {
      "feature": "Keyboard navigation",
      "implementation": "How it's implemented",
      "userRequirements": "What users need"
    }
  ],
  "contentGuidelines": [
    {
      "contentType": "Type of content",
      "guidelines": ["Rule 1", "Rule 2"],
      "goodExamples": ["Good"],
      "badExamples": ["Bad"]
    }
  ],
  "compositionRules": [
    {
      "component": "RelatedComponent",
      "relationship": "How they work together",
      "example": "Example composition"
    }
  ],
  "package": "@slipstream-ui/core|@slipstream-ui/ai",
  "importPath": "@slipstream-ui/core|@slipstream-ui/ai",
  "version": "0.0.1"
}
```

## Documentation

### Adding Documentation Pages

Documentation pages live in `apps/docs/app/docs/`. To add a new page:

1. Create a new directory for the page
2. Add a `page.tsx` file with the page content
3. Update the sidebar in `apps/docs/app/docs/layout.tsx` to include the new page

### Component Documentation

Each component should have its own documentation page at `apps/docs/app/docs/components/<component-id>/page.tsx` with:
- Live preview with interactive controls
- Installation instructions
- Usage examples
- Props table
- Accessibility notes
- Additional examples

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for a specific package
cd packages/core
pnpm test
```

### Type Checking

```bash
# Type check all packages
pnpm typecheck

# Type check specific package
cd packages/core
pnpm typecheck
```

### Linting

```bash
# Lint all packages
pnpm lint

# Lint specific package
cd packages/core
pnpm lint
```

## MCP Server Development

### Building the MCP Server

```bash
cd packages/mcp-server
pnpm build
```

### Testing the MCP Server

The MCP server runs on stdio and responds to MCP protocol messages. To test:

1. Build the server
2. Configure it in your AI agent's MCP settings
3. Query it using the available tools

## CLI Development

### Building the CLI

```bash
cd packages/cli
pnpm build
```

### Testing the CLI

```bash
# Link the CLI globally
cd packages/cli
pnpm build
npm link

# Test commands
slipstream-ui list
slipstream-ui add button
```

## Theming

### Creating Custom Themes

Use the `createTheme()` function from `@slipstream-ui/themes`:

```typescript
import { createTheme } from '@slipstream-ui/themes'

const customTheme = createTheme({
  brandColor: '210 100% 50%',  // HSL values
  borderRadius: '0.5rem',
  darkMode: false
})
```

### Adding Preset Themes

Add new preset themes to `packages/themes/src/presets/`:

```typescript
import { createTheme } from '../create-theme'

export const customTheme = createTheme({
  brandColor: '210 100% 50%',
  borderRadius: '0.5rem',
  darkMode: false
})
```

## Releases

### Creating a Changeset

```bash
pnpm changeset
```

Follow the prompts to describe your changes.

### Versioning Packages

```bash
pnpm version-packages
```

This updates package versions based on changesets.

### Publishing

```bash
pnpm release
```

This builds all packages and publishes them to npm.

## Troubleshooting

### Dependency Issues

If you encounter dependency issues:

```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Build Errors

If build fails:

1. Check TypeScript errors: `pnpm typecheck`
2. Check linting errors: `pnpm lint`
3. Ensure all dependencies are installed: `pnpm install`
4. Check that workspace dependencies are correctly linked

### Port Conflicts

If ports are already in use:

- Docs site: Default port 3000
- Playground: Default port 5173

You can change these in the respective package configurations.

## Getting Help

- Check the documentation in `docs/` directory
- Review `AGENTS.md` for AI agent guidelines
- Review `STRUCTURE.md` for project structure
- Check existing component manifests for examples

## Contributing

When contributing:

1. Follow the existing code style
2. Add manifests for all new components
3. Update documentation
4. Ensure all tests pass
5. Update CHANGELOG if applicable
6. Create a changeset for your changes

## Next Steps

- Read the component documentation in the docs site
- Explore the playground to see components in action
- Review the MCP server documentation
- Check out the COMPONENT_MANIFEST schema to understand the AI-first approach
