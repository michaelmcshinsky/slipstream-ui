import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { MessageActions } from './MessageActions';

describe('MessageActions', () => {
  it('copies content and confirms via the copied label', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    render(<MessageActions content="Hello world" onCopy={onCopy} />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith('Hello world');
    expect(onCopy).toHaveBeenCalledWith('Hello world');
    expect(screen.getByText('Copied')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Copy')).toBeInTheDocument(), {
      timeout: 2500,
    });
  });

  it('hides copy action when no content is provided', () => {
    render(<MessageActions />);
    expect(screen.queryByText('Copy')).not.toBeInTheDocument();
  });

  it('reports a rating and toggles it off on second click', async () => {
    const user = userEvent.setup();
    const onFeedback = vi.fn();
    render(<MessageActions onFeedback={onFeedback} />);

    await user.click(screen.getByRole('button', { name: 'Good response' }));
    expect(onFeedback).toHaveBeenLastCalledWith('up');

    await user.click(screen.getByRole('button', { name: 'Good response' }));
    expect(onFeedback).toHaveBeenLastCalledWith(undefined);
  });

  it('exposes pressed state for rating buttons', async () => {
    const user = userEvent.setup();
    render(<MessageActions />);
    const up = screen.getByRole('button', { name: 'Good response' });
    expect(up).toHaveAttribute('aria-pressed', 'false');
    await user.click(up);
    expect(up).toHaveAttribute('aria-pressed', 'true');
  });

  it('hides regenerate without a callback', () => {
    render(<MessageActions />);
    expect(screen.queryByRole('button', { name: 'Regenerate' })).not.toBeInTheDocument();
  });

  it('calls onRegenerate', async () => {
    const user = userEvent.setup();
    const onRegenerate = vi.fn();
    render(<MessageActions onRegenerate={onRegenerate} />);
    await user.click(screen.getByRole('button', { name: 'Regenerate' }));
    expect(onRegenerate).toHaveBeenCalledOnce();
  });

  it('supports localized labels', () => {
    render(<MessageActions content="x" labels={{ copy: 'Kopieren', thumbUp: 'Gut' }} />);
    expect(screen.getByText('Kopieren')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MessageActions content="Hi" onRegenerate={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
