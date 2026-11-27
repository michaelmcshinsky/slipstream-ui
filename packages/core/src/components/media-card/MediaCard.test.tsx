import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { MediaCard } from './MediaCard';

describe('MediaCard', () => {
  it('renders title, description, meta, chips and footer', () => {
    render(
      <MediaCard
        title="Fall Classic"
        description="Two days of ballroom."
        meta="Mar 14 · Salt Lake City"
        chips={[{ label: 'Open', variant: 'outline-success', dot: true }]}
        footer="Details →"
      />
    );
    expect(screen.getByRole('heading', { name: 'Fall Classic' })).toBeInTheDocument();
    expect(screen.getByText('Two days of ballroom.')).toBeInTheDocument();
    expect(screen.getByText('Mar 14 · Salt Lake City')).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Details →')).toBeInTheDocument();
  });

  it('makes the whole card a single link when href is set', () => {
    const { container } = render(
      <MediaCard href="/events/fall-classic" title="Fall Classic" meta="Mar 14" />
    );
    const link = screen.getByRole('link', { name: /Fall Classic/ });
    expect(link).toHaveAttribute('href', '/events/fall-classic');
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(link).toHaveClass('group');
  });

  it('renders a static article when href is absent', () => {
    render(<MediaCard title="No link" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('renders the cover through CoverImage with the seeded fallback', () => {
    const { container } = render(
      <MediaCard
        title="No art"
        cover={{ alt: 'No art cover', seed: 'no-art', aspect: 'square' }}
      />
    );
    expect(container.querySelector('.aspect-square')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('renders the cover image when src is provided', () => {
    render(
      <MediaCard
        title="With art"
        cover={{ src: '/cover.jpg', alt: 'Event cover', aspect: 'video' }}
      />
    );
    expect(screen.getByRole('img', { name: 'Event cover' })).toBeInTheDocument();
  });

  it('supports row layout with a fixed-width cover', () => {
    const { container } = render(
      <MediaCard layout="row" title="Row" cover={{ alt: 'Row cover' }} />
    );
    expect(container.querySelector('.sm\\:w-44')).toBeInTheDocument();
  });

  it('routes href through a custom linkComponent and linkHrefProp', () => {
    function RouterLink({ to, children, ...rest }: { to: string; children: React.ReactNode }) {
      return <a href={to} data-router-link={to} {...rest}>{children}</a>;
    }
    render(
      <MediaCard
        href="/events/x"
        title="Routed"
        linkComponent={RouterLink}
        linkHrefProp="to"
      />
    );
    const link = screen.getByRole('link', { name: /Routed/ });
    expect(link).toHaveAttribute('data-router-link', '/events/x');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <MediaCard
        href="/events/fall-classic"
        title="Fall Classic"
        description="Two days of ballroom."
        cover={{ alt: 'Fall Classic cover', seed: 'fall-classic' }}
        chips={[{ label: 'Open', variant: 'outline-success', dot: true }]}
        footer="Details →"
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
