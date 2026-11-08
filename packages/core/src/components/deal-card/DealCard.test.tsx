import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { DealCard } from './DealCard';

const metrics = [
  { label: 'Revenue', value: '$20.4M' },
  { label: 'EBITDA', value: '$4.2M' },
  { label: 'Margin', value: '21%' },
];

describe('DealCard', () => {
  it('renders the deal, metrics and access badges', () => {
    render(
      <DealCard
        title="Fleet services platform"
        sector="Transportation"
        location="South Atlantic"
        description="Multi-regional platform opportunity."
        metrics={metrics}
        ndaAvailable
        cimAvailable
      />
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Fleet services platform' })).toBeInTheDocument();
    expect(screen.getByText('Transportation')).toBeInTheDocument();
    expect(screen.getByText('$20.4M')).toBeInTheDocument();
    expect(screen.getByText('NDA available')).toBeInTheDocument();
    expect(screen.getByText('CIM available')).toBeInTheDocument();
  });

  it('exposes save state and request access', () => {
    const onSave = vi.fn();
    const onRequestAccess = vi.fn();
    render(
      <DealCard
        title="Deal"
        sector="Technology"
        metrics={metrics}
        saved
        onSave={onSave}
        onRequestAccess={onRequestAccess}
      />
    );
    expect(screen.getByRole('button', { name: 'Saved' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Request access' }));
    expect(onRequestAccess).toHaveBeenCalled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DealCard title="Deal" sector="Technology" metrics={metrics} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
