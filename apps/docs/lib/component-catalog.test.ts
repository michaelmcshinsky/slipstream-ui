import { describe, expect, it } from 'vitest';
import { countCatalog, filterCatalog, type CatalogGroup } from './component-catalog';

const groups: CatalogGroup[] = [
  {
    title: 'Actions',
    items: [
      { label: 'Button', href: '/docs/components/button', tier: 'atom', description: 'Clickable action' },
      { label: 'CommandPalette', href: '/docs/components/command-palette', tier: 'molecule', description: 'Keyboard search' },
    ],
  },
  {
    title: 'AI chat',
    items: [
      {
        label: 'StreamingIndicator',
        href: '/docs/components/streaming-indicator',
        tier: 'atom',
        description: 'Generating dots',
      },
    ],
  },
];

describe('filterCatalog', () => {
  it('returns every group for an empty query and the all category', () => {
    const result = filterCatalog(groups, '', 'all');
    expect(countCatalog(result)).toBe(3);
    expect(result.map((group) => group.title)).toEqual(['Actions', 'AI chat']);
  });

  it('filters by label, description and category title', () => {
    expect(filterCatalog(groups, 'streaming', 'all')[0]?.items[0]?.label).toBe('StreamingIndicator');
    expect(filterCatalog(groups, 'clickable', 'all')[0]?.items[0]?.label).toBe('Button');
    expect(filterCatalog(groups, 'ai', 'all')[0]?.title).toBe('AI chat');
  });

  it('ANDs terms and is case-insensitive', () => {
    expect(countCatalog(filterCatalog(groups, 'KEYBOARD SEARCH', 'all'))).toBe(1);
    expect(countCatalog(filterCatalog(groups, 'keyboard button', 'all'))).toBe(0);
  });

  it('honours the category chip', () => {
    expect(countCatalog(filterCatalog(groups, '', 'Actions'))).toBe(2);
    expect(countCatalog(filterCatalog(groups, '', 'AI chat'))).toBe(1);
  });

  it('drops groups that have no matching items', () => {
    const result = filterCatalog(groups, 'streaming', 'all');
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe('AI chat');
  });

  it('returns an empty list for an unmatched query', () => {
    expect(filterCatalog(groups, 'zzz-no-match', 'all')).toEqual([]);
    expect(countCatalog([])).toBe(0);
  });
});
