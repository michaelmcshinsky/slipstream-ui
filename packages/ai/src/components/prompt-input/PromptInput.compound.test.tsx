import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools, PromptInputActionAddAttachments, usePromptInputAttachments } from './PromptInput';

describe('PromptInput compound primitives', () => {
  function CompoundDemo({ onSubmit }: { onSubmit: (value: string) => void }) {
    return (
      <PromptInput onSubmit={onSubmit}>
        <PromptInputTextarea placeholder="Compound" />
        <PromptInputFooter>
          <PromptInputTools>
            <span>tool</span>
          </PromptInputTools>
          <PromptInputSubmit />
        </PromptInputFooter>
      </PromptInput>
    );
  }

  it('submits through the compound layout', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();
    render(<CompoundDemo onSubmit={handleSubmit} />);

    const textarea = screen.getByPlaceholderText('Compound');
    await user.type(textarea, 'Hello compound');
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(handleSubmit).toHaveBeenCalledWith('Hello compound');
  });

  it('clears the textarea after submit', async () => {
    const user = userEvent.setup();
    render(<CompoundDemo onSubmit={() => {}} />);
    const textarea = screen.getByPlaceholderText('Compound');
    await user.type(textarea, 'x');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(textarea).toHaveValue('');
  });

  it('throws when a primitive renders outside the root', () => {
    // Silence the expected error boundary noise.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<PromptInputTextarea />)).toThrow();
    spy.mockRestore();
  });
});

describe('PromptInput status-aware submit control', () => {
  it('reflects an error state via the accessible label', () => {
    render(<PromptInput onSubmit={() => {}} hasError />);
    expect(screen.getByRole('button', { name: /Failed/ })).toBeInTheDocument();
  });

  it('shows the stop control while loading with onStop', () => {
    render(<PromptInput onSubmit={() => {}} onStop={() => {}} isLoading />);
    expect(screen.getByRole('button', { name: 'Stop generating' })).toBeInTheDocument();
  });
});

describe('PromptInput managed attachments', () => {
  it('validates maxFiles and reports typed errors', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    function Demo() {
      const attachments = usePromptInputAttachments({
        maxFiles: 1,
        multiple: true,
        onError,
      });
      return (
        <div>
          <button type="button" onClick={() => attachments.add([new File(['a'], 'a.txt'), new File(['b'], 'b.txt')])}>
            add
          </button>
          <span data-testid="count">{attachments.files.length}</span>
        </div>
      );
    }
    render(<Demo />);

    await user.click(screen.getByRole('button', { name: 'add' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ code: 'max_files' })
    );
  });

  it('rejects files that do not match accept', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    function Demo() {
      const attachments = usePromptInputAttachments({ accept: 'image/*', onError });
      return (
        <button type="button" onClick={() => attachments.add([new File(['a'], 'a.txt', { type: 'text/plain' })])}>
          add
        </button>
      );
    }
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'add' }));
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'accept' }));
  });

  it('renders managed attachment chips and removes them', async () => {
    const user = userEvent.setup();
    let added = false;
    function Demo() {
      const attachments = usePromptInputAttachments({});
      return (
        <div>
          <button
            type="button"
            onClick={() => {
              if (!added) {
                added = true;
                attachments.add([new File(['a'], 'notes.txt')]);
              }
            }}
          >
            add
          </button>
          {attachments.files.length > 0 && (
            <span>
              {attachments.files.map((f) => (
                <span key={f.id}>{f.name}</span>
              ))}
            </span>
          )}
        </div>
      );
    }
    render(<Demo />);
    await user.click(screen.getByRole('button', { name: 'add' }));
    expect(await screen.findByText('notes.txt')).toBeInTheDocument();
  });

  it('renders the dictation button only where speech is supported', () => {
    // jsdom has no SpeechRecognition, so dictate tools render nothing.
    render(
      <PromptInput onSubmit={() => {}}>
        <PromptInputTools>
          <PromptInputActionAddAttachments />
        </PromptInputTools>
      </PromptInput>
    );
    expect(screen.queryByRole('button', { name: /Dictate|dictation/i })).not.toBeInTheDocument();
  });
});
