import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/table', {
  title: "Table",
  description: "Semantic data table with headers, body, footer, and accessible caption.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('table')}
      id="table"
      title="Table"
      description="Semantic data table with header, body and footer sections, row hover/selection states, and an accessible caption. Compose with the Table* subcomponents."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'children', type: 'ReactNode', description: 'TableHeader, TableBody, TableFooter, TableRow and TableCaption children.' },
        { name: 'className', type: 'string', description: 'Escape hatch on the <table> element; all native table attributes are forwarded.' },
        { name: 'TableHeader', type: 'section props', description: 'Groups header row(s); renders <thead> with a bottom border on each row.' },
        { name: 'TableBody', type: 'section props', description: 'Groups body row(s); renders <tbody> and removes the last row border.' },
        { name: 'TableFooter', type: 'section props', description: 'Summary row(s); renders <tfoot> with a muted background and top border.' },
        { name: 'TableRow', type: 'row props', description: 'A row with border-b, hover:bg-muted/50 and data-[state=selected] highlighting; className passthrough.' },
        { name: 'TableHead', type: 'cell props', description: 'Header cell; defaults scope="col" (pass scope="row" for row headers) with uppercase muted styling.' },
        { name: 'TableCell', type: 'cell props', description: 'Data cell (px-3 py-2); use className for alignment such as text-right.' },
        { name: 'TableCaption', type: 'caption props', description: 'Accessible <caption> describing the table contents; rendered below the table in muted text.' },
      ]}
      accessibility={[
        'Native table semantics with scope attributes on headers (TableHead defaults scope="col").',
        'TableCaption describes the table contents for screen readers.',
        'TableRow supports data-state="selected" for row-selection styling.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
