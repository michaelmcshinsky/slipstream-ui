import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Compatibility',
  description:
    'Tested and expected compatibility for Slipstream UI: React 18/19, Next.js, Vite, Tailwind CSS 3.4 and 4.x, Radix UI primitives and React Server Components.',
};

const ROWS = [
  ['React', '18.2', 'Tested', 'Docs and playground builds; component test suites'],
  ['React', '19.x', 'Expected', 'Peer range `^18.0.0 || ^19.0.0`; no dedicated fixture yet'],
  ['Next.js (App Router)', '16.4.3', 'Tested', 'Docs and app builds'],
  ['Next.js', '14 / 15', 'Expected', 'App Router APIs used are stable; no fixture'],
  ['Vite', 'Playground', 'Tested', 'Playground build'],
  ['Tailwind CSS', '3.4', 'Tested', 'All apps build with the shared preset'],
  ['Tailwind CSS', '4.x', 'Tested', 'Theme compiled against component sources by pnpm verify:tailwind-v4 + token tests'],
  ['Radix UI primitives', 'Current', 'Tested', 'Dialog, Select, Popover, Toast and other suites'],
  ['React Server Components', 'Next 16', 'Expected', 'No RSC fixture'],
  ['Node.js', '>= 20.9', 'Tested', 'CI runs Node 22'],
] as const;

export default function CompatibilityPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Compatibility</h1>
      <p className="text-lg text-muted-foreground mb-4">
        A cell is <strong className="text-foreground">tested</strong> only when CI or a committed
        test proves it. Everything else is <strong className="text-foreground">expected</strong>.
      </p>
      <p className="mb-8 leading-relaxed text-muted-foreground">
        We do not describe React 19, Next 14/15, React Server Components or Tailwind v4 as tested
        until a fixture exists. If your stack relies on one of those, treat it as unverified.
      </p>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-3 font-semibold">Surface</th>
              <th className="px-4 py-3 font-semibold">Version</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([surface, version, status, evidence]) => (
              <tr key={`${surface}-${version}`} className="border-t border-border">
                <td className="px-4 py-3">{surface}</td>
                <td className="px-4 py-3 font-mono text-xs">{version}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      status === 'Tested'
                        ? 'rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success'
                        : 'rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning-ink'
                    }
                  >
                    {status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{evidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Tailwind v4 setup</h2>
      <p className="mb-3 leading-relaxed text-muted-foreground">
        See the <Link className="text-primary underline underline-offset-2" href="/docs/tailwind-v4">Tailwind v4 guide</Link>{' '}
        for the theme import, content sources and known motion caveats.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">What is not claimed</h2>
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
        <li>Browser support follows your application&apos;s browserslist; the library ships no polyfills.</li>
        <li>Accessibility is verified by automated axe and keyboard tests, not a formal VPAT or screen-reader certification.</li>
        <li>React 19 and RSC are peer-compatible but not yet covered by a dedicated fixture.</li>
      </ul>
    </div>
  );
}
