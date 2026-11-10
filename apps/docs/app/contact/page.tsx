import type { Metadata } from 'next';
import { MarketingPage } from '@/components/site/marketing-page';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { SITE } from '@/lib/site';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/contact', {
  title: 'Contact',
  description:
    'Get in touch with the Slipstream UI maintainers: email, postal address, GitHub issues, and a contact form for anything else.',
  alternates: { canonical: '/contact' },
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: 'ContactPage',
          name: 'Contact Slipstream UI',
          description:
            'Get in touch with the Slipstream UI maintainers: email, postal address, GitHub issues, and a contact form for anything else.',
          path: '/contact',
        })}
      />
      <MarketingPage
      title="Contact"
      description={SITE.contact.hours}
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Email</h2>
          <p>
            <a className="text-primary underline underline-offset-2 hover:text-primary/80" href={`mailto:${SITE.contact.email}`}>
              {SITE.contact.email}
            </a>
          </p>
          <h2 className="pt-2 text-lg font-semibold text-foreground">Issues &amp; discussions</h2>
          <p>
            Bugs and feature requests are best filed on{' '}
            <a className="text-primary underline underline-offset-2 hover:text-primary/80" href={`${SITE.repo}/issues`}>
              GitHub
            </a>
            .
          </p>
          <h2 className="pt-2 text-lg font-semibold text-foreground">Postal address</h2>
          <address className="not-italic">
            {SITE.contact.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Send a message</h2>
          <form
            name="contact"
            method="POST"
            action="/thank-you"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="space-y-3"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Don&apos;t fill this out: <input name="bot-field" />
              </label>
            </p>
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Send message
            </button>
            <p className="text-xs">
              We use your message only to reply. See the privacy policy for details.
            </p>
          </form>
        </section>
      </div>
    </MarketingPage>
    </>
  );
}
