import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { SiteHeader, type SiteNavItem } from './SiteHeader';

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

  it('passes a `to` prop for react-router style link components', () => {
    function RouterLink({ to, children, ...props }: { to: string; children?: React.ReactNode }) {
      return (
        <a data-router data-to={to} href={to} {...props}>
          {children}
        </a>
      );
    }
    render(
      <SiteHeader brand={<span>Acme</span>} items={items} linkComponent={RouterLink} linkHrefProp="to" />
    );
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('data-to', '/docs');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('data-to', '/');
  });

  it('supports a custom brand label and drawer actions', async () => {
    const user = userEvent.setup();
    render(
      <SiteHeader
        brand={<span>Acme</span>}
        brandLabel="Acme home"
        items={items}
        actions={<button type="button">Header action</button>}
        mobileActions={<button type="button">Mobile action</button>}
      />
    );
    expect(screen.getByRole('link', { name: 'Acme home' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const drawer = screen.getByRole('dialog', { name: 'Menu' });
    expect(within(drawer).getByRole('button', { name: 'Mobile action' })).toBeInTheDocument();
    expect(within(drawer).queryByRole('button', { name: 'Header action' })).not.toBeInTheDocument();
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

const megaItems: SiteNavItem[] = [
  {
    label: 'Dancers',
    columns: [
      {
        heading: 'Plan',
        items: [
          { href: '/events', label: 'All events', description: 'Every genre in Utah' },
          { href: '/deadlines', label: 'Deadlines' },
        ],
      },
      {
        heading: 'Follow',
        items: [{ href: '/brief', label: 'Deadline Brief' }],
      },
    ],
  },
  { href: '/directory', label: 'Directory' },
];

describe('SiteHeader mega menu', () => {
  it('renders a disclosure trigger instead of a link for nested items', () => {
    render(<SiteHeader brand={<span>Acme</span>} items={megaItems} />);
    const trigger = screen.getByRole('button', { name: /Dancers/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('link', { name: 'Directory' })).toBeInTheDocument();
  });

  it('opens on hover and exposes the panel links', async () => {
    const user = userEvent.setup();
    render(<SiteHeader brand={<span>Acme</span>} items={megaItems} />);
    await user.hover(screen.getByRole('button', { name: /Dancers/ }));
    expect(screen.getByRole('button', { name: /Dancers/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('link', { name: /All events/ })).toBeInTheDocument();
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Every genre in Utah')).toBeInTheDocument();
  });

  it('closes on Escape and on an outside pointer', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SiteHeader brand={<span>Acme</span>} items={megaItems} />
        <button type="button">Outside</button>
      </div>
    );
    const trigger = screen.getByRole('button', { name: /Dancers/ });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.getByRole('button', { name: /Dancers/ })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('moves focus into the panel with ArrowDown', async () => {
    const user = userEvent.setup();
    render(<SiteHeader brand={<span>Acme</span>} items={megaItems} />);
    const trigger = screen.getByRole('button', { name: /Dancers/ });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('link', { name: /All events/ })).toHaveFocus();
  });

  it('keeps the panel open while tabbing through its links', async () => {
    const user = userEvent.setup();
    render(<SiteHeader brand={<span>Acme</span>} items={megaItems} />);
    const trigger = screen.getByRole('button', { name: /Dancers/ });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await user.tab();
    expect(screen.getByRole('link', { name: /Deadlines/ })).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders nested groups in the mobile drawer', async () => {
    const user = userEvent.setup();
    render(<SiteHeader brand={<span>Acme</span>} items={megaItems} />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const drawer = screen.getByRole('dialog', { name: 'Menu' });
    expect(within(drawer).getByText('Dancers')).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: /All events/ })).toBeInTheDocument();
  });

  it('has no accessibility violations with a panel open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SiteHeader brand={<span>Acme</span>} items={megaItems} activeHref="/events" />
    );
    await user.hover(screen.getByRole('button', { name: /Dancers/ }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
