import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { EntityCard, ProfileCard } from './EntityCard';

describe('EntityCard', () => {
  it('renders name, type, stats and tags', () => {
    render(
      <EntityCard
        name="Peakstone Group"
        entityType="Investment bank"
        location="New York, NY"
        description="M&A advisory for middle market clients."
        stats={[
          { label: 'Closed deals', value: '60' },
          { label: 'Via Axial', value: '3' },
        ]}
        tags={['Industrials', 'Healthcare']}
        href="/members/peakstone"
      />
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Peakstone Group' })).toBeInTheDocument();
    expect(screen.getByText('Investment bank')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('Industrials')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Peakstone Group' })).toHaveAttribute('href', '/members/peakstone');
  });

  it('falls back to initials and exposes the ProfileCard alias', () => {
    render(<ProfileCard name="North Park" entityType="Private equity" />);
    expect(screen.getByText('NP')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<EntityCard name="Firm" entityType="Advisor" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
