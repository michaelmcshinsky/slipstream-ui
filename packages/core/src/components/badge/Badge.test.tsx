import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its content with base styling', () => {
    render(<Badge>Beta</Badge>);
    const badge = screen.getByText('Beta');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('rounded-full');
  });

  it.each(['secondary', 'destructive', 'outline', 'neutral', 'accent'] as const)(
    'applies the %s variant without the primary background',
    (variant) => {
      render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).not.toHaveClass('bg-primary');
    }
  );

  it('has no accessibility violations', async () => {
    const { container } = render(<Badge>Status</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Badge variants and sizing escape hatches', () => {
  it('renders each variant with its surface classes', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline', 'neutral', 'accent'] as const;
    const { container } = render(
      <>
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </>
    );
    expect(screen.getByText('default')).toHaveClass('bg-primary');
    expect(screen.getByText('secondary')).toHaveClass('bg-secondary');
    expect(screen.getByText('destructive')).toHaveClass('bg-destructive');
    expect(screen.getByText('outline')).toHaveClass('text-foreground');
    expect(screen.getByText('neutral')).toHaveClass('bg-muted');
    expect(screen.getByText('accent')).toHaveClass('bg-accent');
    expect(container.querySelectorAll('span').length).toBe(variants.length);
    expect(container.querySelectorAll('div').length).toBe(0);
  });

  it('defaults to the primary surface when no variant is given', () => {
    const { container } = render(<Badge>plain</Badge>);
    expect(container.firstChild).toHaveClass('bg-primary');
  });

  it('accepts className for scale and spacing adjustments', () => {
    const { container } = render(
      <Badge variant="outline" className="gap-1 px-3">
        custom
      </Badge>
    );
    expect(container.firstChild).toHaveClass('text-foreground', 'gap-1', 'px-3');
  });
});


describe('Badge asChild', () => {
  it('renders a link with badge styling', () => {
    render(
      <Badge asChild>
        <a href="/tags/react">React</a>
      </Badge>
    );
    const link = screen.getByRole('link', { name: 'React' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveClass('inline-flex', 'bg-primary');
  });
});


describe('Badge semantic and alias variants', () => {
  it('renders success, warning, info, primary and danger surfaces', () => {
    const { container } = render(
      <>
        <Badge variant="success">ok</Badge>
        <Badge variant="warning">warn</Badge>
        <Badge variant="info">info</Badge>
        <Badge variant="primary">primary</Badge>
        <Badge variant="danger">danger</Badge>
        <Badge variant="neutral">neutral</Badge>
        <Badge variant="accent">accent</Badge>
      </>
    );
    expect(screen.getByText('ok')).toHaveClass('bg-success');
    expect(screen.getByText('warn')).toHaveClass('bg-warning');
    expect(screen.getByText('info')).toHaveClass('bg-info');
    expect(screen.getByText('primary')).toHaveClass('bg-primary');
    expect(screen.getByText('danger')).toHaveClass('bg-destructive');
    expect(screen.getByText('neutral')).toHaveClass('bg-muted');
    expect(screen.getByText('accent')).toHaveClass('bg-accent');
    expect(container.querySelectorAll('span')).toHaveLength(7);
  });

  it('applies size presets', () => {
    const { rerender } = render(<Badge size="sm">small</Badge>);
    expect(screen.getByText('small')).toHaveClass('text-[11px]');
    rerender(<Badge size="lg">large</Badge>);
    expect(screen.getByText('large')).toHaveClass('text-sm', 'px-3');
  });
});
