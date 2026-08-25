import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { PromptInput } from './PromptInput';

describe('PromptInput', () => {
  it('submits on Enter and clears the field', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Hello world');
    await user.keyboard('{Enter}');
    expect(handleSubmit).toHaveBeenCalledWith('Hello world');
    expect(textarea).toHaveValue('');
  });

  it('inserts a newline on Shift+Enter instead of submitting', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);
    await user.type(screen.getByRole('textbox'), 'Line one');
    await user.keyboard('{Shift>}{Enter}{/Shift}');
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('does not submit whitespace-only input', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} />);
    await user.type(screen.getByRole('textbox'), '   ');
    await user.keyboard('{Enter}');
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('disables the send button while loading without an onStop handler', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<PromptInput onSubmit={handleSubmit} isLoading />);
    const send = screen.getByRole('button', { name: 'Send' });
    expect(send).toBeDisabled();
    await user.click(send);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('turns the send button into a stop button while loading with onStop', async () => {
    const user = userEvent.setup();
    const handleStop = vi.fn();
    render(<PromptInput onSubmit={vi.fn()} onStop={handleStop} isLoading />);

    const stopButton = screen.getByRole('button', { name: 'Stop generating' });
    await user.click(stopButton);
    expect(handleStop).toHaveBeenCalledOnce();
  });

  it('labels the icon-only send button accessibly', () => {
    render(<PromptInput onSubmit={vi.fn()} sendButtonText="Absenden" />);
    expect(screen.getByRole('button', { name: 'Absenden' })).toBeInTheDocument();
  });

  it('respects maxLength', async () => {
    const user = userEvent.setup();
    render(<PromptInput onSubmit={vi.fn()} maxLength={5} />);
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'abcdefgh');
    expect(textarea).toHaveValue('abcde');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PromptInput onSubmit={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
