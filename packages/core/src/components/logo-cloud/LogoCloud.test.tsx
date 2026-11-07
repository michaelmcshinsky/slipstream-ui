import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { LogoCloud } from './LogoCloud';

describe('LogoCloud', () => {
  it('renders named logos and optional links', () => {
    render(
      <LogoCloud
        caption="Trusted by"
        items={[
          { name: 'Peakstone', logo: <span data-testid="logo-a">P</span> },
          { name: 'North', logo: <span data-testid="logo-b">N</span>, href: '/members/north' },
        ]}
      />
    );
    expect(screen.getByText('Trusted by')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'North' })).toHaveAttribute('href', '/members/north');
    expect(screen.getByText('Peakstone')).toHaveClass('sr-only');
  });

  it('supports column and alignment presets', () => {
    const { container } = render(
      <LogoCloud
        columns={6}
        align="left"
        items={[{ name: 'A', logo: <span>A</span> }, { name: 'B', logo: <span>B</span> }]}
      />
    );
    expect(container.querySelector('ul')).toHaveClass('lg:grid-cols-6');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <LogoCloud items={[{ name: 'Axial', logo: <span>AX</span> }]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
