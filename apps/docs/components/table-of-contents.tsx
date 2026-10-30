'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * Sticky right-sidebar table of contents. Scans the main content area for
 * h2/h3 headings and highlights the section currently in view using
 * IntersectionObserver. Hidden on screens where there is no room.
 */
export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Collect h2/h3 headings that have ids (or generate slugs).
    const main = document.querySelector('main article, main');
    if (!main) return;

    const elements = Array.from(main.querySelectorAll('h2, h3'));
    const collected: Heading[] = elements.map((el) => {
      let id = el.id;
      if (!id) {
        id = el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') ?? '';
        el.id = id;
      }
      return { id, text: el.textContent ?? '', level: el.tagName === 'H2' ? 2 : 3 };
    });
    setHeadings(collected);

    // Track which heading is currently in view.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside
      aria-label="On this page"
      className="sticky top-20 hidden h-[calc(100vh-6rem)] w-48 flex-shrink-0 overflow-y-auto py-8 xl:block"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <nav>
        <ul className="space-y-1 border-l border-border">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block border-l-2 py-1 text-xs leading-relaxed transition-colors ${
                  heading.level === 3 ? 'pl-6' : 'pl-3'
                } ${
                  activeId === heading.id
                    ? 'border-primary font-medium text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
