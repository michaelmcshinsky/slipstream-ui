import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('renders label, value, delta and hint with a direction glyph', () => {
    render(<MetricCard label="Revenue" value="$12,480" delta="+12.4%" trend="up" hint="vs last month" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,480')).toBeInTheDocument();
    expect(screen.getByText(/12.4%/)).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('colors trends but never relies on color alone', () => {
    const { rerender } = render(<MetricCard label="Churn" value="2.1%" delta="-0.4" trend="down" />);
    const delta = screen.getByText(/-0.4/);
    expect(delta).toHaveClass('text-destructive');
    expect(delta.textContent).toContain('↓');
    rerender(<MetricCard label="Churn" value="2.1%" delta="0" trend="flat" />);
    expect(screen.getByText(/0/).textContent).toContain('→');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<MetricCard label="Users" value={1234} delta="+3%" trend="up" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('MetricCard migration aliases', () => {
  it('reads title and description when label and hint are absent', () => {
    render(<MetricCard title="Revenue" value="$1" description="vs last month" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('prefers label and hint when both forms are passed', () => {
    render(<MetricCard label="Canonical" title="Alias" value="1" hint="Hint line" description="Alt line" />);
    expect(screen.getByText('Canonical')).toBeInTheDocument();
    expect(screen.queryByText('Alias')).not.toBeInTheDocument();
    expect(screen.getByText('Hint line')).toBeInTheDocument();
    expect(screen.queryByText('Alt line')).not.toBeInTheDocument();
  });
});

describe('MetricCard tone and loading', () => {
  it('colors the value by tone', () => {
    const { rerender } = render(<MetricCard label="Revenue" value="$1" tone="success" />);
    expect(screen.getByText('$1')).toHaveClass('text-success');
    rerender(<MetricCard label="Revenue" value="$1" tone="destructive" />);
    expect(screen.getByText('$1')).toHaveClass('text-destructive');
  });

  it('renders a skeleton with aria-busy while loading', () => {
    const { container } = render(<MetricCard label="Revenue" value="$1" loading />);
    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('$1')).not.toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
