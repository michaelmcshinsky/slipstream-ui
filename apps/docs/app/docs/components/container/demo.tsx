'use client';

import { Container } from '@slipstream-ui/core';
import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ContainerPage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
  return (
    <ComponentPage
        manifest={manifest}
      id="container"
      title="Container"
      description="Centered, width-constrained page container with shared gutters and four width presets."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'width', type: "'sm' | 'md' | 'lg' | 'xl' | 'full'", defaultValue: "'lg'", description: 'Maximum content width.' },
        { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Horizontal gutters.' },
        { name: 'as', type: "'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav'", defaultValue: "'div'", description: 'Semantic element to render.' },
      ]}
      accessibility={['Use the as prop for landmarks and add an accessible name when the container is a named region.']}
    >
      <DemoCard
        title="Shared page width"
        preview={
          <div className="w-full rounded-lg border border-dashed border-border p-3">
            <Container width="md" className="rounded-md border border-border bg-muted/40 p-5">
              <p className="text-sm font-medium">Centered content</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The same max-width and gutters on every page keep headers and sections aligned.
              </p>
            </Container>
          </div>
        }
        code={`<Container width="md" padding="lg">
  <PageHeader title="Projects" description="Manage your workspace." />
</Container>`}
        usage={`// Width: sm (48rem) | md (64rem) | lg (80rem) | xl (1400px) | full
// Padding: none | sm (px-4) | md (px-4 sm:px-6) | lg (+ lg:px-8)
// Section renders a Container internally; use Container directly for custom chrome.`}
        types={`type ContainerProps = {
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav';
};`}
      />
      <DemoCard
        title="Width scale"
        preview={
          <div className="w-full space-y-2">
            {(['sm', 'md', 'lg', 'xl', 'full'] as const).map((w) => (
              <Container key={w} width={w} className="rounded border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground">
                width=&quot;{w}&quot;
              </Container>
            ))}
          </div>
        }
        code={`<Container width="sm">…</Container>   {/* max-w-3xl */}
<Container width="md">…</Container>   {/* max-w-5xl, default */}
<Container width="lg">…</Container>   {/* max-w-7xl */}
<Container width="xl">…</Container>   {/* max-w-[1400px] */}
<Container width="full">…</Container> {/* edge to edge */}`}
        usage={`// sm→xl step the max-width up; full removes the cap entirely.
// padding is independent: none | sm | md | lg.`}
      />
    </ComponentPage>
  );
}
