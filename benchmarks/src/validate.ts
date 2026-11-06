import { validateUsageTool } from '../../packages/mcp-server/src/tools/validate-usage';
import type { ValidationIssue, ValidationResult } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIssue(value: unknown): value is ValidationIssue {
  return isRecord(value) && (value.severity === 'error' || value.severity === 'warning') && typeof value.message === 'string';
}

export async function validateCode(componentId: string, code: string): Promise<ValidationResult> {
  const result = await validateUsageTool.handler({ componentId, code });
  const text = result.content.find((entry) => entry.type === 'text')?.text;
  if (!text) throw new Error(`validate_usage returned no text for ${componentId}`);

  const parsed: unknown = JSON.parse(text);
  if (!isRecord(parsed)) throw new Error(`validate_usage returned a non-object for ${componentId}`);

  const issues = Array.isArray(parsed.issues) ? parsed.issues.filter(isIssue) : [];
  return {
    valid: parsed.valid === true,
    usageCount: typeof parsed.usageCount === 'number' ? parsed.usageCount : 0,
    issues,
  };
}
