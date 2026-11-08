import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { TombstoneCard } from './TombstoneCard';

describe('TombstoneCard', () => {
  it('renders the unavailable state and reason', () => {
    render(
      <TombstoneCard
        title="Archived listing"
        reason="This listing closed in 2025."
        status="archived"
        href="/deals/archived"
      />
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Archived listing' })).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
    expect(screen.getByText('This listing closed in 2025.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View details' })).toHaveAttribute('href', '/deals/archived');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TombstoneCard title="Unavailable" reason="No longer available." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
