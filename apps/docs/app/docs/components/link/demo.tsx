'use client';

import { Link } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function LinkPage() {
  return (
    <ComponentPage
      id="link"
      title="Link"
      description="Inline link primitive with default/muted/underline/arrow/external variants, asChild router support and safe external handling."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'href', type: 'string', description: 'Destination URL (or pass it on the asChild element).' },
        { name: 'variant', type: "'default' | 'muted' | 'underline' | 'arrow' | 'external'", defaultValue: "'default'", description: 'Visual style.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Render the child (router Link) with link styling.' },
        { name: 'external', type: 'boolean', description: 'Force external handling. Absolute http(s) URLs are auto-detected; mailto/tel never open a new tab.' },
      ]}
      accessibility={[
        'Renders a real <a href>, so middle-click and modified clicks behave like the platform.',
        'External links get rel="noopener noreferrer" and an sr-only “opens in a new tab” note.',
        'Focus ring is visible on keyboard focus.',
      ]}
    >
      <DemoCard
        title="Variants"
        preview={
          <div className="flex w-full max-w-xl flex-col gap-3 text-sm">
            <p>
              Default: <Link href="/docs">read the docs</Link> · muted:{' '}
              <Link href="/changelog" variant="muted">changelog</Link> · underline:{' '}
              <Link href="/privacy" variant="underline">privacy</Link>
            </p>
            <p>
              Arrow: <Link href="/docs/components" variant="arrow">browse components →</Link>
            </p>
            <p>
              External (auto): <Link href="https://example.com">GitHub</Link>
            </p>
          </div>
        }
        code={`<Link href="/docs">Read the docs</Link>
<Link href="/changelog" variant="muted">Changelog</Link>
<Link href="/privacy" variant="underline">Privacy</Link>
<Link href="/docs/components" variant="arrow">Browse components →</Link>
<Link href="https://example.com">GitHub</Link>`}
        usage={`// Absolute http(s) links automatically open in a new tab with
// rel="noopener noreferrer" plus a screen-reader note. mailto:/tel: never do.

// Router links: keep your router's <Link> and style it with asChild
<Link asChild variant="underline"><RouterLink href="/posts">Posts</RouterLink></Link>`}
        types={`type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'default' | 'muted' | 'underline' | 'arrow' | 'external';
  asChild?: boolean;
  external?: boolean;
};`}
      />
    </ComponentPage>
  );
}
