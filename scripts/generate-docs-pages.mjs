#!/usr/bin/env node
/**
 * Generates docs pages for core components that lack them.
 * Run: node scripts/generate-docs-pages.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DOCS = path.join(ROOT, 'apps', 'docs', 'app', 'docs', 'components');

const pages = [
  {
    dir: 'checkbox', title: 'Checkbox', id: 'checkbox',
    description: 'Native checkbox input styled to match the design system, with controlled and uncontrolled support.',
    imports: 'Checkbox',
    propsRows: [
      { name: 'checked', type: 'boolean', description: 'Controlled checked state; omit for uncontrolled usage.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Fired when the user toggles the checkbox.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the checkbox.' },
    ],
    accessibility: [
      'Native input semantics: keyboard, form, and screen-reader behavior is identical to platform checkboxes.',
      'Provide an accessible name via aria-label or an associated Label.',
    ],
    demo: `<Checkbox id="terms" aria-label="Accept terms" />
        <Checkbox id="updates" defaultChecked aria-label="Email updates" />
        <Checkbox id="disabled" disabled aria-label="Disabled" />`,
  },
  {
    dir: 'label', title: 'Label', id: 'label',
    description: 'Accessible form label that associates with its control.',
    imports: 'Label, Input',
    propsRows: [
      { name: 'htmlFor', type: 'string', description: 'The id of the control this label describes.' },
      { name: 'children', type: 'ReactNode', description: 'The label text.' },
    ],
    accessibility: [
      'htmlFor/id pairing links the label to its control.',
      'Placeholders are not a replacement for labels.',
    ],
    demo: `<Label htmlFor="demo-email">Email address</Label>
        <Input id="demo-email" type="email" placeholder="you@example.com" />`,
  },
  {
    dir: 'progress', title: 'Progress', id: 'progress',
    description: 'Determinate progress bar with role=progressbar and exact value semantics.',
    imports: 'Progress',
    propsRows: [
      { name: 'value', type: 'number', defaultValue: '0', description: 'Current value between 0 and max.' },
      { name: 'max', type: 'number', defaultValue: '100', description: 'Upper bound of the progress scale.' },
      { name: 'label', type: 'string', description: 'Accessible label announced by screen readers.' },
    ],
    accessibility: [
      'role="progressbar" with aria-valuenow/min/max so assistive tech reports the exact percentage.',
      'Provide an accessible label describing the task.',
    ],
    demo: `<Progress value={25} label="Upload progress" />
        <Progress value={66} label="Setup progress" />
        <Progress value={100} label="Complete" />`,
  },
  {
    dir: 'radio', title: 'Radio', id: 'radio',
    description: 'Native radio buttons grouped for mutually exclusive choices.',
    imports: 'RadioGroup, RadioGroupItem',
    propsRows: [
      { name: 'value', type: 'string', description: 'The value this item contributes to the group.' },
      { name: 'label', type: 'string', description: 'Visible label rendered next to the radio.' },
      { name: 'legend', type: 'string', description: 'Accessible group label (RadioGroup component).' },
    ],
    accessibility: [
      'RadioGroup renders a fieldset with a legend so the group name is announced.',
      'Native arrow-key navigation within the group.',
    ],
    demo: `<RadioGroup name="demo-plan" legend="Choose a plan" defaultValue="free">
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="pro" label="Pro" />
          <RadioGroupItem value="enterprise" label="Enterprise" />
        </RadioGroup>`,
  },
  {
    dir: 'separator', title: 'Separator', id: 'separator',
    description: 'Visual divider between content blocks, decorative or semantic.',
    imports: 'Separator',
    propsRows: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Direction of the divider line.' },
      { name: 'label', type: 'string', description: 'Accessible name; when set, the separator becomes semantic.' },
    ],
    accessibility: [
      'Decorative by default (role=none) so screen readers skip it.',
      'Pass a label to make it a semantic separator.',
    ],
    demo: `<div>Section A</div>
        <Separator className="my-3" />
        <div>Section B</div>`,
  },
  {
    dir: 'skeleton', title: 'Skeleton', id: 'skeleton',
    description: 'Loading placeholder that mirrors the shape of upcoming content.',
    imports: 'Skeleton',
    propsRows: [
      { name: 'className', type: 'string', description: 'Shape and size classes (e.g. h-4 w-32).' },
    ],
    accessibility: [
      'aria-hidden so screen readers skip it.',
      'Pair with a role=status region to announce loading.',
    ],
    demo: `<div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>`,
  },
  {
    dir: 'switch', title: 'Switch', id: 'switch',
    description: 'Toggle switch for binary settings, with role=switch and aria-checked.',
    imports: 'Switch',
    propsRows: [
      { name: 'checked', type: 'boolean', description: 'Controlled on/off state.' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Fired when the user toggles the switch.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the switch.' },
    ],
    accessibility: [
      'role="switch" with aria-checked announces on/off state.',
      'Space and Enter toggle the switch.',
    ],
    demo: `<Switch id="demo-notify" defaultChecked aria-label="Email notifications" />
        <Switch id="demo-dark" aria-label="Dark mode" />
        <Switch id="demo-disabled" disabled aria-label="Disabled" />`,
  },
  {
    dir: 'tabs', title: 'Tabs', id: 'tabs',
    description: 'Tabbed content container with ARIA tablist semantics and keyboard navigation.',
    imports: 'Tabs, TabsList, TabsTrigger, TabsContent',
    propsRows: [
      { name: 'value', type: 'string', description: 'Controlled active tab value.' },
      { name: 'defaultValue', type: 'string', description: 'Initial tab value when uncontrolled.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the active tab changes.' },
    ],
    accessibility: [
      'role=tablist/tab/tabpanel with aria-selected and aria-controls.',
      'Roving tabindex: only the active tab is tabbable.',
    ],
    demo: `<Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Overview panel content.</TabsContent>
          <TabsContent value="analytics">Analytics panel content.</TabsContent>
        </Tabs>`,
  },
  {
    dir: 'textarea', title: 'Textarea', id: 'textarea',
    description: 'Multi-line text input styled to match Input.',
    imports: 'Textarea',
    propsRows: [
      { name: 'value', type: 'string', description: 'Controlled value; omit for uncontrolled usage.' },
      { name: 'placeholder', type: 'string', description: 'Placeholder text shown when empty.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the textarea.' },
    ],
    accessibility: [
      'Native textarea semantics: multiline text entry and form validation work natively.',
      'Provide an accessible name via Label or aria-label.',
    ],
    demo: `<Textarea placeholder="Tell us about your project" className="max-w-md" />`,
  },
  {
    dir: 'tooltip', title: 'Tooltip', id: 'tooltip',
    description: 'Hover/focus tooltip with aria-describedby association and Escape dismissal.',
    imports: 'Tooltip, Button',
    propsRows: [
      { name: 'content', type: 'string', description: 'The tooltip text.' },
      { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'top'", description: 'Placement relative to the trigger.' },
      { name: 'delay', type: 'number', defaultValue: '300', description: 'Delay before showing on hover, in ms.' },
    ],
    accessibility: [
      'aria-describedby is injected into the trigger so the hint is announced with focus.',
      'Escape dismisses the tooltip without moving focus.',
    ],
    demo: `<Tooltip content="Save your changes">
          <Button>Hover me</Button>
        </Tooltip>`,
  },
  {
    dir: 'card', title: 'Card', id: 'card',
    description: 'Content container with header, body, and footer sections.',
    imports: 'Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button',
    propsRows: [
      { name: 'children', type: 'ReactNode', description: 'Card sub-components (CardHeader, CardContent, CardFooter).' },
    ],
    accessibility: [
      'CardTitle renders as h3; maintain logical heading order in your page.',
    ],
    demo: `<Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Form fields here.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Save</Button>
          </CardFooter>
        </Card>`,
  },
  {
    dir: 'accordion', title: 'Accordion', id: 'accordion',
    description: 'Collapsible content sections with ARIA accordion semantics.',
    imports: 'Accordion, AccordionContent, AccordionItem, AccordionTrigger',
    propsRows: [
      { name: 'value', type: 'string[]', description: 'Controlled open item ids.' },
      { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'When true, opening an item closes the others.' },
      { name: 'onValueChange', type: '(value: string[]) => void', description: 'Called when the open set changes.' },
    ],
    accessibility: [
      'Trigger has aria-expanded and aria-controls; panel has role=region.',
      'Hidden panels are removed from the tab order.',
    ],
    demo: `<Accordion defaultValue={['a']} className="max-w-md">
          <AccordionItem id="a">
            <AccordionTrigger>What is Slipstream?</AccordionTrigger>
            <AccordionContent>An AI-first component system with machine-readable manifests.</AccordionContent>
          </AccordionItem>
          <AccordionItem id="b">
            <AccordionTrigger>How do I install?</AccordionTrigger>
            <AccordionContent>Run npx slipstream-ui init in your project.</AccordionContent>
          </AccordionItem>
        </Accordion>`,
  },
  {
    dir: 'table', title: 'Table', id: 'table',
    description: 'Semantic data table with headers, body, footer, and accessible caption.',
    imports: 'Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption',
    propsRows: [
      { name: 'children', type: 'ReactNode', description: 'TableHeader, TableBody, TableFooter, and TableCaption children.' },
    ],
    accessibility: [
      'Native table semantics with scope attributes on headers.',
      'TableCaption describes the table contents for screen readers.',
    ],
    demo: `<Table className="max-w-md">
          <TableCaption>Monthly revenue</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Month</TableHead>
              <TableHead scope="col">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow><TableCell>January</TableCell><TableCell>$1,200</TableCell></TableRow>
            <TableRow><TableCell>February</TableCell><TableCell>$1,450</TableCell></TableRow>
          </TableBody>
        </Table>`,
  },
  {
    dir: 'menu', title: 'Menu', id: 'menu',
    description: 'Dropdown menu with keyboard navigation and ARIA menu semantics.',
    imports: 'Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger',
    propsRows: [
      { name: 'open', type: 'boolean', description: 'Controlled open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
    ],
    accessibility: [
      'role=menu/menuitem with aria-haspopup/aria-expanded on the trigger.',
      'Arrow keys, Home/End, and Escape navigate and close the menu.',
    ],
    demo: `<Menu>
          <MenuTrigger>Options</MenuTrigger>
          <MenuContent>
            <MenuLabel>Actions</MenuLabel>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuSeparator />
            <MenuItem destructive>Sign out</MenuItem>
          </MenuContent>
        </Menu>`,
  },
];

for (const page of pages) {
  const q = (s) => s.includes("'") ? `"${s}"` : `'${s}'`;

  const propsRows = page.propsRows
    .map((p) => `        { name: ${q(p.name)}, type: ${q(p.type)},${p.defaultValue ? ` defaultValue: ${q(p.defaultValue)},` : ''} description: ${q(p.description)} },`)
    .join('\n');

  const accessibility = page.accessibility
    .map((a) => `        ${q(a)},`)
    .join('\n');

  // Derive Code tab content: full import + demo JSX wrapped in a fragment.
  const codeContent = `import { ${page.imports} } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      ${page.demo}\n    </>\n  );\n}`;

  // Derive Usage tab content: minimal import + single-line usage.
  const firstImport = page.imports.split(',')[0].trim();
  const usageContent = `import { ${firstImport} } from '@slipstream-ui/core';\n\n// Basic usage\n<${firstImport} />`;

  // Derive Types tab content: TypeScript interface from propsRows.
  const typesContent = `interface ${page.title}Props {\n${page.propsRows.map((p) => `  ${p.name}${p.required === false ? '?' : ''}: ${p.type};`).join('\n')}\n}`;

  const code = `import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { ${page.imports} } from '@slipstream-ui/core';

export default function ${page.title}Page() {
  return (
    <ComponentPage
      id="${page.id}"
      title="${page.title}"
      description="${page.description}"
      npmPackages="@slipstream-ui/core"
      propsRows={[
${propsRows}
      ]}
      accessibility={[
${accessibility}
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            ${page.demo}
          </div>
        }
        code={${JSON.stringify(codeContent)}}
        usage={${JSON.stringify(usageContent)}}
        types={${JSON.stringify(typesContent)}}
      />
    </ComponentPage>
  );
}
`;

  const dir = path.join(DOCS, page.dir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), code);
  console.log(`Generated ${page.dir}/page.tsx`);
}
