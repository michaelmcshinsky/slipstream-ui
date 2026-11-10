import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingPage } from '@/components/site/marketing-page';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { AI_COMPONENT_COUNT, COMPONENT_COUNT, CORE_COMPONENT_COUNT } from '@/lib/component-count';
import { SITE } from '@/lib/site';
import { VERSION } from '@/lib/version';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/about', {
  title: 'About',
  description:
    'Who builds Slipstream UI, why it exists, and the engineering principles behind manifests, the MCP server, and the usage validator.',
  alternates: { canonical: '/about' },
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: 'AboutPage',
          name: 'About Slipstream UI',
          description:
            'Who builds Slipstream UI, why it exists, and the engineering principles behind manifests, the MCP server, and the usage validator.',
          path: '/about',
        })}
      />
      <MarketingPage
        title="About Slipstream UI"
        description="A small, open-source project with a single thesis: coding agents are users too, and they deserve machine-readable contracts."
        updated="November 2026"
      >
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Why this exists</h2>
        <p>
          AI coding assistants are good at writing React, and bad at remembering the exact prop names, required
          fields, and accessibility rules of a design system they have never seen. The usual fix is more prompt
          context or a bigger README - both drift the moment a component changes.
        </p>
        <p>
          Slipstream UI flips the direction: the source of truth ships with the code. Every one of the{' '}
          {COMPONENT_COUNT} components ({CORE_COMPONENT_COUNT} core + {AI_COMPONENT_COUNT} AI) carries a{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">COMPONENT_MANIFEST</code>; an MCP server
          serves those manifests, and <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">validate_usage</code>{' '}
          checks generated JSX against them before it reaches your editor.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Principles</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-foreground">Agents are first-class users.</strong> A contract an agent can query is
            as important as a prop table a human can read.
          </li>
          <li>
            <strong className="text-foreground">Stateless by design.</strong> Components render; you own state,
            transport, and data. No runtime lock-in, no hidden providers.
          </li>
          <li>
            <strong className="text-foreground">Accessibility is not a variant.</strong> Keyboard behaviour, ARIA
            wiring, and reduced-motion paths are part of the component contract and are covered by jest-axe suites.
          </li>
          <li>
            <strong className="text-foreground">You own the code.</strong> Install through npm packages or the
            shadcn-compatible registry and keep the source in your repository.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Who maintains it</h2>
        <p>
          Slipstream UI is built and maintained in the open by{' '}
          <a className="text-primary underline underline-offset-2 hover:text-primary/80" href={SITE.social.github} target="_blank" rel="noopener noreferrer">
            Michael McShinsky
          </a>
          . Issues, discussions, and pull requests are welcome in the{' '}
          <a className="text-primary underline underline-offset-2 hover:text-primary/80" href={SITE.repo} target="_blank" rel="noopener noreferrer">
            GitHub repository
          </a>
          .
        </p>
        <p>
          Current version: <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">v{VERSION}</code>. The
          project follows semantic versioning and publishes from CI with npm provenance.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">How to verify the claims</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Link className="text-primary underline underline-offset-2 hover:text-primary/80" href="/docs/ai-manifests">
              Read a manifest
            </Link>{' '}
            and compare it with the component source.
          </li>
          <li>
            <Link className="text-primary underline underline-offset-2 hover:text-primary/80" href="/docs/mcp">
              Run the MCP server
            </Link>{' '}
            and call <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">validate_usage</code> on a
            deliberately broken snippet.
          </li>
          <li>
            <Link className="text-primary underline underline-offset-2 hover:text-primary/80" href="/accessibility">
              Review the accessibility statement
            </Link>{' '}
            and the automated audit scope.
          </li>
          <li>
            <a className="text-primary underline underline-offset-2 hover:text-primary/80" href={`${SITE.repo}/blob/main/SECURITY.md`}>
              Security policy
            </a>{' '}
            and{' '}
            <a className="text-primary underline underline-offset-2 hover:text-primary/80" href="/.well-known/security.txt">
              security.txt
            </a>
            .
          </li>
        </ul>
      </section>
      </MarketingPage>
    </>
  );
}
