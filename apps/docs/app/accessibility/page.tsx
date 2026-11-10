import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { SITE } from '@/lib/site';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/accessibility', {
  title: 'Accessibility',
  description:
    'Slipstream UI accessibility statement: target standard, how components and this site are tested, known limitations, and how to report a barrier.',
  alternates: { canonical: '/accessibility' },
});

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: 'WebPage',
          name: 'Accessibility statement',
          description:
            'Slipstream UI accessibility statement: target standard, how components and this site are tested, known limitations, and how to report a barrier.',
          path: '/accessibility',
        })}
      />
      <MarketingPage
      title="Accessibility statement"
      description="Slipstream UI targets WCAG 2.2 Level AA for both the component library and this documentation site."
      updated="November 2026"
    >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Conformance target</h2>
        <p>
          The component library and this site are developed against{' '}
          <a className="text-primary underline underline-offset-2 hover:text-primary/80" href="https://www.w3.org/TR/WCAG22/">
            WCAG 2.2 Level AA
          </a>
          . Accessibility regressions are treated as bugs, not enhancements.
        </p>
        <p>
          This statement covers automated conformance evidence plus known gaps. It is not a claim of full manual
          conformance: assistive-technology testing with real users is ongoing.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">How the library is tested</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-foreground">jest-axe suites</strong> on every component, run in CI on each pull
            request.
          </li>
          <li>
            <strong className="text-foreground">Keyboard behaviour</strong> implemented as part of the component
            contract (roving tabindex in composite widgets, Escape/arrow handling, visible focus rings).
          </li>
          <li>
            <strong className="text-foreground">Reduced motion</strong> honoured by streaming indicators, drawers,
            dialogs, and scroll behaviours.
          </li>
          <li>
            <strong className="text-foreground">ARIA contracts</strong> documented in each COMPONENT_MANIFEST and
            enforced by the same rules agents see over MCP.
          </li>
        </ul>
        <p>
          Read the{' '}
          <Link className="text-primary underline underline-offset-2 hover:text-primary/80" href="/docs/guides/accessibility-ai">
            accessibility guide for AI-generated UI
          </Link>{' '}
          for the per-component details.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">How this site is tested</h2>
        <p>
          The documentation site runs an automated axe-core audit over its primary routes as part of the release
          checklist. The audit covers WCAG 2.0/2.1/2.2 A and AA rules and is reproducible from the repository:
        </p>
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 font-mono text-xs">
          <code>{`pnpm --filter slipstream-ui-docs build
pnpm --filter slipstream-ui-docs start -- -p 3111
pnpm --filter slipstream-ui-docs audit:a11y -- http://localhost:3111`}</code>
        </pre>
        <p>
          Routes covered: home, docs index, installation, representative component pages, MCP, templates, changelog,
          about, this page, contact, and the legal pages. Each route is audited in{' '}
          <strong className="text-foreground">both light and dark mode</strong>. On November 4, 2026 the suite passed
          all 13 routes in both schemes (26 page runs, 0 violations), and Lighthouse reported Accessibility 100 on the
          sampled routes.
        </p>
        <p>
          Automated tooling detects a subset of issues; it cannot validate reading order, task completion, or the
          quality of alternative text.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Known limitations</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            A full manual screen-reader audit (NVDA on Windows, VoiceOver on macOS/iOS) is not yet complete. Automated
            coverage is not a substitute.
          </li>
          <li>
            Third-party content linked from the docs (GitHub, external standards pages) is outside our control.
          </li>
          <li>
            Some interactive demos simulate streaming and agent behaviour with timers; they are illustrative and
            keyboard-operable, but not production transports.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Reporting a barrier</h2>
        <p>
          If something blocks you, please{' '}
          <a className="text-primary underline underline-offset-2 hover:text-primary/80" href={`${SITE.repo}/issues/new`}>
            open an issue
          </a>{' '}
          with the page, the assistive technology you used, and what you expected. Security-sensitive reports should
          follow the{' '}
          <a className="text-primary underline underline-offset-2 hover:text-primary/80" href={`${SITE.repo}/blob/main/SECURITY.md`}>
            security policy
          </a>
          . You can also email{' '}
          <a className="text-primary underline underline-offset-2 hover:text-primary/80" href={`mailto:${SITE.contact.email}`}>
            {SITE.contact.email}
          </a>
          .
        </p>
        <p>We aim to acknowledge accessibility reports within five business days.</p>
      </section>
    </MarketingPage>
    </>
  );
}
