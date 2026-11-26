'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Input,
  Progress,
  Select,
  Spinner,
  Switch,
} from '@slipstream-ui/core';
import { CodeBlock } from '@slipstream-ui/ai';
import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from '@/lib/component-count';
import { VERSION } from '@/lib/version';
import { track, type AnalyticsEvent } from '@/lib/analytics';
import { buildAiInstruction } from '@/lib/copy-for-ai';

type ControlValue = string | number | boolean;

type Control =
  | { kind: 'select'; id: string; label: string; options: string[] }
  | { kind: 'text'; id: string; label: string }
  | { kind: 'boolean'; id: string; label: string }
  | { kind: 'range'; id: string; label: string; min: number; max: number; step?: number };

type Playground = {
  id: string;
  name: string;
  summary: string;
  defaults: Record<string, ControlValue>;
  controls: Control[];
  render: (
    values: Record<string, ControlValue>,
    setValue: (id: string, value: ControlValue) => void
  ) => { element: React.ReactNode; code: string };
};

const string = (values: Record<string, ControlValue>, key: string, fallback = '') =>
  typeof values[key] === 'string' ? (values[key] as string) : fallback;
const bool = (values: Record<string, ControlValue>, key: string) => values[key] === true;
const number = (values: Record<string, ControlValue>, key: string, fallback = 0) =>
  typeof values[key] === 'number' ? (values[key] as number) : fallback;

const BUTTON_VARIANTS = [
  'default',
  'primary',
  'destructive',
  'success',
  'warning',
  'info',
  'outline',
  'secondary',
  'ghost',
  'link',
];

const PLAYGROUNDS: Playground[] = [
  {
    id: 'button',
    name: 'Button',
    summary: 'Actions, form submits, and navigation with semantic variants and a loading state.',
    defaults: { variant: 'primary', size: 'default', loading: false, disabled: false, label: 'Run workflow' },
    controls: [
      { kind: 'select', id: 'variant', label: 'variant', options: BUTTON_VARIANTS },
      { kind: 'select', id: 'size', label: 'size', options: ['default', 'sm', 'lg', 'icon'] },
      { kind: 'boolean', id: 'loading', label: 'loading' },
      { kind: 'boolean', id: 'disabled', label: 'disabled' },
      { kind: 'text', id: 'label', label: 'children' },
    ],
    render: (values) => {
      const variant = string(values, 'variant', 'primary');
      const size = string(values, 'size', 'default');
      const loading = bool(values, 'loading');
      const disabled = bool(values, 'disabled');
      const label = string(values, 'label', 'Run workflow');
      const attrs = [
        variant !== 'default' ? `variant="${variant}"` : '',
        size !== 'default' ? `size="${size}"` : '',
        loading ? 'loading' : '',
        disabled ? 'disabled' : '',
      ]
        .filter(Boolean)
        .join(' ');
      return {
        element: (
          <Button variant={variant as never} size={size as never} loading={loading} disabled={disabled}>
            {size === 'icon' ? '→' : label}
          </Button>
        ),
        code: `<Button${attrs ? ` ${attrs}` : ''}>${size === 'icon' ? '→' : label}</Button>`,
      };
    },
  },
  {
    id: 'badge',
    name: 'Badge',
    summary: 'Status, counts, and tags. Color alone never carries the meaning: the label does.',
    defaults: { variant: 'success', size: 'md', label: 'Ready' },
    controls: [
      {
        kind: 'select',
        id: 'variant',
        label: 'variant',
        options: ['default', 'secondary', 'destructive', 'outline', 'primary', 'success', 'warning', 'info'],
      },
      { kind: 'select', id: 'size', label: 'size', options: ['sm', 'md', 'lg'] },
      { kind: 'text', id: 'label', label: 'children' },
    ],
    render: (values) => {
      const variant = string(values, 'variant', 'success');
      const size = string(values, 'size', 'md');
      const label = string(values, 'label', 'Ready');
      return {
        element: (
          <Badge variant={variant as never} size={size as never}>
            {label}
          </Badge>
        ),
        code: `<Badge variant="${variant}" size="${size}">${label}</Badge>`,
      };
    },
  },
  {
    id: 'alert',
    name: 'Alert',
    summary: 'Inline status messaging. Renders role="alert" with a title and description.',
    defaults: { variant: 'success', title: 'Changes saved', body: 'Your workspace is up to date.' },
    controls: [
      { kind: 'select', id: 'variant', label: 'variant', options: ['default', 'destructive', 'success', 'warning', 'info'] },
      { kind: 'text', id: 'title', label: 'title' },
      { kind: 'text', id: 'body', label: 'description' },
    ],
    render: (values) => {
      const variant = string(values, 'variant', 'success');
      const title = string(values, 'title', 'Changes saved');
      const body = string(values, 'body', 'Your workspace is up to date.');
      return {
        element: (
          <Alert variant={variant as never} className="max-w-md">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{body}</AlertDescription>
          </Alert>
        ),
        code: `<Alert variant="${variant}">
  <AlertTitle>${title}</AlertTitle>
  <AlertDescription>${body}</AlertDescription>
</Alert>`,
      };
    },
  },
  {
    id: 'spinner',
    name: 'Spinner',
    summary: 'Indeterminate progress with an accessible label. Pair it with text; do not rely on motion alone.',
    defaults: { size: 'default', label: 'Loading…' },
    controls: [
      { kind: 'select', id: 'size', label: 'size', options: ['sm', 'default', 'lg'] },
      { kind: 'text', id: 'label', label: 'label' },
    ],
    render: (values) => {
      const size = string(values, 'size', 'default');
      const label = string(values, 'label', 'Loading…');
      return {
        element: <Spinner size={size as never} label={label} />,
        code: `<Spinner${size !== 'default' ? ` size="${size}"` : ''} label="${label}" />`,
      };
    },
  },
  {
    id: 'progress',
    name: 'Progress',
    summary: 'Determinate progress. Exposes aria-valuenow/valuemax so assistive tech reports the exact value.',
    defaults: { value: 60, label: 'Import progress' },
    controls: [
      { kind: 'range', id: 'value', label: 'value', min: 0, max: 100, step: 1 },
      { kind: 'text', id: 'label', label: 'label' },
    ],
    render: (values) => {
      const value = number(values, 'value', 60);
      const label = string(values, 'label', 'Import progress');
      return {
        element: (
          <div className="w-full max-w-md space-y-2">
            <Progress value={value} label={label} />
            <p className="text-xs text-muted-foreground">{value}%</p>
          </div>
        ),
        code: `<Progress value={${value}} label="${label}" />`,
      };
    },
  },
  {
    id: 'input',
    name: 'Input',
    summary: 'Single-line text field. Always give it a visible label or an aria-label.',
    defaults: { type: 'email', placeholder: 'you@example.com', disabled: false },
    controls: [
      { kind: 'select', id: 'type', label: 'type', options: ['text', 'email', 'password', 'search', 'url'] },
      { kind: 'text', id: 'placeholder', label: 'placeholder' },
      { kind: 'boolean', id: 'disabled', label: 'disabled' },
    ],
    render: (values) => {
      const type = string(values, 'type', 'email');
      const placeholder = string(values, 'placeholder', 'you@example.com');
      const disabled = bool(values, 'disabled');
      return {
        element: (
          <div className="w-full max-w-sm">
            <label htmlFor="playground-input" className="mb-1.5 block text-sm font-medium">
              Email address
            </label>
            <Input
              id="playground-input"
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              aria-describedby="playground-input-hint"
            />
            <p id="playground-input-hint" className="mt-1.5 text-xs text-muted-foreground">
              We only use this for account notices.
            </p>
          </div>
        ),
        code: `<div>
  <label htmlFor="email">Email address</label>
  <Input id="email" type="${type}" placeholder="${placeholder}"${disabled ? ' disabled' : ''} />
</div>`,
      };
    },
  },
  {
    id: 'switch',
    name: 'Switch',
    summary: 'Binary setting rendered as role="switch"; Space and Enter toggle it.',
    defaults: { checked: true, disabled: false, label: 'Email notifications' },
    controls: [
      { kind: 'boolean', id: 'checked', label: 'checked' },
      { kind: 'boolean', id: 'disabled', label: 'disabled' },
      { kind: 'text', id: 'label', label: 'aria-label' },
    ],
    render: (values, setValue) => {
      const checked = bool(values, 'checked');
      const disabled = bool(values, 'disabled');
      const label = string(values, 'label', 'Email notifications');
      return {
        element: (
          <div className="flex items-center gap-3">
            <Switch
              checked={checked}
              disabled={disabled}
              aria-label={label}
              onCheckedChange={(next) => setValue('checked', next)}
            />
            <span className="text-sm">{label}</span>
          </div>
        ),
        code: `<Switch checked={${checked}} aria-label="${label}" onCheckedChange={setEnabled}${disabled ? ' disabled' : ''} />`,
      };
    },
  },
];

const VIEWPORTS = [
  { id: 'sm', label: '375 px', width: 375 },
  { id: 'md', label: '768 px', width: 768 },
  { id: 'full', label: 'Full', width: undefined },
] as const;

type Status = 'idle' | 'copied' | 'error';

/**
 * Manifest-aware component playground. The controls are hand-curated for the
 * simplest primitives (a generated control per manifest type is the next
 * step); the JSX and the AI instruction are derived from the same manifest the
 * validator uses.
 */
export function Playground() {
  const [activeId, setActiveId] = useState(PLAYGROUNDS[0].id);
  const [valuesById, setValuesById] = useState<Record<string, Record<string, ControlValue>>>(() =>
    Object.fromEntries(PLAYGROUNDS.map((entry) => [entry.id, { ...entry.defaults }]))
  );
  const [viewport, setViewport] = useState<(typeof VIEWPORTS)[number]['id']>('full');
  const [status, setStatus] = useState<Record<string, Status>>({});

  const active = PLAYGROUNDS.find((entry) => entry.id === activeId) ?? PLAYGROUNDS[0];
  const values = valuesById[active.id] ?? active.defaults;
  const rendered = active.render(values, update);
  const width = VIEWPORTS.find((entry) => entry.id === viewport)?.width;

  const docsHref = `/docs/components/${active.id}`;

  function update(id: string, value: ControlValue) {
    setValuesById((previous) => ({
      ...previous,
      [active.id]: { ...(previous[active.id] ?? active.defaults), [id]: value },
    }));
  }

  function reset() {
    setValuesById((previous) => ({ ...previous, [active.id]: { ...active.defaults } }));
  }

  async function copy(text: string, key: string, event: AnalyticsEvent) {
    try {
      await navigator.clipboard.writeText(text);
      track(event, { component: active.id });
      setStatus((previous) => ({ ...previous, [key]: 'copied' }));
      window.setTimeout(() => setStatus((previous) => ({ ...previous, [key]: 'idle' })), 2200);
    } catch {
      setStatus((previous) => ({ ...previous, [key]: 'error' }));
      window.setTimeout(() => setStatus((previous) => ({ ...previous, [key]: 'idle' })), 3500);
    }
  }

  async function copyAi() {
    const key = 'ai';
    try {
      const response = await fetch(`/registry/${active.id}.json`);
      if (!response.ok) throw new Error('registry unavailable');
      const manifest = await response.json();
      await copy(buildAiInstruction(manifest, active.id), key, 'copy_for_ai');
    } catch {
      setStatus((previous) => ({ ...previous, [key]: 'error' }));
      window.setTimeout(() => setStatus((previous) => ({ ...previous, [key]: 'idle' })), 3500);
    }
  }

  const installCommand = `npx @slipstream-ui/cli@latest add ${active.id}`;
  const label = (key: string, idle: string) =>
    status[key] === 'copied' ? 'Copied' : status[key] === 'error' ? 'Copy failed' : idle;

  const controlNodes = active.controls.map((control) => {
        if (control.kind === 'select') {
          return (
            <Select
              key={control.id}
              label={control.label}
              options={control.options.map((option) => ({ value: option, label: option }))}
              value={String(values[control.id] ?? '')}
              onValueChange={(next) => update(control.id, next as string)}
            />
          );
        }
        if (control.kind === 'text') {
          return (
            <div key={control.id}>
              <label htmlFor={`control-${control.id}`} className="mb-1.5 block text-sm font-medium">
                {control.label}
              </label>
              <Input
                id={`control-${control.id}`}
                value={String(values[control.id] ?? '')}
                onChange={(event) => update(control.id, event.target.value)}
              />
            </div>
          );
        }
        if (control.kind === 'range') {
          return (
            <div key={control.id}>
              <label htmlFor={`control-${control.id}`} className="mb-1.5 flex items-center justify-between text-sm font-medium">
                <span>{control.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{values[control.id]}</span>
              </label>
              <input
                id={`control-${control.id}`}
                type="range"
                min={control.min}
                max={control.max}
                step={control.step ?? 1}
                value={number(values, control.id, control.min)}
                onChange={(event) => update(control.id, Number(event.target.value))}
                className="h-2 w-full cursor-pointer accent-primary"
              />
            </div>
          );
        }
        return (
          <label key={control.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={bool(values, control.id)}
              onChange={(event) => update(control.id, event.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            {control.label}
          </label>
        );
      });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Component playground</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Try the components before you install</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A curated set of interactive examples for the most-used of the {COMPONENT_COUNT} components
            ({CORE_COMPONENT_COUNT} core + {AI_COMPONENT_COUNT} AI), v{VERSION} — the full list lives in
            the component docs. Change a prop, copy the JSX, or hand the manifest to your coding agent.
            The preview uses the same tokens as the docs, so it follows the site theme.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Playground components" className="rounded-xl border border-border bg-card p-2">
          <ul className="space-y-1">
            {PLAYGROUNDS.map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(entry.id)}
                  aria-current={entry.id === active.id ? 'page' : undefined}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    entry.id === active.id
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {entry.name}
                  <span aria-hidden="true">→</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-border p-3 text-xs text-muted-foreground">
            More primitives are being added. Every component page already has a live demo and a manifest.
          </div>
        </nav>

        <div className="min-w-0 space-y-6">
          <section className="rounded-xl border border-border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div>
                <h2 className="font-semibold">{active.name}</h2>
                <p className="text-sm text-muted-foreground">{active.summary}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div role="group" aria-label="Preview width" className="flex overflow-hidden rounded-md border border-border">
                  {VIEWPORTS.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      aria-pressed={viewport === entry.id}
                      onClick={() => setViewport(entry.id)}
                      className={`px-2.5 py-1.5 text-xs transition-colors ${
                        viewport === entry.id
                          ? 'bg-muted font-medium text-foreground'
                          : 'text-muted-foreground hover:bg-muted/60'
                      }`}
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>
                <Link
                  href={docsHref}
                  className="inline-flex h-8 items-center rounded-md border border-border px-2.5 text-xs font-medium transition-colors hover:bg-muted"
                >
                  Docs
                </Link>
              </div>
            </div>
            <div className="bg-muted/20 p-6">
              <div
                className="mx-auto flex min-h-[180px] w-full items-center justify-center rounded-lg border border-dashed border-border bg-background p-6 transition-[max-width]"
                style={{ maxWidth: width ? `${width}px` : '100%' }}
              >
                {rendered.element}
              </div>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section aria-labelledby="playground-controls" className="rounded-xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="playground-controls" className="font-semibold">
                  Props
                </h2>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-4">{controlNodes}</div>
              <div className="mt-5 space-y-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => copy(installCommand, 'install', 'install_copy')}
                  className="flex w-full items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-left font-mono text-xs transition-colors hover:bg-muted"
                >
                  <span className="truncate">{installCommand}</span>
                  <span className="shrink-0 text-muted-foreground">{label('install', 'copy')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => copy(rendered.code, 'jsx', 'copy_jsx')}
                  className="flex w-full items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-muted"
                >
                  <span>Copy JSX</span>
                  <span className="text-muted-foreground">{label('jsx', 'copy')}</span>
                </button>
                <button
                  type="button"
                  onClick={copyAi}
                  className="flex w-full items-center justify-between gap-2 rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-left text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                >
                  <span>Copy for AI</span>
                  <span>{label('ai', 'manifest + rules')}</span>
                </button>
              </div>
            </section>

            <section aria-labelledby="playground-code" className="min-w-0">
              <h2 id="playground-code" className="mb-4 font-semibold">
                JSX
              </h2>
              <CodeBlock language="tsx" code={rendered.code} />
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">Copy for AI</code> includes the
                release, exact props, required props, anti-patterns and accessibility notes from this
                component&apos;s manifest. Paste it into Claude Code, Cursor, Copilot or any agent before asking for an
                implementation.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
