import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accessibility',
  description: 'Slipstream UI dashboard accessibility target, testing, and known limitations.',
};

/**
 * App-scoped accessibility statement. The component library and docs site
 * publish a fuller statement at slipstreamui.com/accessibility; this page
 * states the dashboard's own target and honest testing status.
 */
export default function AccessibilityPage() {
  return (
    <main id="main" className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Slipstream Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Accessibility</h1>
        <p className="mt-2 text-muted-foreground">
          The dashboard targets{' '}
          <a
            href="https://www.w3.org/TR/WCAG22/"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
            rel="noopener noreferrer"
          >
            WCAG 2.2 Level AA
          </a>
          , the same standard the component library and docs site are developed
          against. The full statement is at{' '}
          <a
            href="https://slipstreamui.com/accessibility"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            slipstreamui.com/accessibility
          </a>
          .
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">How the dashboard is built</h2>
        <p className="text-sm text-muted-foreground">
          The dashboard is composed almost entirely of Slipstream UI components,
          which carry the library&apos;s accessibility contract: keyboard
          operation, visible focus rings, correct ARIA roles, focus
          trap/restore in overlays, and reduced-motion support. Every
          component ships a jest-axe suite that runs in CI, so regressions in
          the underlying widgets are caught before they reach this app.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Testing status</h2>
        <p className="text-sm text-muted-foreground">
          Conformance evidence today is the component-level automated suite
          plus manual review of app-specific screens (forms, tables, settings).
          We have not yet run a dedicated screen-reader or assistive-technology
          audit of the dashboard itself, and this page does not claim one. If
          you hit a barrier, report it and we will treat it as a bug.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Report a barrier</h2>
        <p className="text-sm text-muted-foreground">
          Open a private report via{' '}
          <a
            href="https://github.com/michaelmcshinsky/slipstream-ui/security/advisories/new"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
            rel="noopener noreferrer"
          >
            GitHub security advisories
          </a>{' '}
          or a public issue on the{' '}
          <a
            href="https://github.com/michaelmcshinsky/slipstream-ui/issues"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
            rel="noopener noreferrer"
          >
            repository
          </a>
          . Include the page, what you were trying to do, and the assistive
          technology you use.
        </p>
      </section>
    </main>
  );
}
