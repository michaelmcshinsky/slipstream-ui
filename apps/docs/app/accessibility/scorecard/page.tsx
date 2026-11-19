import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/site/navbar';
import { MobileNav } from '@/components/site/mobile-nav';
import { Footer } from '@/components/site/footer';
import { JsonLd } from '@/components/site/json-ld';
import { ACCESSIBILITY_SCORECARD } from '@/lib/a11y-scorecard.generated';
import { webPageSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';

const description =
  'Per-component accessibility evidence for Slipstream UI: which components have axe assertions, interaction tests and manifest accessibility requirements, with links to each contract.';

export const metadata: Metadata = withSeo('/accessibility/scorecard', {
  title: 'Component accessibility scorecard',
  description,
});

export default function AccessibilityScorecardPage() {
  const { rows, summary } = ACCESSIBILITY_SCORECARD;
  const stats = [
    { label: 'Components', value: summary.total },
    { label: 'With axe assertion', value: summary.withAxe },
    { label: 'With interaction tests', value: summary.withInteraction },
    { label: 'Manifest requirements', value: summary.totalNotes },
  ];

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={webPageSchema({
          type: 'WebPage',
          name: 'Component accessibility scorecard',
          description,
          path: '/accessibility/scorecard',
        })}
      />
      <Navbar />
      <div className="px-4">
        <MobileNav />
      </div>
      <main id="main" className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <Link href="/accessibility" className="text-sm text-muted-foreground hover:text-foreground">
            ← Accessibility statement
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Component accessibility scorecard</h1>
          <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{description}</p>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            This is automated evidence, not a WCAG certification. A component can pass axe and still fail in real
            use; the <Link href="/accessibility" className="font-medium text-primary hover:underline">accessibility statement</Link>{' '}
            lists the manual work that remains.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                <dd className="text-2xl font-bold text-primary">{stat.value}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-10 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <caption className="sr-only">Accessibility evidence for every component</caption>
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="p-3 text-left font-medium">Component</th>
                  <th scope="col" className="p-3 text-left font-medium">Package</th>
                  <th scope="col" className="p-3 text-center font-medium">axe</th>
                  <th scope="col" className="p-3 text-center font-medium">Interaction tests</th>
                  <th scope="col" className="p-3 text-center font-medium">Manifest notes</th>
                  <th scope="col" className="p-3 text-left font-medium">Reference</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-t border-border align-top">
                    <td className="p-3 font-medium">{row.name}</td>
                    <td className="whitespace-nowrap p-3 font-mono text-xs text-muted-foreground">
                      {row.package.replace('@slipstream-ui/', '')}
                    </td>
                    <td className="p-3 text-center">
                      <span className={row.axe ? 'text-success' : 'text-destructive'}>
                        {row.axe ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-3 text-center text-muted-foreground">{row.interaction ? 'Yes' : '—'}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.notes}</td>
                    <td className="whitespace-nowrap p-3 text-xs">
                      <Link href={row.docs} className="font-medium text-primary hover:underline">
                        Docs
                      </Link>
                      {' · '}
                      <a href={row.manifest} className="text-muted-foreground hover:text-foreground hover:underline">
                        Manifest
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            axe assertions run in CI on every component. Interaction tests are counted when the colocated suite exercises
            keyboard, focus or key handling. The manifest column counts accessibility requirements declared in the
            component contract.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
