import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { BottomNav, type BottomNavItem } from './BottomNav';

const ITEMS: BottomNavItem[] = [
  { href: '/', label: 'Home', active: true },
  { href: '/search', label: 'Search', badge: 3 },
  { href: '/alerts', label: 'Alerts', disabled: true },
];

describe('BottomNav', () => {
  it('renders a labelled nav landmark with one tab per item', () => {
    render(<BottomNav items={ITEMS} />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('marks only the active tab with aria-current', () => {
    render(<BottomNav items={ITEMS} />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /Search/ })).not.toHaveAttribute('aria-current');
  });

  it('renders a disabled tab without a link', () => {
    render(<BottomNav items={ITEMS} />);
    expect(screen.queryByRole('link', { name: 'Alerts' })).not.toBeInTheDocument();
    expect(screen.getByText('Alerts').closest('[aria-disabled="true"]')).not.toBeNull();
  });

  it('passes the destination through a router link component', () => {
    function RouterLink({ to, ...rest }: { to: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
      return <a href={to} data-router="" {...rest} />;
    }
    render(<BottomNav items={ITEMS} linkComponent={RouterLink} linkHrefProp="to" />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('data-router', '');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<BottomNav items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
