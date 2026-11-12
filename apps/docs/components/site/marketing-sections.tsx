import Link from 'next/link';
import type { ReactNode } from 'react';
import type { MarketingSection, RichBlock } from '@/lib/marketing';

const TOKEN = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g;

/** Replaces `{name}` placeholders with the supplied values. */
export function fillVars(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

const linkClass = 'text-primary underline underline-offset-2 hover:text-primary/80';

/**
 * Renders a small, translation-friendly subset of inline markup:
 * `[label](href)` links, `` `code` `` spans and `**bold**` emphasis.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((part) => part.length > 0);
  return (
    <>
      {parts.map((part, index) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          const [, label, href] = link;
          const external = /^https?:/.test(href) || href.startsWith('/.');
          const anchor = (
            <a
              key={index}
              href={href}
              className={linkClass}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {label}
            </a>
          );
          return href.startsWith('/') && !href.startsWith('/.') ? (
            <Link key={index} href={href} className={linkClass}>
              {label}
            </Link>
          ) : (
            anchor
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function Block({ block, vars }: { block: RichBlock; vars: Record<string, string | number> }) {
  if (block.type === 'ul') {
    return (
      <ul className="list-disc space-y-1 pl-6">
        {block.items.map((item) => (
          <li key={item}>
            <RichText text={fillVars(item, vars)} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === 'code') {
    return (
      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs">
        <code>{block.text}</code>
      </pre>
    );
  }
  return (
    <p>
      <RichText text={fillVars(block.text, vars)} />
    </p>
  );
}

/** Renders the section model used by the legal and about pages. */
export function MarketingSections({
  sections,
  vars,
}: {
  sections: MarketingSection[];
  vars: Record<string, string | number>;
}): ReactNode {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">{section.heading}</h2>
          {section.blocks.map((block, index) => (
            <Block key={`${section.heading}-${index}`} block={block} vars={vars} />
          ))}
        </section>
      ))}
    </>
  );
}
