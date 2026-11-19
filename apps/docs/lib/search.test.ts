import { describe, expect, it } from 'vitest';
import { SEARCH_INDEX } from './search-index';
import { filterSearch } from './search';

describe('filterSearch', () => {
  it('returns a short browse list when the query is empty', () => {
    expect(filterSearch(SEARCH_INDEX, '')).toEqual(SEARCH_INDEX.slice(0, 8));
    expect(filterSearch(SEARCH_INDEX, '   ')).toEqual(SEARCH_INDEX.slice(0, 8));
  });

  it('finds components from natural-language aliases', () => {
    expect(filterSearch(SEARCH_INDEX, 'ai typing indicator')[0]?.title).toBe('StreamingIndicator');
    expect(filterSearch(SEARCH_INDEX, 'ask user before running tool')[0]?.title).toBe('Confirmation');
    expect(filterSearch(SEARCH_INDEX, 'dark mode').map((entry) => entry.title)).toContain('ThemeToggle');
  });

  it('finds a composed recipe such as a filtered table', () => {
    const titles = filterSearch(SEARCH_INDEX, 'table with filters').map((entry) => entry.title);
    expect(titles).toContain('DataTable');
  });

  it('is case-insensitive and ANDs every term', () => {
    expect(filterSearch(SEARCH_INDEX, 'PROMPT INPUT').map((entry) => entry.title)).toContain('PromptInput');
    expect(filterSearch(SEARCH_INDEX, 'prompt nonexistentterm')).toEqual([]);
  });

  it('ranks a title match above a body-only match', () => {
    const results = filterSearch(SEARCH_INDEX, 'button');
    expect(results[0]?.title).toBe('Button');
  });

  it('respects the result limit', () => {
    expect(filterSearch(SEARCH_INDEX, 'component', 3).length).toBeLessThanOrEqual(3);
  });
});
