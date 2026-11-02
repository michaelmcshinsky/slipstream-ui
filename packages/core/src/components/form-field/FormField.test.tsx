import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Input } from '../input/Input';
import { FormField } from './FormField';

describe('FormField', () => {
  it('pairs the label with the control via htmlFor/id', () => {
    render(
      <FormField id="email" label="Email address">
        <Input type="email" />
      </FormField>
    );
    const input = screen.getByLabelText('Email address');
    expect(input).toHaveAttribute('id', 'email');
  });

  it('wires the hint through aria-describedby', () => {
    render(
      <FormField id="email" label="Email" hint="We never share your email">
        <Input />
      </FormField>
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-describedby', 'email-hint');
    expect(screen.getByText('We never share your email')).toHaveAttribute('id', 'email-hint');
  });

  it('swaps the hint for an announced error and sets aria-invalid', () => {
    render(
      <FormField id="email" label="Email" hint="Hint" error="Enter a valid email">
        <Input />
      </FormField>
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });

  it('renders the required marker and sr-only label when hidden', () => {
    render(
      <FormField id="q" label="Search documents" required labelHidden>
        <Input />
      </FormField>
    );
    const input = screen.getByLabelText(/Search documents/);
    expect(input).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('wires single elements but leaves fragments untouched', () => {
    const { rerender } = render(
      <FormField id="plain" label="Plain">
        <Input />
      </FormField>
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'plain');

    rerender(
      <FormField id="plain" label="Plain">
        <>
          <span data-testid="raw">child</span>
        </>
      </FormField>
    );
    expect(screen.getByTestId('raw')).not.toHaveAttribute('id', 'plain');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <FormField id="pw" label="Password" hint="At least 8 characters" required>
        <Input type="password" />
      </FormField>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
