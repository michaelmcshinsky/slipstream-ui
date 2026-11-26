import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/pagination', {
  title: "Pagination",
  description: "Numeric pagination with prev/next, ellipsis, and aria-current on the active page.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('pagination')}
      id="pagination"
      title="Pagination"
      description="Numeric pagination with prev/next, ellipsis, and aria-current on the active page."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'page', type: 'number', defaultValue: '1', description: 'Current page (1-based). Alias: currentPage.' },
        { name: 'pageCount', type: 'number', description: 'Total pages. Alias: totalPages, or derived from total/pageSize.' },
        { name: 'currentPage / totalPages', type: 'number', description: 'Migration-friendly aliases for page / pageCount.' },
        { name: 'pageSize + total', type: 'number', description: 'Derives pageCount and renders "Showing 26–50 of 312 students".' },
        { name: 'itemLabel', type: 'string', defaultValue: "'items'", description: 'Noun used in the summary.' },
        { name: 'showSummary', type: 'boolean', description: 'Force the summary on/off (default: on when total and pageSize are set).' },
        { name: 'onPageChange', type: '(page: number) => void', description: 'Called with the new page number.' },
        { name: 'siblings', type: 'number', defaultValue: '1', description: 'How many page buttons to show around the current page.' },
        { name: 'showBoundaries', type: 'boolean', defaultValue: 'false', description: 'Adds « and » buttons that jump to the first/last page.' },
        { name: 'showFirst / showLast', type: 'boolean', defaultValue: 'showBoundaries', description: 'Show or hide each boundary button independently (e.g. hide « once you are on page 1 instead of disabling it).' },
        { name: 'icons', type: '{ first?, previous?, next?, last? }', description: 'Replace the default ‹ › « » glyphs with your own markup.' },
        { name: 'pageHrefs', type: 'Record<number, string>', description: 'Page-number → href map; renders links for server-rendered pagination.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Router link element used with pageHrefs.' },
        { name: 'linkHrefProp', type: "'href' | 'to'", defaultValue: "'href'", description: 'Prop used to pass the destination to linkComponent.' },
        { name: 'labels', type: '{ pagination?, first?, previous?, next?, last?, page? }', description: 'Localized landmark and control labels.' },
      ]}
      accessibility={[
        'nav[aria-label=Pagination] landmark.',
        'Active button has aria-current=page; disabled buttons at boundaries.',
        'Boundary buttons expose First page / Last page labels.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
