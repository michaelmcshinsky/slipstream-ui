import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { SITE } from '@/lib/site';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/terms', {
  title: 'Terms of use',
  description:
    'Terms for using the Slipstream UI website and packages: MIT license, no warranty, acceptable use, and how to contact us.',
  alternates: { canonical: '/terms' },
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: 'TermsOfService',
          name: 'Terms of use',
          description:
            'Terms for using the Slipstream UI website and packages: MIT license, no warranty, acceptable use, and how to contact us.',
          path: '/terms',
        })}
      />
      <MarketingPage
      title="Terms of use"
      description="Plain-language terms for this site and the Slipstream UI packages."
      updated="November 2026"
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">The software</h2>
        <p>
          Slipstream UI packages are released under the{' '}
          <a className="text-primary underline underline-offset-2 hover:text-primary/80" href={`${SITE.repo}/blob/main/LICENSE`}>
            MIT license
          </a>
          . You may use, modify and redistribute them commercially, provided the copyright notice and permission notice
          are included. The license text controls if it conflicts with this page.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">No warranty</h2>
        <p>
          The site, documentation, manifests, MCP tooling and packages are provided <strong className="text-foreground">“as
          is”</strong>, without warranty of any kind, express or implied, including fitness for a particular purpose.
          You are responsible for reviewing generated code and for your own product decisions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Acceptable use</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Do not use the site to break the law, infringe rights, or distribute malware.</li>
          <li>Do not attempt to disrupt or overload the hosting infrastructure.</li>
          <li>Do not misrepresent modified versions of the packages as official releases.</li>
          <li>Rate limits and fair-use expectations apply to any hosted endpoints.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, the maintainers are not liable for indirect, incidental or
          consequential damages, or for lost profits or data, arising from use of the site or packages.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Third-party links and services</h2>
        <p>
          The site links to GitHub, npm and other third-party services. Their terms and privacy policies apply to your
          use of those services.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Changes</h2>
        <p>
          We may update these terms; the “last updated” date changes accordingly. Continued use after an update means
          you accept the revised terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <p>
          Questions about these terms:{' '}
          <a className="text-primary underline underline-offset-2 hover:text-primary/80" href={`mailto:${SITE.contact.email}`}>
            {SITE.contact.email}
          </a>
          . See also the{' '}
          <Link href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
            privacy policy
          </Link>
          .
        </p>
      </section>
    </MarketingPage>
    </>
  );
}
