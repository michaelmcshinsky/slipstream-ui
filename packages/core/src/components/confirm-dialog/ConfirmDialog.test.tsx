import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders title, description and actions', () => {
    render(
      <ConfirmDialog open onOpenChange={vi.fn()} title="Delete project" description="This cannot be undone." onConfirm={vi.fn()} />
    );
    expect(screen.getByRole('dialog', { name: 'Delete project' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('runs onConfirm, shows pending and closes', async () => {
    const user = userEvent.setup();
    let resolve!: () => void;
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        })
    );
    const onOpenChange = vi.fn();
    render(<ConfirmDialog open onOpenChange={onOpenChange} title="Publish" onConfirm={onConfirm} confirmLabel="Publish now" />);
    await user.click(screen.getByRole('button', { name: 'Publish now' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: /Publish now/ })).toHaveAttribute('aria-busy', 'true');
    resolve();
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it('marks destructive confirms', () => {
    render(<ConfirmDialog open onOpenChange={vi.fn()} title="Delete" destructive onConfirm={vi.fn()} confirmLabel="Delete" />);
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('bg-destructive');
  });

  it('has no accessibility violations', async () => {
    const { baseElement } = render(
      <ConfirmDialog open onOpenChange={vi.fn()} title="Confirm" description="Sure?" onConfirm={vi.fn()} />
    );
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
