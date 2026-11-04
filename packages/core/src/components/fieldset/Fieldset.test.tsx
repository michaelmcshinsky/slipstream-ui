import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('renders the legend as the accessible group name', () => {
    render(<Fieldset legend="Choose a plan">{null}</Fieldset>);
    expect(screen.getByText('Choose a plan').tagName).toBe('LEGEND');
  });

  it('renders the description line', () => {
    render(<Fieldset legend="G" description="Applies to every project">{null}</Fieldset>);
    expect(screen.getByText('Applies to every project')).toBeInTheDocument();
  });

  it('announces the error slot via role=alert', () => {
    render(<Fieldset legend="G" error="Select at least one option">{null}</Fieldset>);
    expect(screen.getByRole('alert')).toHaveTextContent('Select at least one option');
  });

  it('renders children', () => {
    render(
      <Fieldset legend="G">
        <input aria-label="Option one" />
      </Fieldset>
    );
    expect(screen.getByRole('textbox', { name: 'Option one' })).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Fieldset legend="G" className="gap-3">{null}</Fieldset>);
    expect(container.firstChild).toHaveClass('gap-3');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Fieldset legend="Notification preferences" description="Pick channels">
        <input aria-label="Email" type="checkbox" />
      </Fieldset>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
