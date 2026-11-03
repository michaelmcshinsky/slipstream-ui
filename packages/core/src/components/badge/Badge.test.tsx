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

  it.each(['secondary', 'destructive', 'outline'] as const)(
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
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const;
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
    expect(container.querySelectorAll('div').length).toBe(variants.length);
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
