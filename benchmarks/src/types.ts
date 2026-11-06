export type DefectClass =
  | 'unknown-prop'
  | 'invalid-enum'
  | 'missing-required'
  | 'invalid-composition'
  | 'invalid-a11y'
  | 'unsupported-state'
  | 'streaming-state'
  | 'none';

export type BenchmarkCase = {
  id: string;
  componentId: string;
  prompt: string;
  candidateCode: string;
  fixedCode: string;
  expectedValid: boolean;
  defectClass: DefectClass;
  expectedIssue: string;
};

export type ValidationIssue = {
  severity: 'error' | 'warning';
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  usageCount: number;
  issues: ValidationIssue[];
};

export type Condition = 'A' | 'B' | 'C' | 'D';

export type ProviderRequest = {
  caseId: string;
  condition: Condition;
  system: string;
  user: string;
  repair?: boolean;
};

export type ProviderResponse = {
  text: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
};

export type ModelProvider = {
  name: string;
  complete(request: ProviderRequest): Promise<ProviderResponse>;
};

export type CaseRun = {
  caseId: string;
  componentId: string;
  defectClass: DefectClass;
  expectedValid: boolean;
  condition: Condition;
  provider: string;
  output: string;
  initialOutput?: string;
  validation: ValidationResult;
  repaired: boolean;
  repairValidation?: ValidationResult;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  error?: string;
};
