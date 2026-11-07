import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the headline, eyebrow, badge, actions and media', () => {
    render(
      <Hero
        eyebrow="Private deal network"
        badge="New"
        title="Find your next buyer."
        description="Join 20,000+ members."
        actions={<a href="/join">Get started</a>}
        media={<img src="/product.png" alt="Product preview" />}
      />
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Find your next buyer.' })).toBeInTheDocument();
    expect(screen.getByText('Private deal network')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toBeInTheDocument();
    expect(screen.getByAltText('Product preview')).toBeInTheDocument();
  });

  it('renders a centered h2 when requested and no media', () => {
    render(<Hero title="Section hero" level={2} align="center" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Section hero' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Hero title="Headline" description="Supporting copy" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
