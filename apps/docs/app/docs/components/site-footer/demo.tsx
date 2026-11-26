'use client';

import { Link, SiteFooter } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Standard footer"
        preview={
          <div className="w-full overflow-hidden rounded-xl border border-border">
            <SiteFooter
              brand={<span className="text-base font-bold">Example</span>}
              tagline="Ship UI your AI understands."
              columns={[
                { title: 'Product', links: [{ label: 'Docs', href: '/docs' }, { label: 'Components', href: '/docs/components' }, { label: 'Templates', href: '/docs/templates' }] },
                { title: 'Resources', links: [{ label: 'Changelog', href: '/changelog' }, { label: 'GitHub', href: 'https://example.com', external: true }] },
                { title: 'Legal', links: [{ label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Contact', href: '/contact' }] },
              ]}
              activeHref="/docs/components"
              legal={
                <span className="flex flex-wrap items-center gap-3">
                  <span>© 2026 Example</span>
                  <Link href="/privacy" variant="muted" className="text-xs">
                    Privacy
                  </Link>
                </span>
              }
            />
          </div>
        }
        code={`<SiteFooter
  brand={<strong>Example</strong>}
  tagline="Ship UI your AI understands."
  columns={[
    { title: 'Product', links: [{ label: 'Docs', href: '/docs' }] },
    { title: 'Legal', links: [{ label: 'Privacy', href: '/privacy' }] },
  ]}
  legal={<span>© 2026 Example</span>}
/>`}
        usage={`// Keep each destination in exactly one column; use legal for the bottom row.`}
        types={`type SiteFooterProps = {
  brand?: React.ReactNode;
  tagline?: string;
  columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[];
  legal?: React.ReactNode;
  linkComponent?: React.ElementType;
  linkHrefProp?: 'href' | 'to';
  activeHref?: string;
  match?: 'prefix' | 'exact';
};`}
      />
    </>
  );
}
