import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ChainThought } from './ChainThought';

const steps = [
  { id: 'c1', content: 'Fetch data', status: 'completed' as const },
  { id: 'c2', content: 'Analyze results', status: 'pending' as const },
];

describe('ChainThought', () => {
  it('renders numbered steps with their content', () => {
    render(<ChainThought steps={steps} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Fetch data')).toBeInTheDocument();
    expect(screen.getByText('Analyze results')).toBeInTheDocument();
  });

  it('renders nothing for an empty step list', () => {
    const { container } = render(<ChainThought steps={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('applies compact text sizing', () => {
    render(<ChainThought steps={steps} compact />);
    expect(screen.getByText('Fetch data').parentElement).toHaveClass('text-sm');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ChainThought steps={steps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
