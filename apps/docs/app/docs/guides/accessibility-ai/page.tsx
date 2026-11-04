import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'Accessible AI interfaces',
  description:
    'Streaming announcements, focus management, keyboard operation, reduced motion, and testing patterns that keep AI chat interfaces usable with assistive technology.',
};

export default function AccessibilityAiGuidePage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
        Accessible AI interfaces
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Chat UIs break accessibility in three predictable ways: streams that never stop announcing,
        focus that jumps on every token, and controls that only work with a mouse. Slipstream
        handles the first two inside the components — this page covers what they do and what your
        app must still own.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        What the components already do
      </h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left font-medium">Concern</th>
              <th className="p-3 text-left font-medium">Built-in behavior</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Streaming', 'aria-busy on the streaming message; polite completion announcement instead of per-token chatter.'],
              ['Focus', 'Menus/popovers move focus in and restore on Escape; tooltips follow focus, not just hover.'],
              ['Scroll', 'Auto-scroll only near the bottom; keyboard users are never yanked away from what they read.'],
              ['Motion', 'Animations respect prefers-reduced-motion (including accordion expansion).'],
              ['Errors', 'Retry cards + FormField errors render with role=alert so failures are announced.'],
              ['Testing', 'Every component ships a jest-axe suite; CI runs them per package.'],
            ].map(([concern, behavior]) => (
              <tr key={concern} className="border-t border-border">
                <td className="p-3 font-medium">{concern}</td>
                <td className="p-3 text-muted-foreground">{behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        What your app still owns
      </h2>

      <h3 className="mt-8 text-xl font-semibold">1. Announce user-visible status changes</h3>
      <p className="mt-2 leading-relaxed text-muted-foreground">
        Connection loss, saved states, queued messages — anything that changes outside the
        transcript needs one polite live region. Never make the transcript itself a live region.
      </p>
      <div className="mt-3">
        <CodeBlock
          language="tsx"
          code={`{/* One status region for the whole surface */}
<p role="status" aria-live="polite" className="sr-only">
  {statusMessage}
</p>`}
        />
      </div>

      <h3 className="mt-8 text-xl font-semibold">2. Keep the composer reachable</h3>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        <li>PromptInput is a real textarea: Enter sends, Shift+Enter newlines — document it in placeholder or hint text.</li>
        <li>Don&apos;t trap focus in the transcript; Tab order should reach the composer from anywhere.</li>
        <li>Icon-only buttons (send, stop, thumbs) need aria-labels — the tooltip supplements, never replaces.</li>
      </ul>

      <h3 className="mt-8 text-xl font-semibold">3. Don&apos;t announce every token</h3>
      <p className="mt-2 leading-relaxed text-muted-foreground">
        The instinct is to mirror streaming output into a live region — that makes screen readers
        unusable for minutes. Announce only phases: <em>generating…</em> (optional) and{' '}
        <em>response complete</em>. Conversation does this; don&apos;t duplicate it.
      </p>

      <h3 className="mt-8 text-xl font-semibold">4. Color and contrast are your tokens</h3>
      <p className="mt-2 leading-relaxed text-muted-foreground">
        Semantic status tokens (success/warning/info) ship as CSS variables with paired
        foregrounds — status pills pass AA in both themes by default. If you override tokens via{' '}
        <Link href="/docs/theming" className="text-primary hover:underline">createTheme</Link>,
        re-check contrast on destructive/success on your brand hues.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Testing checklist
      </h2>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`import { axe } from 'jest-axe';

it('chat surface has no accessibility violations', async () => {
  const { container } = render(<ChatSurface messages={transcript} />);
  expect(await axe(container)).toHaveNoViolations();
});

// Interaction coverage that matters for chat:
// - keyboard: composer focus, suggestion buttons, stop button reachable
// - streaming: aria-busy present while streamingMessageId is set
// - errors: retry card announced (role/status) and retry reachable via keyboard`}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Also run an axe pass <em>while streaming</em> and <em>with an error card open</em> — the
        resting state alone misses half the surface. See{' '}
        <Link href="/docs/guides/testing" className="font-medium text-primary hover:underline">Testing AI components</Link>{' '}
        for the full workflow, including manifest drift in CI.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/docs/components/conversation" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">Conversation</h3>
          <p className="mt-1 text-sm text-muted-foreground">Scroll + streaming a11y details.</p>
        </Link>
        <Link href="/docs/components/form-field" className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40">
          <h3 className="font-semibold">FormField</h3>
          <p className="mt-1 text-sm text-muted-foreground">Label/hint/error wiring done for you.</p>
        </Link>
      </div>
    </div>
  );
}
