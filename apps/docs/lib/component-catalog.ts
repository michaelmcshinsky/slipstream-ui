export type CatalogItem = {
  label: string;
  href: string;
  tier?: string;
  description?: string;
};

export type CatalogGroup = {
  title: string;
  items: CatalogItem[];
};

/**
 * Pure catalog filtering shared by the component index and its tests.
 * All query terms must match somewhere in the card or its group title.
 */
export function filterCatalog(groups: CatalogGroup[], query: string, category: string): CatalogGroup[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return groups
    .filter((group) => category === 'all' || group.title === category)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (terms.length === 0) return true;
        const haystack = `${item.label} ${item.tier ?? ''} ${item.description ?? ''} ${group.title}`.toLowerCase();
        return terms.every((term) => haystack.includes(term));
      }),
    }))
    .filter((group) => group.items.length > 0);
}

export function countCatalog(groups: CatalogGroup[]): number {
  return groups.reduce((sum, group) => sum + group.items.length, 0);
}
