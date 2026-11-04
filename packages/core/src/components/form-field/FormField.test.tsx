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

describe('FormField extensions', () => {
  it('renders the tooltip info button with an accessible name after the label', () => {
    render(
      <FormField id="tw" label="Work email" tooltip="Use your work email.">
        <Input />
      </FormField>
    );
    expect(screen.getByRole('button', { name: 'Work email information' })).toBeInTheDocument();
  });

  it('keeps the label to the left in labelPlacement="left"', () => {
    const { container } = render(
      <FormField id="left" label="API key" labelPlacement="left">
        <Input />
      </FormField>
    );
    expect(screen.getByLabelText('API key')).toBeInTheDocument();
    expect(container.firstElementChild?.firstElementChild).toHaveClass('flex', 'items-start');
    expect(screen.getByText('API key').closest('div')?.className).toContain('w-40');
  });

  it('renders the trailing slot on the label row', () => {
    render(
      <FormField id="trail" label="Rank" trailing={<span data-testid="trailing">Pro</span>}>
        <Input />
      </FormField>
    );
    expect(screen.getByTestId('trailing')).toBeInTheDocument();
    expect(screen.getByLabelText('Rank')).toBeInTheDocument();
  });

  it('keeps error wiring in both placements', () => {
    render(
      <FormField id="err-left" label="Env" labelPlacement="left" error="Required field">
        <Input />
      </FormField>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
    expect(screen.getByLabelText('Env')).toHaveAttribute('aria-invalid', 'true');
  });

  it('has no accessibility violations with tooltip and trailing', async () => {
    const { container } = render(
      <FormField
        id="axe"
        label="Work email"
        tooltip="Use your work email."
        hint="Never shared."
        trailing={<span>Badge</span>}
        required
      >
        <Input type="email" />
      </FormField>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

