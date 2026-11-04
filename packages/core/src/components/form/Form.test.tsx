import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Form } from './Form';

describe('Form', () => {
  it('renders a semantic form element', () => {
    const { container } = render(<Form>{null}</Form>);
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('applies variant surfaces', () => {
    const { rerender, container } = render(<Form variant="card">{null}</Form>);
    expect(container.querySelector('form')).toHaveClass('border', 'p-6');
    rerender(<Form variant="inline">{null}</Form>);
    expect(container.querySelector('form')).toHaveClass('flex-row', 'flex-wrap');
    rerender(<Form>{null}</Form>);
    expect(container.querySelector('form')).toHaveClass('flex-col');
  });

  it('accepts token and pixel gaps', () => {
    const { rerender, container } = render(<Form gap="lg">{null}</Form>);
    expect(container.querySelector('form')).toHaveClass('gap-6');
    rerender(<Form gap={16}>{null}</Form>);
    expect(container.querySelector('form')).toHaveStyle({ gap: '16px' });
  });

  it('fires native submit through onSubmit', async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    const { container } = render(
      <Form onSubmit={onSubmit}>
        <input aria-label="name" />
      </Form>
    );
    // Unnamed <form> has no implicit ARIA role — query the element itself.
    const form = container.querySelector('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Form variant="card" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="f-axe">Name</label>
        <input id="f-axe" />
      </Form>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
