import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { FeatureGrid } from './FeatureGrid';

describe('FeatureGrid', () => {
  it('renders feature cards with icons and links', () => {
    render(
      <FeatureGrid
        features={[
          { title: 'Vetted advisors', description: 'Curated for your business', icon: <span>★</span> },
          { title: 'Buyer targeting', href: '/features/buyers', actionLabel: 'Learn more' },
        ]}
      />
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Vetted advisors' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Buyer targeting/ })).toHaveAttribute('href', '/features/buyers');
    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });

  it('supports plain and centered variants', () => {
    const { container } = render(
      <FeatureGrid variant="plain" align="center" columns={2} features={[{ title: 'One' }]} />
    );
    expect(container.querySelector('ul')).toHaveClass('sm:grid-cols-2');
    expect(screen.getByRole('heading', { name: 'One' }).parentElement).toHaveClass('items-center', 'text-center');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<FeatureGrid features={[{ title: 'Feature', description: 'Copy' }]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
