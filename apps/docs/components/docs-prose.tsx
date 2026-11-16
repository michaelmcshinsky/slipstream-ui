import { Fragment } from 'react';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';
import type { ProseBlock, ProsePart } from '@/lib/docs-copy';

type Vars = Record<string, string | number>;

/** Fills `{count}`-style placeholders with generated values. */
function fill(text: string, vars: Vars): string {
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    vars[name] === undefined ? match : String(vars[name])
  );
}

function Part({ part, vars }: { part: ProsePart; vars: Vars }) {
  if (typeof part === 'string') return <>{fill(part, vars)}</>;
  if ('code' in part) {
    return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{part.code}</code>;
  }
  if ('strong' in part) return <strong className="text-foreground">{part.strong}</strong>;
  if ('em' in part) return <em>{part.em}</em>;
  return (
    <Link
      href={part.link.href}
      className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
    >
      {part.link.text}
    </Link>
  );
}

function Parts({ parts, vars }: { parts: ProsePart[]; vars: Vars }) {
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          <Part part={part} vars={vars} />
        </Fragment>
      ))}
    </>
  );
}

/** Inline prose for page banners and leads, outside the block list. */
export function DocsProseInline({ parts, vars = {} }: { parts: ProsePart[]; vars?: Vars }) {
  return <Parts parts={parts} vars={vars} />;
}

/**
 * Renders a translated docs page body. Keeps the docs typography local so
 * every locale shares one layout instead of forking the page component.
 */
export function DocsProse({ blocks, vars = {} }: { blocks: ProseBlock[]; vars?: Vars }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'h2':
            return (
              <h2
                key={index}
                className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight"
              >
                {block.text}
              </h2>
            );
          case 'p':
            return (
              <p key={index} className="mt-3 leading-relaxed text-muted-foreground">
                <Parts parts={block.parts} vars={vars} />
              </p>
            );
          case 'ul':
            return (
              <ul
                key={index}
                className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground"
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Parts parts={item} vars={vars} />
                  </li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={index} className="mt-4 space-y-3 text-muted-foreground">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Parts parts={item} vars={vars} />
                  </li>
                ))}
              </ol>
            );
          case 'code':
            return (
              <div key={index} className="mt-4">
                <CodeBlock language={block.language} code={block.code} />
              </div>
            );
          case 'cards':
            return (
              <div key={index} className="mt-5 grid gap-4 sm:grid-cols-2">
                {block.items.map((card) => (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-sm"
                  >
                    {card.index && (
                      <div
                        aria-hidden="true"
                        className="mb-2 font-mono text-sm text-muted-foreground"
                      >
                        {card.index}
                      </div>
                    )}
                    <h3 className="font-semibold group-hover:text-primary">{card.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{fill(card.body, vars)}</p>
                  </Link>
                ))}
              </div>
            );
          case 'chips':
            return (
              <div key={index} className="mt-8 flex flex-wrap gap-3 text-sm">
                {block.items.map((chip) => (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted"
                  >
                    {chip.text}
                  </Link>
                ))}
              </div>
            );
          case 'callouts':
            return (
              <div key={index} className="mt-4 space-y-4">
                {block.items.map((callout) => (
                  <div key={callout.title} className="rounded-xl border border-border bg-card p-4">
                    <p className="font-medium">{callout.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {fill(callout.body, vars)}
                    </p>
                  </div>
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
