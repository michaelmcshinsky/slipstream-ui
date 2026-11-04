import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Timeline } from './Timeline';

describe('Timeline', () => {
  it('renders an ordered chronology with periods and descriptions', () => {
    const { container } = render(
      <Timeline
        items={[
          { title: 'Senior Engineer', period: '2023 — Present', description: 'Platform team' },
          { title: 'Engineer', period: '2020 — 2023' },
        ]}
      />
    );
    expect(container.querySelector('ol')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('2023 — Present')).toBeInTheDocument();
    expect(screen.getByText('Platform team')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Timeline items={[{ title: 'Started' }]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
