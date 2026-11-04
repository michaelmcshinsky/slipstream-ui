import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxGroup, CheckboxGroupItem } from './CheckboxGroup';

function Basic({
  onValueChange,
  orientation,
  defaultValue,
}: {
  onValueChange?: (value: string[]) => void;
  orientation?: 'vertical' | 'horizontal';
  defaultValue?: string[];
}) {
  return (
    <CheckboxGroup name="langs" legend="Languages" onValueChange={onValueChange} orientation={orientation} defaultValue={defaultValue}>
      <CheckboxGroupItem value="ts" label="TypeScript" />
      <CheckboxGroupItem value="go" label="Go" />
      <CheckboxGroupItem value="rs" label="Rust" />
    </CheckboxGroup>
  );
}

describe('CheckboxGroup', () => {
  it('renders a fieldset with a legend and shared-name checkboxes', () => {
    const { container } = render(<Basic />);
    const fieldset = container.querySelector('fieldset')!;
    expect(fieldset).toBeInTheDocument();
    expect(screen.getByText('Languages').tagName).toBe('LEGEND');
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(3);
    expect(boxes[0]).toHaveAttribute('name', 'langs');
  });

  it('selects and deselects values in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Basic onValueChange={onValueChange} defaultValue={['ts']} />);
    const ts = screen.getByRole('checkbox', { name: 'TypeScript' });
    expect(ts).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'Go' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['ts', 'go']);
    await user.click(ts);
    expect(onValueChange).toHaveBeenLastCalledWith(['go']);
    expect(ts).not.toBeChecked();
  });

  it('controlled value wins over clicks (parent owns state)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup name="x" value={['a']} onValueChange={onValueChange}>
        <CheckboxGroupItem value="a" label="A" />
        <CheckboxGroupItem value="b" label="B" />
      </CheckboxGroup>
    );
    expect(screen.getByRole('checkbox', { name: 'A' })).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'B' }));
    expect(onValueChange).toHaveBeenCalledWith(['a', 'b']);
    // Controlled: DOM state unchanged until parent re-renders.
    expect(screen.getByRole('checkbox', { name: 'B' })).not.toBeChecked();
  });

  it('horizontal orientation lays options out in a row', () => {
    const { container } = render(<Basic orientation="horizontal" />);
    expect(container.querySelector('fieldset')).toHaveClass('flex-row', 'flex-wrap');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Basic />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('CheckboxGroup group-level error', () => {
  it('announces the error via role=alert inside the fieldset', () => {
    const { container } = render(
      <CheckboxGroup name="fmt" legend="Format" error="Choose at least one format">
        <CheckboxGroupItem value="csv" label="CSV" />
      </CheckboxGroup>
    );
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Choose at least one format');
    expect(container.querySelector('fieldset')!.contains(alert)).toBe(true);
  });

  it('renders no alert without an error', () => {
    render(
      <CheckboxGroup name="fmt" legend="Format">
        <CheckboxGroupItem value="csv" label="CSV" />
      </CheckboxGroup>
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
