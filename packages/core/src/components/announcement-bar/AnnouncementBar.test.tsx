import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { AnnouncementBar } from './AnnouncementBar';

describe('AnnouncementBar', () => {
  it('renders a message and dismisses it', () => {
    const onDismiss = vi.fn();
    render(<AnnouncementBar message="New report is live" onDismiss={onDismiss} />);
    expect(screen.getByRole('region', { name: 'Announcement' })).toHaveTextContent('New report is live');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss announcement' }));
    expect(onDismiss).toHaveBeenCalled();
    expect(screen.queryByText('New report is live')).not.toBeInTheDocument();
  });

  it('renders an action link and tone', () => {
    const { container } = render(
      <AnnouncementBar
        message="Launch"
        href="/launch"
        actionLabel="Read more"
        tone="brand"
        dismissible={false}
      />
    );
    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute('href', '/launch');
    expect(container.firstElementChild).toHaveClass('bg-primary');
  });

  it('passes the destination via linkHrefProp for routers that use "to"', () => {
    const RouterLink = ({ to, children, ...rest }: { to: string; children: React.ReactNode }) => (
      <a href={to} data-router-to={to} {...rest}>
        {children}
      </a>
    );
    render(
      <AnnouncementBar
        message="Notice"
        href="/launch"
        actionLabel="Read more"
        linkComponent={RouterLink}
        linkHrefProp="to"
      />
    );
    expect(screen.getByRole('link', { name: 'Read more' })).toHaveAttribute('data-router-to', '/launch');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AnnouncementBar message="Notice" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
