import type { SearchEntry } from './search-index';

/**
 * Ranked search over the docs index.
 *
 * Kept as a pure function so the palette, tests, and any future search route
 * share exactly the same matching rules. Terms are ANDed; alias hits rank with
 * the title rather than the body so natural-language queries work.
 */
export function filterSearch(entries: SearchEntry[], query: string, limit = 10, browseLimit = 8): SearchEntry[] {
  const trimmed = query.trim();
  if (!trimmed) return entries.slice(0, browseLimit);

  const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const scored: { entry: SearchEntry; score: number }[] = [];

  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    const content = entry.content.toLowerCase();
    const aliases = (entry.aliases ?? []).join(' ').toLowerCase();
    let score = 0;
    let matchedAll = true;

    for (const term of terms) {
      if (title === term) score += 0;
      else if (title.startsWith(term)) score += 1;
      else if (title.includes(term)) score += 2;
      else if (aliases.includes(term)) score += 2;
      else if (content.includes(term)) score += 3;
      else {
        matchedAll = false;
        break;
      }
    }
    if (matchedAll) scored.push({ entry, score });
  }

  // Stable sort: equal scores keep nav-index order.
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, limit).map((item) => item.entry);
}
