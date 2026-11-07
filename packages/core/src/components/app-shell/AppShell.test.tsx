import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { AppShell, Sidebar, type SidebarSection } from './AppShell';

const sections: SidebarSection[] = [
  {
    title: 'Workspace',
    items: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/classes', label: 'Classes', badge: '4' },
    ],
  },
  {
    items: [{ href: '/settings', label: 'Settings' }],
  },
];

describe('Sidebar', () => {
  it('renders sections, headings and marks the active route', () => {
    render(<Sidebar sections={sections} activeHref="/classes" />);
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    const active = screen.getByRole('link', { name: /Classes/ });
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('uses a custom router link component', () => {
    function RouterLink({ href, children, ...props }: React.ComponentProps<'a'>) {
      return (
        <a data-router href={href} {...props}>
          {children}
        </a>
      );
    }
    render(<Sidebar sections={sections} linkComponent={RouterLink} />);
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('data-router');
  });

  it('honours an explicit active flag', () => {
    render(
      <Sidebar
        sections={[{ items: [{ href: '/x', label: 'X', active: true }] }]}
        activeHref="/elsewhere"
      />
    );
    expect(screen.getByRole('link', { name: 'X' })).toHaveAttribute('aria-current', 'page');
  });

  it('keeps a parent item active on nested routes', () => {
    render(
      <Sidebar
        sections={[{ items: [{ href: '/app/body', label: 'Body' }] }]}
        activeHref="/app/body/strength"
      />
    );
    expect(screen.getByRole('link', { name: 'Body' })).toHaveAttribute('aria-current', 'page');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Sidebar sections={sections} activeHref="/dashboard" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('AppShell', () => {
  it('renders the rail, sticky header and main content', () => {
    render(
      <AppShell sidebar={<Sidebar sections={sections} />} header={<span>Top bar</span>}>
        <p>Page body</p>
      </AppShell>
    );
    expect(screen.getByText('Page body')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Dashboard' }).length).toBeGreaterThan(0);
    expect(screen.getByText('Top bar')).toBeInTheDocument();
  });

  it('opens the sidebar in a drawer on mobile', async () => {
    const user = userEvent.setup();
    render(
      <AppShell sidebar={<Sidebar sections={sections} />}>
        <p>Body</p>
      </AppShell>
    );
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(screen.getByRole('dialog', { name: 'Navigation' })).toBeInTheDocument();
  });

  it('hides the built-in menu button when requested', () => {
    render(
      <AppShell sidebar={<Sidebar sections={sections} />} hideMobileMenu>
        <p>Body</p>
      </AppShell>
    );
    expect(screen.queryByRole('button', { name: 'Open navigation' })).not.toBeInTheDocument();
  });

  it('can render without a sidebar', () => {
    render(
      <AppShell header={<span>Only header</span>}>
        <p>Body</p>
      </AppShell>
    );
    expect(screen.queryByRole('button', { name: 'Open navigation' })).not.toBeInTheDocument();
    expect(screen.getByText('Only header')).toBeInTheDocument();
  });
});


describe('Sidebar nesting and collapse', () => {
  const nested: SidebarSection[] = [
    {
      items: [
        {
          href: '/classes',
          label: 'Classes',
          children: [
            { href: '/classes/today', label: 'Today' },
            { href: '/classes/week', label: 'This week' },
          ],
        },
        { href: '/settings', label: 'Settings' },
      ],
    },
  ];

  it('renders nested groups with aria-expanded and opens the active group', () => {
    render(<Sidebar sections={nested} activeHref="/classes/today" />);
    const group = screen.getByRole('button', { name: 'Classes' });
    expect(group).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'This week' })).toBeInTheDocument();
  });

  it('toggles nested groups', async () => {
    const user = userEvent.setup();
    render(<Sidebar sections={nested} activeHref="/settings" />);
    const group = screen.getByRole('button', { name: 'Classes' });
    expect(group).toHaveAttribute('aria-expanded', 'false');
    await user.click(group);
    expect(group).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Today' })).toBeInTheDocument();
  });

  it('collapses to an icon rail and reports the change', async () => {
    const user = userEvent.setup();
    const onCollapsedChange = vi.fn();
    const { container } = render(
      <Sidebar sections={nested} collapsible onCollapsedChange={onCollapsedChange} />
    );
    await user.click(screen.getByRole('button', { name: 'Collapse navigation' }));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(container.firstChild).toHaveAttribute('data-collapsed', 'true');
    expect(screen.getByRole('button', { name: 'Expand navigation' })).toBeInTheDocument();
  });
});
