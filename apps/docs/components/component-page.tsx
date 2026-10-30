import Link from 'next/link';
import { InstallBox } from './install-box';
import { PropsTable } from './props-table';
import { getNeighbors } from '@/lib/nav';

export interface ComponentPageProps {
  /** Kebab-case registry/CLI id, e.g. "prompt-input". */
  id: string;
  title: string;
  description: string;
  /** npm packages for the pnpm tab; defaults to core + ai. */
  npmPackages?: string;
  children: React.ReactNode;
  propsRows?: { name: string; type: string; defaultValue?: string; description: string }[];
  accessibility?: string[];
}

/**
 * Standardized component docs scaffold (elements.ai-sdk.dev pattern):
 * title → lede → installer box → demos (children: DemoCards) →
 * props table → accessibility notes → prev/next pagination.
 */
export function ComponentPage({
  id,
  title,
  description,
  npmPackages,
  children,
  propsRows,
  accessibility,
}: ComponentPageProps) {
  const { previous, next } = getNeighbors(`/docs/components/${id}`);

  return (
    <article>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">{title}</h1>
        {/* Canonical markdown for agents — mirrors assistant-ui's .md convention. */}
        <a
          href={`/llm/components/${id}.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex h-7 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={`Canonical markdown reference at /llm/components/${id}.md`}
        >
          <span aria-hidden="true">⧉</span> Markdown for agents
        </a>
      </div>
      <p className="mt-2 text-lg text-muted-foreground">{description}</p>

      <div className="mt-6">
        <InstallBox componentId={id} npmPackages={npmPackages} />
      </div>

      <div className="mt-8 space-y-6">{children}</div>

      {propsRows && propsRows.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Props</h2>
          <PropsTable rows={propsRows} />
        </section>
      )}

      {accessibility && accessibility.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Accessibility</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {accessibility.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label="Pagination" className="mt-14 flex items-stretch justify-between gap-4 border-t border-border pt-6">
        {previous ? (
          <Link
            href={previous.href}
            className="group flex-1 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
          >
            <span className="block text-xs text-muted-foreground">← Previous</span>
            <span className="text-sm font-medium group-hover:text-primary">{previous.label}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={next.href}
            className="group flex-1 rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted"
          >
            <span className="block text-xs text-muted-foreground">Next →</span>
            <span className="text-sm font-medium group-hover:text-primary">{next.label}</span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </article>
  );
}
