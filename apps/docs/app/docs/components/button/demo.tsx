'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

// Derived from the component so new variants/sizes appear here automatically.
type ButtonVariant = NonNullable<ButtonProps['variant']>;
type ButtonSize = NonNullable<ButtonProps['size']>;

const VARIANTS: ButtonVariant[] = [
  'default',
  'destructive',
  'success',
  'warning',
  'info',
  'outline',
  'outline-destructive',
  'outline-success',
  'outline-warning',
  'outline-info',
  'secondary',
  'ghost',
  'link',
];
const SIZES: ButtonSize[] = ['sm', 'default', 'lg'];

const variantLabel = (v: ButtonVariant) =>
  v
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const variantCode = VARIANTS.map(
  (v) =>
    `<Button${v === 'default' ? '' : ` variant="${v}"`}>${v.charAt(0).toUpperCase() + v.slice(1).replace('-', ' ')}</Button>`
).join('\n');

export default function ButtonPage() {
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [size, setSize] = useState<ButtonSize>('default');

  return (
    <ComponentPage
      id="button"
      title="Button"
      description="A clickable button component with variants for different visual styles and sizes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'variant', type: "'default' | 'primary' | 'destructive' | 'danger' | 'success' | 'warning' | 'info' | 'outline' | 'outline-destructive' | 'outline-success' | 'outline-warning' | 'outline-info' | 'secondary' | 'ghost' | 'link' | 'contrast' | 'onDark'", defaultValue: "'default'", description: 'Visual style variant. primary/danger are aliases of default/destructive; contrast/onDark are fixed-ink fills for always-dark surfaces (hero sections) that do not follow the theme.' },
        { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", defaultValue: "'default'", description: 'Size variant' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the button' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Renders the child element (e.g. <a>, <Link>) with button styling instead of a <button>.' },
        { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Disables the button and swaps the label for a spinner (used by ConfirmDialog internally).' },
        { name: 'loadingLabel', type: 'string', defaultValue: "'Loading'", description: 'Accessible label announced while loading.' },
      ]}
      accessibility={[
        'Full keyboard navigation with Enter and Space keys',
        'Screen reader support with proper ARIA attributes',
        'Disabled state is properly announced',
        'Visible focus indicator for keyboard users',
      ]}
    >
      <DemoCard
        title="Playground"
        preview={
          <div className="w-full max-w-sm space-y-4">
            <div className="flex gap-4 items-center">
              <Button variant={variant} size={size}>
                {size === 'icon' ? '→' : 'Click me'}
              </Button>
            </div>
            <div>
              <label htmlFor="button-variant" className="text-sm font-medium mb-2 block">Variant</label>
              <select
                id="button-variant"
                value={variant}
                onChange={(e) => setVariant(e.target.value as ButtonVariant)}
                className="w-full p-2 border rounded bg-background"
              >
                {VARIANTS.map((v) => (
                  <option key={v} value={v}>{variantLabel(v)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="button-size" className="text-sm font-medium mb-2 block">Size</label>
              <select
                id="button-size"
                value={size}
                onChange={(e) => setSize(e.target.value as ButtonSize)}
                className="w-full p-2 border rounded bg-background"
              >
                <option value="default">default</option>
                <option value="sm">sm</option>
                <option value="lg">lg</option>
                <option value="icon">icon</option>
              </select>
            </div>
          </div>
        }
        code={`import { Button } from '@slipstream-ui/core'

<Button>Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>`}
      />

      <DemoCard
        title="All variants"
        preview={
          <div className="w-full space-y-3">
            {VARIANTS.map((v) => (
              <div key={v} className="flex flex-wrap items-center gap-3">
                <span className="w-24 shrink-0 font-mono text-xs text-muted-foreground">{v}</span>
                <Button variant={v}>{v === 'link' ? 'Learn more' : 'Continue'}</Button>
                <Button variant={v} disabled>{v === 'link' ? 'Learn more' : 'Continue'}</Button>
              </div>
            ))}
          </div>
        }
        code={`import { Button } from '@slipstream-ui/core'

${variantCode}

// Every variant also renders a disabled state
<Button variant="destructive" disabled>Delete</Button>`}
      />

      <DemoCard
        title="Sizes"
        preview={
          <div className="flex flex-wrap items-center gap-4">
            {SIZES.map((s) => (
              <Button key={s} size={s}>{s === 'default' ? 'Default' : s.toUpperCase()}</Button>
            ))}
            <Button size="icon" aria-label="Open">→</Button>
            <Button size="icon" variant="outline" aria-label="Settings">⚙</Button>
            <Button size="sm" variant="destructive">sm destructive</Button>
            <Button size="lg" variant="secondary">lg secondary</Button>
          </div>
        }
        code={`import { Button } from '@slipstream-ui/core'

<Button size="sm">SM</Button>
<Button size="default">Default</Button>
<Button size="lg">LG</Button>

{/* Icon buttons need an accessible name */}
<Button size="icon" aria-label="Open">→</Button>
<Button size="icon" variant="outline" aria-label="Settings">⚙</Button>`}
      />

      <DemoCard
        title="On dark surfaces"
        preview={
          <div className="w-full rounded-xl bg-slate-900 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="contrast">Get started</Button>
              <Button variant="onDark">Learn more</Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Ghost</Button>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              contrast and onDark keep fixed ink/white colors in both themes — use them on always-dark hero surfaces.
            </p>
          </div>
        }
        code={`import { Button } from '@slipstream-ui/core'

{/* Always-dark surface (e.g. a hero band): fixed-ink variants stay legible
    in light and dark mode, unlike theme-aware fills. */}
<div className="rounded-xl bg-slate-900 p-6">
  <Button variant="contrast">Get started</Button>
  <Button variant="onDark">Learn more</Button>
</div>`}
      />

      <DemoCard
        title="As a link"
        preview={
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <a href="#button-docs">I render an &lt;a&gt;</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#button-docs">Outline link</a>
            </Button>
          </div>
        }
        code={`import { Button } from '@slipstream-ui/core';

{/* asChild keeps button styling but renders the child element,
    ideal for Next.js <Link> or plain anchors. */}
<Button asChild>
  <a href="/docs">Read the docs</a>
</Button>`}
      />
    </ComponentPage>
  );
}
