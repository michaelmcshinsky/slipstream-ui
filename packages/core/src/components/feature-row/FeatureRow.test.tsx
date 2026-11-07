import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { FeatureRow } from './FeatureRow';

describe('FeatureRow', () => {
  it('renders copy, actions and media at the requested heading level', () => {
    render(
      <FeatureRow
        eyebrow="For advisors"
        title="Reach relevant investors"
        description="Run a confidential process."
        actions={<a href="/join">Request access</a>}
        media={<img src="/chart.png" alt="Deal flow chart" />}
        level={3}
      />
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Reach relevant investors' })).toBeInTheDocument();
    expect(screen.getByText('For advisors')).toBeInTheDocument();
    expect(screen.getByAltText('Deal flow chart')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request access' })).toBeInTheDocument();
  });

  it('moves media to the left with order classes', () => {
    const { container } = render(<FeatureRow title="Feature" media={<span>Media</span>} mediaPosition="left" />);
    expect(container.firstElementChild?.firstElementChild).toHaveClass('lg:order-2');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<FeatureRow title="Feature" description="Copy" media={<span>Media</span>} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
