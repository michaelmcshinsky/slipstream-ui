import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Branch } from './Branch';

describe('Branch', () => {
  it('renders nothing for fewer than two variants', () => {
    const { container } = render(<Branch count={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the uncontrolled position and navigates', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Branch count={3} defaultSelected={0} onSelect={onSelect} />);

    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next response' }));
    expect(onSelect).toHaveBeenCalledWith(1);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Previous response' }));
    expect(onSelect).toHaveBeenLastCalledWith(0);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('disables navigation at the boundaries', () => {
    const { rerender } = render(<Branch count={2} selected={0} />);
    expect(screen.getByRole('button', { name: 'Previous response' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next response' })).toBeEnabled();

    rerender(<Branch count={2} selected={1} />);
    expect(screen.getByRole('button', { name: 'Next response' })).toBeDisabled();
  });

  it('clamps out-of-range controlled selection', () => {
    render(<Branch count={3} selected={9} />);
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
  });

  it('announces position politely for screen readers', () => {
    render(<Branch count={2} selected={1} />);
    expect(screen.getByText('2 / 2')).toHaveAttribute('aria-live', 'polite');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Branch count={3} defaultSelected={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
