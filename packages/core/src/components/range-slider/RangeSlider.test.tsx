import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { RangeSlider } from './RangeSlider';

describe('RangeSlider', () => {
  it('renders two labeled range inputs with formatted values', () => {
    render(
      <RangeSlider
        defaultValue={[20, 80]}
        formatValue={(value) => `$${value}M`}
        startLabel="Revenue minimum"
        endLabel="Revenue maximum"
      />
    );
    expect(screen.getByLabelText('Revenue minimum')).toHaveValue('20');
    expect(screen.getByLabelText('Revenue maximum')).toHaveValue('80');
    expect(screen.getByText('$20M')).toBeInTheDocument();
    expect(screen.getByText('$80M')).toBeInTheDocument();
  });

  it('emits the next pair and keeps the thumbs from crossing', () => {
    const onValueChange = vi.fn();
    render(
      <RangeSlider
        defaultValue={[20, 80]}
        onValueChange={onValueChange}
        startLabel="Minimum"
        endLabel="Maximum"
      />
    );
    fireEvent.change(screen.getByLabelText('Minimum'), { target: { value: '90' } });
    expect(onValueChange).toHaveBeenLastCalledWith([80, 80]);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<RangeSlider defaultValue={[25, 75]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
