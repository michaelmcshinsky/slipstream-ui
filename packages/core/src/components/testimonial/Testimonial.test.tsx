import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Testimonial } from './Testimonial';

describe('Testimonial', () => {
  it('renders a semantic quote, person and company', () => {
    render(
      <Testimonial
        quote="The right advisor changed the outcome."
        name="Bob Falahee"
        role="CEO"
        company="Blind & Shade"
        avatar={<span data-testid="avatar">BF</span>}
        logo={<span>AXIAL</span>}
      />
    );
    expect(screen.getByText(/The right advisor changed the outcome/)).toBeInTheDocument();
    expect(screen.getByText('Bob Falahee')).toBeInTheDocument();
    expect(screen.getByText('CEO, Blind & Shade')).toBeInTheDocument();
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('supports a plain variant and quote sizes', () => {
    const { container } = render(<Testimonial quote="Plain" name="Name" variant="plain" size="lg" />);
    expect(container.firstElementChild).not.toHaveClass('border');
    expect(screen.getByText('“Plain”').parentElement).toHaveClass('text-xl');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Testimonial quote="Quote" name="Name" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
