/**
 * COMPONENT_MANIFEST Schema
 * 
 * Every component in Slipstream UI ships a machine-readable manifest
 * that AI agents can read to understand how to use the component correctly.
 * 
 * This manifest contains:
 * - Component metadata (id, name, tier)
 * - Design intent and purpose
 * - Full prop schema with types, defaults, and constraints
 * - Usage examples (good and anti-patterns)
 * - Accessibility requirements
 * - Content guidelines for AI text generation
 * - Composition rules
 */

export type ComponentTier = 'atom' | 'molecule' | 'organism' | 'pattern';

export interface PropSchema {
  /** Property name */
  name: string;
  /** TypeScript type */
  type: string;
  /**
   * Default value (if any). Manifests are JSON, so values are limited to
   * strings, numbers, booleans, null, or JSON-serializable structures.
   */
  defaultValue?: string | number | boolean | null | unknown[];
  /** Whether the prop is required */
  required: boolean;
  /** Description of what the prop does */
  description: string;
  /** Allowed values for enums */
  enum?: string[];
  /** Example values */
  examples?: unknown[];
}

export interface UsageExample {
  /** Title for this example */
  title: string;
  /** Code example */
  code: string;
  /** Description of when to use this pattern */
  description?: string;
}

/**
 * An anti-pattern describes a misuse in prose rather than code: the title
 * names the mistake, the explanation says why it is wrong (and what to do
 * instead). `example` optionally shows the offending snippet.
 */
export interface AntiPattern {
  /** Short name of the anti-pattern */
  title: string;
  /** Why this usage is wrong and what to do instead */
  explanation: string;
  /** Optional snippet of the offending usage */
  example?: string;
}

export interface AccessibilityRequirement {
  /** A11y feature (e.g., "keyboard navigation", "screen reader support") */
  feature: string;
  /** How the component implements this */
  implementation: string;
  /** Any user requirements */
  userRequirements?: string;
}

export interface ContentGuideline {
  /** Type of content (e.g., "button text", "placeholder text") */
  contentType: string;
  /** Guidelines for AI when generating this content */
  guidelines: string[];
  /** Examples of good content */
  goodExamples?: string[];
  /** Examples to avoid */
  badExamples?: string[];
}

export interface CompositionRule {
  /** Related component that can be composed with this one */
  component: string;
  /** How they should be used together */
  relationship: string;
  /** Example composition */
  example?: string;
}

export interface ComponentManifest {
  /** Unique component identifier (kebab-case) */
  id: string;
  /** Display name */
  name: string;
  /** Component tier in atomic design */
  tier: ComponentTier;
  /** One-line description of the component's purpose */
  description: string;
  /** Detailed design intent - why this component exists */
  designIntent: string;
  /** Full prop schema */
  props: PropSchema[];
  /** Good usage examples */
  examples: UsageExample[];
  /** Anti-patterns to avoid */
  antiPatterns?: AntiPattern[];
  /** Accessibility requirements */
  accessibility: AccessibilityRequirement[];
  /** Content guidelines for AI text generation */
  contentGuidelines?: ContentGuideline[];
  /** Composition rules with other components */
  compositionRules?: CompositionRule[];
  /** Related components */
  relatedComponents?: string[];
  /** Package this component belongs to */
  package: '@slipstream-ui/core' | '@slipstream-ui/ai';
  /** Import path */
  importPath: string;
  /** Version when this manifest was last updated */
  version: string;
}

/**
 * Type guard to check if an object is a valid ComponentManifest
 */
export function isComponentManifest(obj: unknown): obj is ComponentManifest {
  if (typeof obj !== 'object' || obj === null) return false;
  const record = obj as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.tier === 'string' &&
    typeof record.description === 'string' &&
    typeof record.designIntent === 'string' &&
    Array.isArray(record.props) &&
    Array.isArray(record.examples) &&
    Array.isArray(record.accessibility) &&
    typeof record.package === 'string' &&
    typeof record.importPath === 'string' &&
    typeof record.version === 'string'
  );
}
