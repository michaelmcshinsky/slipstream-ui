import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './SiteHeader';

const items = [
  { href: '/docs', label: 'Docs' },
  { href: '/changelog', label: 'Changelog' },
  { href: 'https://github.com/x', label: 'GitHub', external: true },
];

describe('SiteHeader', () => {
  it('renders brand, navigation and external safety', () => {
    render(<SiteHeader brand={<span>Acme</span>} items={items} activeHref="/docs/components" />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    const docs = screen.getByRole('link', { name: 'Docs' });
    expect(docs).toHaveAttribute('aria-current', 'page'); // prefix match
    expect(screen.getByRole('link', { name: 'Changelog' })).not.toHaveAttribute('aria-current');
    const external = screen.getByRole('link', { name: 'GitHub' });
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('respects exact matching', () => {
    render(<SiteHeader brand={<span>Acme</span>} items={items} activeHref="/docs/components" match="exact" />);
    expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveAttribute('aria-current');
  });

  it('uses a router link component', () => {
    function RouterLink({ href, children, ...props }: React.ComponentProps<'a'>) {
      return (
        <a data-router href={href} {...props}>
          {children}
        </a>
      );
    }
    render(<SiteHeader brand={<span>Acme</span>} items={items} linkComponent={RouterLink} />);
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('data-router');
  });

  it('opens the mobile drawer', async () => {
    const user = userEvent.setup();
    render(<SiteHeader brand={<span>Acme</span>} items={items} />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SiteHeader brand={<span>Acme</span>} items={items} activeHref="/docs" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
