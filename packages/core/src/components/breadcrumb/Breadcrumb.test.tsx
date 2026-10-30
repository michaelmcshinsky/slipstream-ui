import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders a nav landmark with breadcrumb label', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Page' }]} />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('renders links for non-last items and plain text for the last', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Docs', href: '/docs' },
          { label: 'Current' },
        ]}
      />
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
    expect(screen.getByText('Current')).not.toHaveAttribute('href');
  });

  it('marks the last item as current page', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Current' }]} />);
    expect(screen.getByText('Current')).toHaveAttribute('aria-current', 'page');
  });

  it('renders separators between items', () => {
    render(
      <Breadcrumb
        items={[{ label: 'A', href: '/a' }, { label: 'B', href: '/b' }, { label: 'C' }]}
      />
    );
    const separators = screen.getAllByText('/');
    expect(separators.length).toBeGreaterThanOrEqual(2);
  });

  it('supports custom separator', () => {
    render(
      <Breadcrumb
        items={[{ label: 'A', href: '/a' }, { label: 'B' }]}
        separator=">"
      />
    );
    expect(screen.getByText('>')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Breadcrumb items={[{ label: 'A' }]} className="custom-class" />);
    expect(screen.getByRole('navigation')).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Docs', href: '/docs' },
          { label: 'Current' },
        ]}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
