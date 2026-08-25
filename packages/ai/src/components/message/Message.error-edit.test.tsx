import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Message } from './Message';

const base = { id: 'm1', role: 'assistant' as const, content: 'Hello' };

describe('Message error/retry', () => {
  it('renders an error alert with retry action', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<Message message={base} error="Generation failed" onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Generation failed');
    await user.click(screen.getByRole('button', { name: /Retry/ }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('hides retry without a handler', () => {
    render(<Message message={base} error="Generation failed" />);
    expect(screen.getByText('Generation failed')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('Message edit flow', () => {
  it('swaps content into an editable textarea and reports the commit', async () => {
    const user = userEvent.setup();
    const onEditContent = vi.fn();
    render(
      <Message message={{ id: 'u1', role: 'user', content: 'Original question' }} onEditContent={onEditContent} />
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    const textarea = screen.getByLabelText('Edit message');
    expect(textarea).toHaveValue('Original question');

    await user.clear(textarea);
    await user.type(textarea, 'Revised question');
    await user.click(screen.getByRole('button', { name: 'Save & resend' }));

    expect(onEditContent).toHaveBeenCalledWith('Revised question');
    expect(screen.queryByLabelText('Edit message')).not.toBeInTheDocument();
  });

  it('cancels editing without reporting', async () => {
    const user = userEvent.setup();
    const onEditContent = vi.fn();
    render(<Message message={base} onEditContent={onEditContent} />);

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onEditContent).not.toHaveBeenCalled();
  });

  it('does not render Edit without onEditContent', () => {
    render(<Message message={base} />);
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
  });
});
