'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';

const MILESTONES = [25, 50, 75, 100] as const;

/**
 * Fires `article_scroll` once per depth milestone as the reader scrolls
 * through the article body. Consent-gated via track(); a no-op without
 * analytics consent, so no extra gating is needed here.
 */
export function ArticleEngagement({ slug }: { slug: string }) {
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;
    articleRef.current = article;

    const fired = new Set<number>();
    let raf = 0;

    function depth(): number {
      const el = articleRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return 100;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      return Math.round((scrolled / total) * 100);
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const pct = depth();
        for (const milestone of MILESTONES) {
          if (pct >= milestone && !fired.has(milestone)) {
            fired.add(milestone);
            track('article_scroll', { slug, depth: milestone });
          }
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [slug]);

  return null;
}
