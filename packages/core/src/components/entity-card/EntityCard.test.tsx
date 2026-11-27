import type { ReactNode } from 'react';
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

  it('cardHref makes the card one stretched link and keeps actions usable', () => {
    render(
      <EntityCard
        name="Peakstone Group"
        entityType="Investment bank"
        cardHref="/members/peakstone"
        href="/members/peakstone"
        actions={<button type="button">Save</button>}
      />
    );
    const link = screen.getByRole('link', { name: 'Peakstone Group' });
    expect(link).toHaveAttribute('href', '/members/peakstone');
    expect(link.className).toContain('after:inset-0');
    // One target: the redundant footer link is suppressed, actions remain.
    expect(screen.queryByRole('link', { name: 'View profile' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('cardHref respects linkComponent for routers', () => {
    const RouterLink = ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
      <a data-router-link="" href={href} {...rest}>{children}</a>
    );
    render(<EntityCard name="North Park" entityType="Private equity" cardHref="/members/north-park" linkComponent={RouterLink} />);
    expect(screen.getByRole('link', { name: 'North Park' })).toHaveAttribute('data-router-link');
  });

  it('passes destinations via linkHrefProp for routers that use "to"', () => {
    const RouterLink = ({ to, children, ...rest }: { to: string; children: ReactNode }) => (
      <a href={to} data-router-to={to} {...rest}>{children}</a>
    );
    render(<EntityCard name="North Park" entityType="Private equity" href="/members/north-park" linkComponent={RouterLink} linkHrefProp="to" />);
    expect(screen.getByRole('link', { name: 'North Park' })).toHaveAttribute('data-router-to', '/members/north-park');
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
