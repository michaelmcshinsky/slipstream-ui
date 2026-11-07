import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Newsletter } from './Newsletter';

describe('Newsletter', () => {
  it('submits the email and shows success', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<Newsletter title="Stay informed" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'owner@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('owner@example.com'));
    expect(await screen.findByText('Thanks. Check your inbox to confirm.')).toBeInTheDocument();
  });

  it('shows an error when the handler rejects', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('nope'));
    render(<Newsletter title="Stay informed" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'owner@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Newsletter title="Stay informed" description="Weekly insights." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
