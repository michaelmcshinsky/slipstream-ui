import type { Metadata } from 'next';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'Testing AI components',
  description:
    'jest-axe accessibility suites, interaction tests for streaming and errors, manifest drift checks, and validate_usage as a CI gate for agent-generated UI.',
};

export default function TestingGuidePage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
        Testing AI components
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Three layers keep AI UIs honest: accessibility regressions (jest-axe), interaction behavior
        (streaming, errors, keyboard), and <em>spec</em> drift (manifests vs TypeScript vs generated
        JSX). Slipstream ships tooling for all three.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">Layer 1 — jest-axe</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        Every component in the library ships an axe suite; do the same for your compositions. The
        three states that matter for chat UIs: resting, streaming, and error.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

describe('ChatSurface', () => {
  it('resting state has no violations', async () => {
    const { container } = render(<ChatSurface messages={transcript} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('streaming state has no violations', async () => {
    const { container } = render(
      <ChatSurface messages={transcript} streamingId={transcript.at(-1)!.id} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('error state has no violations', async () => {
    const { container } = render(
      <ChatSurface messages={transcript} errors={{ 'msg-2': 'Generation failed' }} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Layer 2 — interaction tests
      </h2>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`import { fireEvent, render, screen } from '@testing-library/react';

it('streams a reply and stops on the stop button', async () => {
  render(<ChatSurface />);
  const composer = screen.getByRole('textbox');
  fireEvent.change(composer, { target: { value: 'Hi' } });
  fireEvent.keyDown(composer, { key: 'Enter' });

  expect(await screen.findByText('thinking…')).toBeInTheDocument();  // streaming phase
  fireEvent.click(screen.getByRole('button', { name: /stop/i }));

  expect(screen.queryByText('thinking…')).not.toBeInTheDocument();  // stopped
  expect(composer).toHaveValue('');                                  // composer reset
});

it('renders a retry card when the stream fails', async () => {
  // drive your transport's error path (mock fetch / abort)
  expect(await screen.findByRole('alert')).toHaveTextContent(/try again/i);
});`}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        jsdom lacks scroll APIs — mock them once in setup (the ai package does:{' '}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">Element.prototype.scrollIntoView = vi.fn()</code>,{' '}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">scrollTo = vi.fn()</code>).
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Layer 3 — spec drift in CI
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        The library enforces manifest ↔ TypeScript sync; your app can enforce the same idea for the
        components it copies in via the registry:
      </p>
      <div className="mt-4">
        <CodeBlock
          language="bash"
          code={`# Fail CI when copied components drift from the registry
npx @slipstream-ui/cli@latest diff            # exit 1 on drift
npx @slipstream-ui/cli@latest diff --json     # machine-readable

# And validate every COMPONENT_MANIFEST in the repo
pnpm validate:manifests                  # schema + TS↔manifest drift`}
        />
      </div>
      <div className="mt-4">
        <CodeBlock
          language="yaml"
          code={`# .github/workflows/ci.yml
- name: Slipstream drift
  run: npx @slipstream-ui/cli@latest diff`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Bonus — validate agent-written JSX
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        If your pipeline lets an agent generate UI, run{' '}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">validate_usage</code> on
        the result before merge — the same MCP tool, called as a step:
      </p>
      <div className="mt-4">
        <CodeBlock
          language="text"
          code={`mcp: validate_usage({
  componentId: "prompt-input",
  code: "<PromptInput onSubmitChat={send} isBusy />"   // invented props
})
=> { valid: false, issues: [
     { severity: "error", message: "Unknown prop: onSubmitChat" },
     { severity: "error", message: "Unknown prop: isBusy" }
   ] }`}
        />
      </div>

      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold">CI recipe (full)</h2>
        <div className="mt-3">
          <CodeBlock
            language="yaml"
            code={`- run: pnpm lint
- run: pnpm typecheck
- run: pnpm test                      # jest-axe + interaction suites
- run: pnpm validate:manifests        # manifest schema + drift
- run: npx @slipstream-ui/cli@latest diff  # copied components vs registry`}
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          This is exactly what the Slipstream repo runs — see{' '}
          <a
            href="https://github.com/michaelmcshinsky/slipstream-ui/blob/main/.github/workflows/ci.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-2"
          >
            ci.yml
          </a>
          .
        </p>
      </div>
    </div>
  );
}
