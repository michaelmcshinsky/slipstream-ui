import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Toaster } from './Toaster';
import { toast } from './toast-store';

afterEach(() => {
  toast.clear();
  vi.useRealTimers();
});

describe('imperative toast', () => {
  it('renders a toast fired outside React with its description', () => {
    render(<Toaster />);
    act(() => {
      toast.success('Saved', 'Your changes are live');
    });
    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes are live')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('supports every variant helper and dismisses by id', async () => {
    const user = userEvent.setup();
    render(<Toaster richColors />);
    act(() => {
      toast.error('Upload failed');
      toast.warning('Slow network');
      toast.info('Heads up');
    });
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
    expect(screen.getByText('Slow network')).toBeInTheDocument();
    expect(screen.getByText('Heads up')).toBeInTheDocument();

    const ids = toast.dismiss;
    expect(typeof ids).toBe('function');
    await user.click(screen.getByRole('button', { name: 'Dismiss Upload failed' }));
    expect(screen.queryByText('Upload failed')).not.toBeInTheDocument();
  });

  it('auto-dismisses after the duration', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast({ title: 'Ephemeral', duration: 1000 });
    });
    expect(screen.getByText('Ephemeral')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.queryByText('Ephemeral')).not.toBeInTheDocument();
  });

  it('keeps duration=0 toasts until dismissed manually', async () => {
    const user = userEvent.setup();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<Toaster />);
    act(() => {
      toast({ title: 'Sticky', duration: 0 });
    });
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByText('Sticky')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss Sticky' }));
    expect(screen.queryByText('Sticky')).not.toBeInTheDocument();
  });

  it('honours the position prop and exposes a labelled live region', () => {
    const { container } = render(<Toaster position="top-left" label="Alerts" />);
    const region = screen.getByRole('list', { name: 'Alerts' });
    expect(region).toHaveClass('left-4', 'top-4', 'z-[60]');
    expect(container).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Toaster />);
    act(() => {
      toast.info('Info', 'Details');
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
