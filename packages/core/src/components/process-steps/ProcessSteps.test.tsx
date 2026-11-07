import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ProcessSteps } from './ProcessSteps';

describe('ProcessSteps', () => {
  it('renders an ordered list with derived step numbers', () => {
    render(
      <ProcessSteps
        steps={[
          { title: 'Meet your consultant', description: 'Share your goals.' },
          { title: 'Review advisors' },
          { title: 'Interview and hire' },
        ]}
      />
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Review advisors' })).toBeInTheDocument();
  });

  it('can use icons instead of numbers', () => {
    render(<ProcessSteps numbered={false} steps={[{ title: 'Step', icon: <span>★</span> }]} />);
    expect(screen.getByText('★')).toBeInTheDocument();
    expect(screen.queryByText('01')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ProcessSteps steps={[{ title: 'Step', description: 'Copy' }]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
