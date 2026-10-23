import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './Toast';

function Trigger({ options }: { options: Parameters<ReturnType<typeof useToast>['toast']>[0] }) {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast(options)}>
      Show toast
    </button>
  );
}

describe('Toast', () => {
  it('announces toasts via status roles inside a labelled region', () => {
    render(
      <ToastProvider>
        <Trigger options={{ title: 'Saved', description: 'Your changes are live.' }} />
      </ToastProvider>,
    );
    act(() => screen.getByRole('button', { name: 'Show toast' }).click());
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes are live.')).toBeInTheDocument();
    // role=status is an implicit polite live region; the container is a labelled list.
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('stacks multiple toasts and keeps duration 0 until dismissed', () => {
    function Stack() {
      const { toast } = useToast();
      return (
        <>
          <button type="button" onClick={() => toast({ title: 'One', duration: 0 })}>One</button>
          <button type="button" onClick={() => toast({ title: 'Two', duration: 0 })}>Two</button>
        </>
      );
    }
    render(<ToastProvider><Stack /></ToastProvider>);
    act(() => {
      screen.getByRole('button', { name: 'One' }).click();
      screen.getByRole('button', { name: 'Two' }).click();
    });
    expect(screen.getAllByRole('status')).toHaveLength(2);
  });

  it('throws when useToast is used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Trigger options={{ title: 'x' }} />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});

describe('Toast timing and actions (real timers)', () => {
  it('auto-dismisses after the duration', async () => {
    render(
      <ToastProvider>
        <Trigger options={{ title: 'Temp', duration: 50 }} />
      </ToastProvider>,
    );
    act(() => screen.getByRole('button', { name: 'Show toast' }).click());
    expect(screen.getByText('Temp')).toBeInTheDocument();
    await act(() => new Promise((resolve) => setTimeout(resolve, 80)));
    expect(screen.queryByText('Temp')).not.toBeInTheDocument();
  });

  it('supports manual dismiss without waiting for the timer', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger options={{ title: 'Sticky', duration: 0 }} />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Show toast' }));
    expect(screen.getByText('Sticky')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss Sticky' }));
    expect(screen.queryByText('Sticky')).not.toBeInTheDocument();
  });

  it('runs the action callback and dismisses', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ToastProvider>
        <Trigger options={{ title: 'Undo?', duration: 0, action: { label: 'Undo', onClick } }} />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Show toast' }));
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByText('Undo?')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ToastProvider>
        <Trigger options={{ title: 'Saved', description: 'All good.', duration: 0, action: { label: 'Undo', onClick: () => undefined } }} />
      </ToastProvider>,
    );
    act(() => screen.getByRole('button', { name: 'Show toast' }).click());
    expect(await axe(container)).toHaveNoViolations();
  });
});
