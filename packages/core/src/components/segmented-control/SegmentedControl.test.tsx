import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl } from './SegmentedControl';

function ControlledExample() {
  const [value, setValue] = useState('investors');
  return (
    <SegmentedControl
      aria-label="Audience"
      value={value}
      onValueChange={(next) => setValue(next as string)}
      options={[
        { value: 'investors', label: 'Investors' },
        { value: 'advisors', label: 'Advisors' },
        { value: 'owners', label: 'Owners' },
      ]}
    />
  );
}

describe('SegmentedControl', () => {
  it('selects an option and exposes radio semantics', () => {
    render(<ControlledExample />);
    const advisors = screen.getByRole('radio', { name: 'Advisors' });
    fireEvent.click(advisors);
    expect(advisors).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Investors' })).toHaveAttribute('aria-checked', 'false');
  });

  it('moves selection with arrow keys', () => {
    render(<ControlledExample />);
    const investors = screen.getByRole('radio', { name: 'Investors' });
    investors.focus();
    fireEvent.keyDown(investors, { key: 'ArrowRight' });
    expect(screen.getByRole('radio', { name: 'Advisors' })).toHaveAttribute('aria-checked', 'true');
  });

  it('supports multiple selection', () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="Filters"
        multiple
        defaultValue={['a']}
        onValueChange={onValueChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ControlledExample />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders options with href as links and marks the active segment', () => {
    render(
      <SegmentedControl
        aria-label="View"
        value="grid"
        options={[
          { value: 'list', label: 'List', href: '/items?view=list' },
          { value: 'grid', label: 'Grid', href: '/items?view=grid' },
        ]}
      />
    );
    expect(screen.getByRole('link', { name: 'List' })).toHaveAttribute('href', '/items?view=list');
    expect(screen.queryByRole('link', { name: 'Grid' })).not.toBeInTheDocument();
    expect(screen.getByText('Grid').closest('[aria-current]')).toHaveAttribute('aria-current', 'page');
  });

  it('honors linkComponent and linkHrefProp', () => {
    const RouterLink = ({ to, children, ...rest }: { to: string; children: React.ReactNode }) => (
      <a href={to} data-to={to} {...rest}>{children}</a>
    );
    render(
      <SegmentedControl
        aria-label="View"
        value="list"
        linkComponent={RouterLink}
        linkHrefProp="to"
        options={[
          { value: 'list', label: 'List', href: '/items?view=list' },
          { value: 'grid', label: 'Grid', href: '/items?view=grid' },
        ]}
      />
    );
    expect(screen.getByRole('link', { name: 'Grid' })).toHaveAttribute('data-to', '/items?view=grid');
  });

  it('renders a disabled link option as a non-interactive marker', () => {
    render(
      <SegmentedControl
        aria-label="View"
        value="list"
        options={[
          { value: 'list', label: 'List', href: '/items?view=list' },
          { value: 'grid', label: 'Grid', href: '/items?view=grid', disabled: true },
        ]}
      />
    );
    expect(screen.queryByRole('link', { name: 'Grid' })).not.toBeInTheDocument();
    expect(screen.getByText('Grid').closest('[aria-disabled]')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has no accessibility violations in link mode', async () => {
    const { container } = render(
      <SegmentedControl
        aria-label="View"
        value="grid"
        options={[
          { value: 'list', label: 'List', href: '/items?view=list' },
          { value: 'grid', label: 'Grid', href: '/items?view=grid' },
        ]}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
