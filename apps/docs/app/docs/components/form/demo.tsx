'use client';

import { useState } from 'react';
import { Button, Form, FormField, Input } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function FormPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [saved, setSaved] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = 'Display name is required';
    if (!email) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    setErrors(next);
    setSaved(Object.keys(next).length === 0);
  }

  return (
    <ComponentPage
      id="form"
      title="Form"
      description="Semantic form element with even-spacing layouts: stacked (default), bordered card, or inline row — native submit and validation untouched."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'variant', type: "'default' | 'card' | 'inline'", defaultValue: "'default'", description: 'Plain vertical stack, bordered card, or inline row with aligned ends.' },
        { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | number", defaultValue: "'md'", description: 'Even spacing between children — token or exact pixels (16).' },
        { name: 'onSubmit', type: '(event) => void', description: 'Native submit handler — Enter in a text input submits like any form.' },
        { name: 'noValidate', type: 'boolean', defaultValue: 'false', description: 'Skip native validation when FormField drives errors.' },
      ]}
      accessibility={[
        'Renders a real <form> — Enter-to-submit, browser validation, and autocomplete work.',
        'Pair every control with FormField so names, hints, and errors are wired.',
        'With noValidate you own every message — never silently swallow an invalid state.',
      ]}
    >
      <DemoCard
        title="Validated (interactive)"
        preview={
          <div className="w-full max-w-md">
            {saved ? (
              <div className="rounded-lg border border-success/40 bg-success/10 p-4 text-sm" role="status">
                Saved: {name} · {email}{' '}
                <button
                  type="button"
                  onClick={() => setSaved(false)}
                  className="ml-2 font-medium text-primary underline underline-offset-2"
                >
                  Edit again
                </button>
              </div>
            ) : (
              <Form onSubmit={submit} noValidate className="gap-4">
                <FormField id="demo-form-name" label="Display name" error={errors.name} required>
                  <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </FormField>
                <FormField id="demo-form-email" label="Email" error={errors.email} hint="Used for account notices." required>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                </FormField>
                <div className="flex items-center gap-3">
                  <Button type="submit">Save profile</Button>
                  <span className="text-xs text-muted-foreground">Try submitting with an invalid email.</span>
                </div>
              </Form>
            )}
          </div>
        }
        code={`import { Button, Form, FormField, Input } from '@slipstream-ui/core';

<Form onSubmit={save} noValidate className="max-w-md gap-4">
  <FormField id="name" label="Display name" error={errors.name} required>
    <Input value={name} onChange={(e) => setName(e.target.value)} />
  </FormField>
  <FormField id="email" label="Email" error={errors.email} hint="Used for account notices." required>
    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
  </FormField>
  <Button type="submit">Save profile</Button>
</Form>`}
        usage={`// Native semantics: Enter submits, no wrapper divs needed
<Form onSubmit={save}>…</Form>

// Card surface + exact 16px rhythm
<Form variant="card" gap={16}>…</Form>`}
        types={`type FormProps = {
  variant?: 'default' | 'card' | 'inline';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | number;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  noValidate?: boolean;
};`}
      />

      <DemoCard
        title="Variants"
        preview={
          <div className="w-full space-y-5">
            <Form variant="card" gap={16} className="max-w-md">
              <FormField id="vf-site" label="Site name">
                <Input placeholder="my-project" />
              </FormField>
              <FormField id="vf-repo" label="Repository">
                <Input placeholder="org/repo" />
              </FormField>
              <Button size="sm" type="button">Create project</Button>
            </Form>

            <Form variant="inline" gap="sm">
              <FormField id="vf-q" label="Quick search">
                <Input type="search" placeholder="Components…" className="w-56" />
              </FormField>
              <Button type="button">Go</Button>
            </Form>
          </div>
        }
        code={`{/* Bordered card form with exact spacing */}
<Form variant="card" gap={16} className="max-w-md">…</Form>

{/* Inline action row, ends aligned */}
<Form variant="inline" gap="sm">
  <FormField id="q" label="Quick search"><Input type="search" /></FormField>
  <Button type="submit">Go</Button>
</Form>`}
      />
    </ComponentPage>
  );
}
