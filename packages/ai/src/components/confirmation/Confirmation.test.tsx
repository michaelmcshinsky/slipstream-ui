import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Confirmation } from './Confirmation';

describe('Confirmation', () => {
  it('renders a pending alertdialog with approve/reject', () => {
    render(<Confirmation title="Delete file" toolName="delete_file" />);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reject' })).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('reports approval and hides the buttons', async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    const onReject = vi.fn();
    render(<Confirmation title="Delete file" onApprove={onApprove} onReject={onReject} />);

    await user.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onApprove).toHaveBeenCalledOnce();
    expect(onReject).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('reports rejection', async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    const onReject = vi.fn();
    render(<Confirmation title="Delete file" onApprove={onApprove} onReject={onReject} />);

    await user.click(screen.getByRole('button', { name: 'Reject' }));
    expect(onReject).toHaveBeenCalledOnce();
    expect(onApprove).not.toHaveBeenCalled();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('respects controlled status', () => {
    render(<Confirmation title="Delete" status="rejected" onReject={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Reject' })).not.toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('supports localized labels', () => {
    render(
      <Confirmation
        title="Datei löschen"
        labels={{ approve: 'Genehmigen', reject: 'Ablehnen' }}
      />
    );
    expect(screen.getByRole('button', { name: 'Genehmigen' })).toBeInTheDocument();
  });

  it('has no accessibility violations while pending', async () => {
    const { container } = render(<Confirmation title="Delete file" description="notes.txt" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Confirmation action variants and visibility', () => {
  it('showActions={false} hides both action buttons but keeps the status chip', () => {
    render(
      <Confirmation title="Delete" description="This cannot be undone." showActions={false} />
    );
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Approve' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reject' })).not.toBeInTheDocument();
  });

  it('approveVariant/rejectVariant control button themes', () => {
    render(
      <Confirmation
        title="Terminate run"
        description="The run is still active."
        labels={{ approve: 'Terminate', reject: 'Keep running' }}
        approveVariant="destructive"
        rejectVariant="ghost"
      />
    );
    expect(screen.getByRole('button', { name: 'Terminate' })).toHaveClass('bg-destructive');
    expect(screen.getByRole('button', { name: 'Keep running' })).toHaveClass('hover:bg-accent');
  });

  it('rejecting flips the chip to Rejected and calls onReject', async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    render(<Confirmation title="Confirm" description="Sure?" onReject={onReject} />);
    await user.click(screen.getByRole('button', { name: 'Reject' }));
    expect(onReject).toHaveBeenCalledOnce();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reject' })).not.toBeInTheDocument();
  });
});
