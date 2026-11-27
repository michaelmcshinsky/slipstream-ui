import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { MonthSchedule } from './MonthSchedule';

type Event = { id: string; date: string; title: string; type?: string; href?: string };

const events: Event[] = [
  { id: '1', date: '2026-03-14', title: 'Fall Classic', type: 'competition', href: '/events/fall-classic' },
  { id: '2', date: '2026-03-14', title: 'Open Floor', type: 'social' },
  { id: '3', date: '2026-03-21', title: 'Workshop', type: 'class' },
  { id: '4', date: '2026-04-15', title: 'Next Month', type: 'social' },
];

const legend = [
  { type: 'competition', label: 'Competition' },
  { type: 'social', label: 'Social' },
  { type: 'class', label: 'Class' },
];

const base = {
  events,
  getDate: (e: Event) => e.date,
  getLabel: (e: Event) => e.title,
  getType: (e: Event) => e.type,
  getHref: (e: Event) => e.href,
};

describe('MonthSchedule', () => {
  it('renders the month label and events inside their days', () => {
    render(<MonthSchedule {...base} month="2026-03" today="2026-03-01" />);
    expect(screen.getByText('March 2026')).toBeInTheDocument();
    // Event chips appear in the grid; count both grid + agenda copies? agenda is
    // hidden via CSS but still in the DOM, so use getAllByText.
    expect(screen.getAllByText('Fall Classic').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Open Floor').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Workshop').length).toBeGreaterThan(0);
    // April event must not render for March.
    expect(screen.queryByText('Next Month')).not.toBeInTheDocument();
  });

  it('marks today with aria-current', () => {
    const { container } = render(
      <MonthSchedule {...base} month="2026-03" today="2026-03-14" />
    );
    expect(container.querySelector('[aria-current="date"]')).toBeInTheDocument();
  });

  it('collapses overflow beyond maxPerDay', () => {
    const many: Event[] = Array.from({ length: 5 }, (_, i) => ({
      id: `m${i}`,
      date: '2026-03-10',
      title: `Event ${i}`,
    }));
    render(
      <MonthSchedule
        events={many}
        getDate={(e) => e.date}
        getLabel={(e) => e.title}
        month="2026-03"
        today="2026-03-01"
        maxPerDay={2}
      />
    );
    expect(screen.getAllByText('+3 more').length).toBeGreaterThan(0);
  });

  it('renders the legend with type labels', () => {
    render(<MonthSchedule {...base} month="2026-03" today="2026-03-01" legend={legend} />);
    expect(screen.getByText('Competition')).toBeInTheDocument();
    expect(screen.getByText('Social')).toBeInTheDocument();
    expect(screen.getByText('Class')).toBeInTheDocument();
  });

  it('links events through linkComponent and linkHrefProp', () => {
    function RouterLink({ to, children, ...rest }: { to: string; children: React.ReactNode }) {
      return <a href={to} data-router-link={to} {...rest}>{children}</a>;
    }
    render(
      <MonthSchedule
        {...base}
        month="2026-03"
        today="2026-03-01"
        linkComponent={RouterLink}
        linkHrefProp="to"
      />
    );
    const links = screen.getAllByRole('link', { name: 'Fall Classic' });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('data-router-link', '/events/fall-classic');
  });

  it('pages months and notifies onMonthChange', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(
      <MonthSchedule
        {...base}
        month="2026-03"
        today="2026-03-01"
        onMonthChange={onMonthChange}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(onMonthChange).toHaveBeenCalledWith('2026-04');
    // Controlled: displayed month stays March until the parent updates it.
    expect(screen.getByText('March 2026')).toBeInTheDocument();
  });

  it('pages uncontrolled via defaultMonth', async () => {
    const user = userEvent.setup();
    render(<MonthSchedule {...base} defaultMonth="2026-03" today="2026-03-01" />);
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(await screen.findByText('April 2026')).toBeInTheDocument();
  });

  it('shows the agenda empty state when a month has no events', () => {
    render(
      <MonthSchedule
        events={[]}
        getDate={(e: Event) => e.date}
        getLabel={(e: Event) => e.title}
        month="2026-05"
        today="2026-03-01"
      />
    );
    expect(screen.getByText('No events this month.')).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <MonthSchedule {...base} month="2026-03" today="2026-03-01" legend={legend} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
