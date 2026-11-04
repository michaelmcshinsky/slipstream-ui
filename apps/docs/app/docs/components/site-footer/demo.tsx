'use client';

import { Link, SiteFooter } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function SiteFooterPage() {
  return (
    <ComponentPage
      id="site-footer"
      title="SiteFooter"
      description="Marketing footer: brand + tagline column, link columns and a legal bar; router-agnostic via linkComponent."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'brand', type: 'ReactNode', description: 'Brand slot.' },
        { name: 'tagline', type: 'string', description: 'Short line under the brand.' },
        { name: 'columns', type: 'SiteFooterColumn[]', defaultValue: 'required', description: 'Link columns: { title, links: { label, href, external? }[] }.' },
        { name: 'legal', type: 'ReactNode', description: 'Bottom bar (copyright, legal links).' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Router link element.' },
      ]}
      accessibility={['Renders a <footer> landmark with headed link groups.', 'External links get target=_blank + rel=noopener.']}
    >
      <DemoCard
        title="Standard footer"
        preview={
          <div className="w-full overflow-hidden rounded-xl border border-border">
            <SiteFooter
              brand={<span className="text-base font-bold">Acme</span>}
              tagline="Ship UI your AI understands."
              columns={[
                { title: 'Product', links: [{ label: 'Docs', href: '/docs' }, { label: 'Components', href: '/docs/components' }, { label: 'Templates', href: '/docs/templates' }] },
                { title: 'Resources', links: [{ label: 'Changelog', href: '/changelog' }, { label: 'GitHub', href: 'https://github.com/michaelmcshinsky/slipstream-ui', external: true }] },
                { title: 'Legal', links: [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Contact', href: '/contact' }] },
              ]}
              legal={
                <span className="flex flex-wrap items-center gap-3">
                  <span>© 2026 Acme</span>
                  <Link href="/privacy" variant="muted" className="text-xs">
                    Privacy
                  </Link>
                </span>
              }
            />
          </div>
        }
        code={`<SiteFooter
  brand={<strong>Acme</strong>}
  tagline="Ship UI your AI understands."
  columns={[
    { title: 'Product', links: [{ label: 'Docs', href: '/docs' }] },
    { title: 'Legal', links: [{ label: 'Privacy', href: '/privacy' }] },
  ]}
  legal={<span>© 2026 Acme</span>}
/>`}
        usage={`// Keep each destination in exactly one column; use legal for the bottom row.`}
        types={`type SiteFooterProps = {
  brand?: React.ReactNode;
  tagline?: string;
  columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[];
  legal?: React.ReactNode;
  linkComponent?: React.ElementType;
};`}
      />
    </ComponentPage>
  );
}
