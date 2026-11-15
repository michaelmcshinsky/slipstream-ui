import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';

function mockClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
}

function mockOverflow(overflows: boolean) {
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get: () => (overflows ? 400 : 100),
  });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => 100,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollWidth');
  Reflect.deleteProperty(HTMLElement.prototype, 'clientWidth');
  document.documentElement.classList.remove('dark');
});

describe('CodeBlock', () => {
  it('renders code with a language label', () => {
    const { container } = render(<CodeBlock code="const x = 1;" language="ts" />);
    expect(screen.getByText('ts')).toBeInTheDocument();
    // Prism splits code into tokens; assert on aggregate content.
    expect(container.textContent).toContain('const x = 1;');
  });

  it('defaults to the tsx language label', () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByText('tsx')).toBeInTheDocument();
  });

  it('copies code to the clipboard and confirms', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(<CodeBlock code={'line one\nline two'} />);
    await user.click(screen.getByRole('button', { name: 'Copy code' }));

    expect(writeText).toHaveBeenCalledWith('line one\nline two');
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
  });

  it('hides the copy button when showCopyButton is false', () => {
    render(<CodeBlock code="x" showCopyButton={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('trims trailing newline from copied content', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(<CodeBlock code={'hello\n'} />);
    await user.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(writeText).toHaveBeenCalledWith('hello');
  });
});

describe('CodeBlock bad paths', () => {
  it('still confirms when the clipboard is unavailable', async () => {
    mockClipboard(() => Promise.reject(new Error('insecure context')));
    render(<CodeBlock code="const x = 1;" />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('resets the copied label after the timeout', async () => {
    mockClipboard(() => Promise.resolve());
    render(<CodeBlock code="const x = 1;" />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy code' }));
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Copy')).toBeInTheDocument(), { timeout: 3000 });
  }, 10000);

  it('renders empty code without crashing', () => {
    const { container } = render(<CodeBlock code="" language="text" />);
    expect(screen.getByText('text')).toBeInTheDocument();
    expect(container.querySelector('pre')).toBeInTheDocument();
  });

  it('renders an unknown language without crashing', () => {
    const { container } = render(<CodeBlock code="<<<not code>>>" language="brainfuck" />);
    expect(screen.getByText('brainfuck')).toBeInTheDocument();
    expect(container.textContent).toContain('not code');
  });
});

describe('CodeBlock accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <CodeBlock code={'export function add(a: number, b: number) {\n  return a + b;\n}'} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('makes overflowing code focusable and labelled', async () => {
    mockOverflow(true);
    render(<CodeBlock code={'const veryLongVariableName = 1;'} language="ts" />);

    const pre = await screen.findByLabelText('ts code, scrollable');
    expect(pre).toHaveAttribute('tabindex', '0');
  });

  it('keeps short code out of the tab order', () => {
    mockOverflow(false);
    const { container } = render(<CodeBlock code="const x = 1;" language="ts" />);

    const pre = container.querySelector('pre');
    expect(pre).not.toHaveAttribute('tabindex');
    expect(pre).not.toHaveAttribute('aria-label');
  });

  it('follows the dark class on the document element', async () => {
    const { container } = render(<CodeBlock code="const x = 1;" />);
    const pre = container.querySelector('pre') as HTMLPreElement;
    expect(pre.style.color).toBe('rgb(31, 35, 40)');

    document.documentElement.classList.add('dark');
    await waitFor(() => expect(pre.style.color).toBe('rgb(230, 237, 243)'));
  });
});
