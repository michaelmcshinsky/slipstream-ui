import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
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
