import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { StatBand } from './StatBand';

describe('StatBand', () => {
  it('renders a semantic description list of stats', () => {
    render(
      <StatBand
        items={[
          { value: '3,500+', label: 'Advisory firms', hint: 'Vetted' },
          { value: '5,000+', label: 'Investors' },
          { value: '12,000+', label: 'Deals annually' },
        ]}
      />
    );
    expect(screen.getByText('3,500+')).toBeInTheDocument();
    expect(screen.getByText('Advisory firms')).toBeInTheDocument();
    expect(screen.getByText('Vetted')).toBeInTheDocument();
    expect(screen.getByText('12,000+')).toBeInTheDocument();
  });

  it('supports column and alignment presets', () => {
    const { container } = render(
      <StatBand
        columns={4}
        align="left"
        items={[
          { value: '1', label: 'One' },
          { value: '2', label: 'Two' },
        ]}
      />
    );
    expect(container.firstElementChild).toHaveClass('lg:grid-cols-4');
    expect(screen.getByText('One').parentElement).toHaveClass('items-start', 'text-left');
  });

  it('renders a bordered panel variant with dense cells', () => {
    const { container } = render(
      <StatBand
        variant="panel"
        align="left"
        valueClassName="font-mono"
        items={[
          { value: '3', label: 'Deadlines', hint: 'closing soon' },
          { value: '12', label: 'Events' },
        ]}
      />
    );
    const dl = container.firstElementChild as HTMLElement;
    expect(dl).toHaveClass('border', 'border-border', 'rounded-lg', 'divide-y', 'sm:divide-x');
    expect(screen.getByText('3')).toHaveClass('font-mono', 'text-xl');
    const label = screen.getByText('Deadlines');
    expect(label).toHaveClass('uppercase');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<StatBand items={[{ value: '10+', label: 'Years' }]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations in panel variant', async () => {
    const { container } = render(
      <StatBand variant="panel" items={[{ value: '10+', label: 'Years', hint: 'and counting' }]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
