import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { FormLayout } from './FormLayout';

describe('FormLayout', () => {
  it('stacks children vertically by default with the md gap', () => {
    const { container } = render(
      <FormLayout>
        <span>a</span>
      </FormLayout>
    );
    expect(container.firstChild).toHaveClass('flex-col', 'gap-4');
  });

  it('row layout wraps items on the end line', () => {
    const { container } = render(
      <FormLayout layout="row" gap="sm">
        <span>a</span>
      </FormLayout>
    );
    expect(container.firstChild).toHaveClass('flex-row', 'flex-wrap', 'items-end', 'gap-2');
  });

  it('grid layout applies literal columns and exact pixel gaps', () => {
    const { container } = render(
      <FormLayout layout="grid" columns={3} gap={12}>
        <span>a</span>
        <span>b</span>
      </FormLayout>
    );
    expect(container.firstChild).toHaveClass('grid', 'grid-cols-3');
    expect(container.firstChild).toHaveStyle({ gap: '12px' });
  });

  it('grid layout accepts per-breakpoint column counts', () => {
    const { container } = render(
      <FormLayout layout="grid" columns={{ base: 1, md: 2, lg: 3 }}>
        <span>a</span>
      </FormLayout>
    );
    expect(container.firstChild).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    expect(container.firstChild).not.toHaveClass('grid-cols-2');
  });

  it('applies legendClassName and descriptionClassName in fieldset mode', () => {
    render(
      <FormLayout
        as="fieldset"
        legend="Billing"
        legendClassName="text-lg"
        description="Interval"
        descriptionClassName="text-sm"
      >
        <span>fields</span>
      </FormLayout>
    );
    expect(screen.getByText('Billing')).toHaveClass('text-lg');
    expect(screen.getByText('Interval')).toHaveClass('text-sm');
  });

  it('fieldset mode renders legend and description', () => {
    render(
      <FormLayout as="fieldset" legend="Billing" description="Interval and payment method">
        <span>fields</span>
      </FormLayout>
    );
    expect(screen.getByText('Billing').tagName).toBe('LEGEND');
    expect(screen.getByText('Interval and payment method')).toBeInTheDocument();
  });

  it('renders no legend for div mode', () => {
    const { container } = render(
      <FormLayout legend="Hidden in div mode">
        <span>fields</span>
      </FormLayout>
    );
    expect(container.querySelector('legend')).not.toBeInTheDocument();
  });

  it('has no accessibility violations in fieldset mode', async () => {
    const { container } = render(
      <FormLayout as="fieldset" legend="Profile" layout="grid" columns={2}>
        <span>one</span>
        <span>two</span>
      </FormLayout>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
