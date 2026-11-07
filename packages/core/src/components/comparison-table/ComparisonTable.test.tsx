import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ComparisonTable } from './ComparisonTable';

describe('ComparisonTable', () => {
  it('renders feature rows and accessible boolean values', () => {
    render(
      <ComparisonTable
        columns={[{ label: 'With an advisor', highlight: true }, { label: 'On your own' }]}
        rows={[
          { feature: 'Accurate valuation', values: [true, false], hint: 'Market-tested' },
          { feature: 'Negotiation support', values: ['Included', 'Self-managed'] },
        ]}
      />
    );
    expect(screen.getByRole('table', { name: 'Comparison' })).toBeInTheDocument();
    expect(screen.getByText('Accurate valuation')).toBeInTheDocument();
    expect(screen.getByText('Market-tested')).toBeInTheDocument();
    expect(screen.getAllByText('Included').length).toBeGreaterThan(0);
    expect(screen.getByText('Not included')).toBeInTheDocument();
  });

  it('highlights the requested column', () => {
    render(
      <ComparisonTable
        columns={[{ label: 'Us', highlight: true }, { label: 'Them' }]}
        rows={[{ feature: 'Support', values: [true, false] }]}
      />
    );
    expect(screen.getByRole('columnheader', { name: 'Us' })).toHaveClass('bg-primary/10');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ComparisonTable
        columns={[{ label: 'Us' }, { label: 'Them' }]}
        rows={[{ feature: 'Feature', values: [true, false] }]}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
