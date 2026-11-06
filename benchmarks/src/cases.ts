import type { BenchmarkCase, DefectClass } from './types';
import { loadManifests, manifestById, type Manifest, type ManifestProp } from './manifests';

function exportName(manifest: Manifest): string {
  return manifest.exportName ?? manifest.name.replace(/[^A-Za-z0-9]/g, '');
}

function jsxValue(prop: ManifestProp): string {
  if (prop.enum && prop.enum.length > 0) return `"${prop.enum[0]}"`;
  const type = (prop.type ?? '').toLowerCase();
  if (type.includes('boolean')) return '{true}';
  if (type.includes('number')) return '{1}';
  if (type.includes('[]') || type.includes('array')) return '{[]}';
  if (type.includes('=>') || type.includes('function')) return '{() => {}}';
  return '"example"';
}

/** Build a structurally valid usage: every required prop is present. */
export function buildValidCode(manifest: Manifest): string {
  const name = exportName(manifest);
  const required = (manifest.props ?? []).filter((prop) => prop.required);
  const attrs: string[] = [];
  let hasChildren = false;
  for (const prop of required) {
    if (prop.name === 'children') {
      hasChildren = true;
      continue;
    }
    attrs.push(`${prop.name}=${jsxValue(prop)}`);
  }
  const attrText = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
  return hasChildren ? `<${name}${attrText}>Content</${name}>` : `<${name}${attrText} />`;
}

function insertAttribute(code: string, name: string, attribute: string): string {
  const start = code.indexOf(`<${name}`);
  if (start === -1) throw new Error(`Cannot inject attribute: <${name}> not found`);
  const end = code.indexOf('>', start);
  if (end === -1) throw new Error(`Cannot inject attribute: unclosed <${name}>`);
  const before = code.slice(0, end);
  const selfClosing = before.trimEnd().endsWith('/');
  const insertAt = selfClosing ? before.lastIndexOf('/') : before.length;
  return `${code.slice(0, insertAt)} ${attribute} ${code.slice(insertAt)}`;
}

function removeAttribute(code: string, name: string): string {
  const pattern = new RegExp(`\\s+${name}=(?:"[^"]*"|'[^']*'|\\{[^}]*\\})`);
  return code.replace(pattern, '');
}

function replaceAttribute(code: string, name: string, value: string): string {
  const pattern = new RegExp(`(\\s+${name}=)(?:"[^"]*"|'[^']*'|\\{[^}]*\\})`);
  if (pattern.test(code)) return code.replace(pattern, `$1"${value}"`);
  return insertAttribute(code, exportNameFromCode(code), `${name}="${value}"`);
}

function exportNameFromCode(code: string): string {
  const match = /<([A-Z][A-Za-z0-9]*)/.exec(code);
  if (!match) throw new Error('Cannot find a component tag in generated code');
  return match[1];
}

type CuratedInput = {
  componentId: string;
  defectClass: Exclude<DefectClass, 'none'>;
  prompt: string;
  candidateCode: string;
  expectedIssue: string;
};

function curated(input: CuratedInput): BenchmarkCase {
  const manifest = manifestById(input.componentId);
  return {
    id: `curated-${input.defectClass}-${input.componentId}`,
    componentId: input.componentId,
    prompt: input.prompt,
    candidateCode: input.candidateCode,
    fixedCode: buildValidCode(manifest),
    expectedValid: false,
    defectClass: input.defectClass,
    expectedIssue: input.expectedIssue,
  };
}

const CURATED: CuratedInput[] = [
  // Invalid composition (10)
  { componentId: 'accordion', defectClass: 'invalid-composition', prompt: 'Build an accordion with one item.', candidateCode: '<AccordionItem value="a"><AccordionTrigger>Title</AccordionTrigger><AccordionContent>Body</AccordionContent></AccordionItem>', expectedIssue: 'AccordionItem rendered without an Accordion root.' },
  { componentId: 'tabs', defectClass: 'invalid-composition', prompt: 'Build a tab set.', candidateCode: '<TabList><Tab value="a">A</Tab></TabList><TabPanel value="a">A</TabPanel>', expectedIssue: 'Tabs parts rendered without a Tabs root.' },
  { componentId: 'dialog', defectClass: 'invalid-composition', prompt: 'Build a confirmation dialog.', candidateCode: '<DialogContent><DialogTitle>Confirm</DialogTitle></DialogContent>', expectedIssue: 'DialogContent rendered without a Dialog root.' },
  { componentId: 'menu', defectClass: 'invalid-composition', prompt: 'Build a menu.', candidateCode: '<MenuItem>Open</MenuItem>', expectedIssue: 'MenuItem rendered without a Menu root.' },
  { componentId: 'popover', defectClass: 'invalid-composition', prompt: 'Build a popover.', candidateCode: '<PopoverContent>Details</PopoverContent>', expectedIssue: 'PopoverContent rendered without a Popover root.' },
  { componentId: 'select', defectClass: 'invalid-composition', prompt: 'Build a select.', candidateCode: '<SelectItem value="a">A</SelectItem>', expectedIssue: 'SelectItem rendered without a Select root.' },
  { componentId: 'table', defectClass: 'invalid-composition', prompt: 'Build a table row.', candidateCode: '<TableRow><TableCell>A</TableCell></TableRow>', expectedIssue: 'TableRow rendered without a Table root.' },
  { componentId: 'breadcrumb', defectClass: 'invalid-composition', prompt: 'Build a breadcrumb trail.', candidateCode: '<BreadcrumbItem>Home</BreadcrumbItem>', expectedIssue: 'BreadcrumbItem rendered without a Breadcrumb root.' },
  { componentId: 'form-field', defectClass: 'invalid-composition', prompt: 'Build a form field.', candidateCode: '<Input placeholder="Email" />', expectedIssue: 'Input rendered without a FormField label wrapper.' },
  { componentId: 'tooltip', defectClass: 'invalid-composition', prompt: 'Build a tooltip.', candidateCode: '<TooltipContent>Tip</TooltipContent>', expectedIssue: 'TooltipContent rendered without a Tooltip root.' },

  // Invalid accessibility (10)
  { componentId: 'button', defectClass: 'invalid-a11y', prompt: 'Build an icon-only button.', candidateCode: '<Button size="icon"><PlusIcon /></Button>', expectedIssue: 'Icon-only button has no accessible name.' },
  { componentId: 'dialog', defectClass: 'invalid-a11y', prompt: 'Build a dialog.', candidateCode: '<Dialog open><DialogContent>Confirm</DialogContent></Dialog>', expectedIssue: 'Dialog has no accessible title.' },
  { componentId: 'input', defectClass: 'invalid-a11y', prompt: 'Build an email input.', candidateCode: '<Input placeholder="Email" />', expectedIssue: 'Input is labelled only by placeholder text.' },
  { componentId: 'form-field', defectClass: 'invalid-a11y', prompt: 'Build a form field.', candidateCode: '<FormField id="email" label=" "><Input id="email" /></FormField>', expectedIssue: 'FormField label is empty.' },
  { componentId: 'select', defectClass: 'invalid-a11y', prompt: 'Build a select.', candidateCode: '<Select options={[]} />', expectedIssue: 'Select has no label.' },
  { componentId: 'progress', defectClass: 'invalid-a11y', prompt: 'Build a progress bar.', candidateCode: '<Progress value={40} />', expectedIssue: 'Progress has no accessible label.' },
  { componentId: 'switch', defectClass: 'invalid-a11y', prompt: 'Build a toggle.', candidateCode: '<Switch checked />', expectedIssue: 'Switch has no accessible label.' },
  { componentId: 'toast', defectClass: 'invalid-a11y', prompt: 'Build a success toast.', candidateCode: '<Toast title="" description="Saved" />', expectedIssue: 'Toast has an empty title.' },
  { componentId: 'command-palette', defectClass: 'invalid-a11y', prompt: 'Build a command palette.', candidateCode: '<CommandPalette open onOpenChange={() => {}} commands={[]} onSelect={() => {}} />', expectedIssue: 'Command palette has no accessible label.' },
  { componentId: 'attachment', defectClass: 'invalid-a11y', prompt: 'Build a file attachment chip.', candidateCode: '<Attachment attachment={{ id: "1", name: "", status: "done" }} />', expectedIssue: 'Attachment has no file name and no remove label.' },

  // Unsupported state (10)
  { componentId: 'message', defectClass: 'unsupported-state', prompt: 'Build a streaming assistant message.', candidateCode: '<Message message={{ id: "1", role: "assistant", content: "" }} isStreaming error="Network error" />', expectedIssue: 'Message is streaming and errored at the same time.' },
  { componentId: 'tool-call', defectClass: 'unsupported-state', prompt: 'Build a completed tool call.', candidateCode: '<ToolCall toolCall={{ id: "1", name: "search", state: "output-available" }} />', expectedIssue: 'Tool call is output-available without an output.' },
  { componentId: 'reasoning', defectClass: 'unsupported-state', prompt: 'Build a reasoning block.', candidateCode: '<Reasoning steps={[]} isStreaming duration={1200} />', expectedIssue: 'Reasoning reports a duration while still streaming.' },
  { componentId: 'conversation', defectClass: 'unsupported-state', prompt: 'Build a conversation.', candidateCode: '<Conversation messages={[]} isLoading streamingMessageId="m1" />', expectedIssue: 'Conversation is loading and streaming an id that does not exist.' },
  { componentId: 'streaming-indicator', defectClass: 'unsupported-state', prompt: 'Build a streaming indicator.', candidateCode: '<StreamingIndicator isStreaming={false} text="Streaming…" />', expectedIssue: 'Indicator says streaming in text while isStreaming is false.' },
  { componentId: 'prompt-input', defectClass: 'unsupported-state', prompt: 'Build a prompt input.', candidateCode: '<PromptInput onSubmit={() => {}} isLoading hasError />', expectedIssue: 'Prompt input is loading and in an error state.' },
  { componentId: 'confirmation', defectClass: 'unsupported-state', prompt: 'Build a confirmation.', candidateCode: '<Confirmation title="Delete?" status="approved" showActions />', expectedIssue: 'Confirmation shows actions after approval.' },
  { componentId: 'response', defectClass: 'unsupported-state', prompt: 'Build an assistant response.', candidateCode: '<Response>{""}</Response>', expectedIssue: 'Response has empty content.' },
  { componentId: 'select', defectClass: 'unsupported-state', prompt: 'Build a multi-select.', candidateCode: '<Select options={[]} multiple value="a" />', expectedIssue: 'Multi-select receives a string value instead of an array.' },
  { componentId: 'data-table', defectClass: 'unsupported-state', prompt: 'Build a data table.', candidateCode: '<DataTable columns={[]} data={[]} loading emptyMessage="No results" />', expectedIssue: 'Data table is loading and simultaneously empty.' },

  // Streaming state (10)
  { componentId: 'message', defectClass: 'streaming-state', prompt: 'Build a streaming assistant message.', candidateCode: '<Message message={{ id: "1", role: "assistant", content: "" }} isStreaming />', expectedIssue: 'Streaming message has no content.' },
  { componentId: 'tool-call', defectClass: 'streaming-state', prompt: 'Build a failed tool call.', candidateCode: '<ToolCall toolCall={{ id: "1", name: "search", state: "output-error" }} />', expectedIssue: 'Tool call is output-error without an error payload.' },
  { componentId: 'reasoning', defectClass: 'streaming-state', prompt: 'Build streaming reasoning.', candidateCode: '<Reasoning steps={[]} isStreaming />', expectedIssue: 'Streaming reasoning has no steps.' },
  { componentId: 'conversation', defectClass: 'streaming-state', prompt: 'Build a streaming conversation.', candidateCode: '<Conversation messages={[]} streamingMessageId="missing" />', expectedIssue: 'streamingMessageId does not match any message.' },
  { componentId: 'streaming-indicator', defectClass: 'streaming-state', prompt: 'Build a streaming indicator.', candidateCode: '<StreamingIndicator isStreaming text="" />', expectedIssue: 'Streaming indicator has no label.' },
  { componentId: 'response', defectClass: 'streaming-state', prompt: 'Build a streaming response.', candidateCode: '<Response>{null}</Response>', expectedIssue: 'Response children are null during streaming.' },
  { componentId: 'inline-citation', defectClass: 'streaming-state', prompt: 'Build an inline citation.', candidateCode: '<InlineCitation source={{ id: "", title: "", url: "" }} />', expectedIssue: 'Inline citation has an empty source.' },
  { componentId: 'source', defectClass: 'streaming-state', prompt: 'Build a source list.', candidateCode: '<Source index={1} source={{ id: "", title: "", url: "" }} sources={[]} />', expectedIssue: 'Source has an empty source and an empty list.' },
  { componentId: 'branch', defectClass: 'streaming-state', prompt: 'Build a branch selector.', candidateCode: '<Branch count={0} />', expectedIssue: 'Branch has no branches.' },
  { componentId: 'attachment', defectClass: 'streaming-state', prompt: 'Build an uploading attachment.', candidateCode: '<Attachment attachment={{ id: "1", name: "", status: "uploading" }} />', expectedIssue: 'Uploading attachment has no file name.' },
];

function generatedCases(): BenchmarkCase[] {
  const manifests = loadManifests();
  const withRequired = manifests.filter((manifest) => (manifest.props ?? []).some((prop) => prop.required && prop.name !== 'children'));
  const withEnum = manifests.filter((manifest) => (manifest.props ?? []).some((prop) => prop.enum && prop.enum.length > 0));
  const pool = manifests.slice(0, 30);

  const cases: BenchmarkCase[] = [];

  for (const manifest of pool) {
    const fixedCode = buildValidCode(manifest);
    cases.push({
      id: `valid-${manifest.id}`,
      componentId: manifest.id,
      prompt: `Create a correct ${manifest.name} usage. ${manifest.description ?? ''}`.trim(),
      candidateCode: fixedCode,
      fixedCode,
      expectedValid: true,
      defectClass: 'none',
      expectedIssue: 'No defect.',
    });
  }

  for (const manifest of pool.slice(0, 10)) {
    const fixedCode = buildValidCode(manifest);
    const candidateCode = insertAttribute(fixedCode, exportName(manifest), 'data-hallucinated="true"');
    cases.push({
      id: `unknown-prop-${manifest.id}`,
      componentId: manifest.id,
      prompt: `Create a ${manifest.name} usage. ${manifest.description ?? ''}`.trim(),
      candidateCode,
      fixedCode,
      expectedValid: false,
      defectClass: 'unknown-prop',
      expectedIssue: 'Unknown prop data-hallucinated.',
    });
  }

  for (const manifest of withRequired.slice(0, 10)) {
    const required = (manifest.props ?? []).find((prop) => prop.required && prop.name !== 'children');
    if (!required) continue;
    const fixedCode = buildValidCode(manifest);
    const candidateCode = removeAttribute(fixedCode, required.name);
    cases.push({
      id: `missing-required-${manifest.id}`,
      componentId: manifest.id,
      prompt: `Create a ${manifest.name} usage. ${manifest.description ?? ''}`.trim(),
      candidateCode,
      fixedCode,
      expectedValid: false,
      defectClass: 'missing-required',
      expectedIssue: `Missing required prop ${required.name}.`,
    });
  }

  for (const manifest of withEnum.slice(0, 10)) {
    const prop = (manifest.props ?? []).find((entry) => entry.enum && entry.enum.length > 0);
    if (!prop) continue;
    const fixedCode = buildValidCode(manifest);
    const candidateCode = replaceAttribute(fixedCode, prop.name, '__invalid__');
    cases.push({
      id: `invalid-enum-${manifest.id}`,
      componentId: manifest.id,
      prompt: `Create a ${manifest.name} usage. ${manifest.description ?? ''}`.trim(),
      candidateCode,
      fixedCode,
      expectedValid: false,
      defectClass: 'invalid-enum',
      expectedIssue: `Invalid enum value for ${prop.name}.`,
    });
  }

  return cases;
}

export function allCases(): BenchmarkCase[] {
  const cases = [...generatedCases(), ...CURATED.map(curated)];
  const seen = new Set<string>();
  for (const entry of cases) {
    if (seen.has(entry.id)) throw new Error(`Duplicate case id: ${entry.id}`);
    seen.add(entry.id);
  }
  return cases;
}

export function assertCaseSet(cases: BenchmarkCase[]): void {
  if (cases.length !== 100) throw new Error(`Expected 100 cases, found ${cases.length}`);
  const valid = cases.filter((entry) => entry.expectedValid).length;
  if (valid !== 30) throw new Error(`Expected 30 valid cases, found ${valid}`);
  const classes: DefectClass[] = ['unknown-prop', 'invalid-enum', 'missing-required', 'invalid-composition', 'invalid-a11y', 'unsupported-state', 'streaming-state'];
  for (const defectClass of classes) {
    const count = cases.filter((entry) => entry.defectClass === defectClass).length;
    if (count < 10) throw new Error(`Expected at least 10 ${defectClass} cases, found ${count}`);
  }
}
