'use client';

import { Prose } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ProsePage() {
  return (
    <ComponentPage
      id="prose"
      title="Prose"
      description="Self-contained long-form typography for rendered markdown/MDX: headings, links, lists, code, tables, quotes and figures."
      npmPackages="@slipstream-ui/core"
      propsRows={[{ name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Type scale for body and headings.' }]}
      accessibility={['Heading anchors carry scroll-mt offsets for sticky headers.', 'Links keep the primary color and underline for recognition.']}
    >
      <DemoCard
        title="Article body"
        preview={
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6">
            <Prose>
              <h2>Install the package</h2>
              <p>Add the core package, then wrap your app in the theme provider. See the <a href="/docs/theming">theming guide</a>.</p>
              <pre><code>pnpm add @slipstream-ui/core</code></pre>
              <ul><li>Stateless components</li><li>Machine-readable manifests</li></ul>
              <blockquote>Your AI reads the spec, not the source.</blockquote>
            </Prose>
          </div>
        }
        code={`import { Prose } from '@slipstream-ui/core';

<Prose size="md">{renderedMarkdown}</Prose>`}
        usage={`// Drop any remark/MDX output inside. No @tailwindcss/typography dependency;
// keep Shiki/KaTeX/Mermaid as-is. Pair long articles with TableOfContents.`}
        types={`type ProseProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: 'sm' | 'md' | 'lg';
};`}
      />
    </ComponentPage>
  );
}
