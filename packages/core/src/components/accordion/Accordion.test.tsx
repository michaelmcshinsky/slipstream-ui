import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

function BasicAccordion({ defaultValue, collapsible, onValueChange }: {
  defaultValue?: string[];
  collapsible?: boolean;
  onValueChange?: (v: string[]) => void;
}) {
  return (
    <Accordion defaultValue={defaultValue} collapsible={collapsible} onValueChange={onValueChange}>
      <AccordionItem id="a">
        <AccordionTrigger>Section A</AccordionTrigger>
        <AccordionContent>Content A</AccordionContent>
      </AccordionItem>
      <AccordionItem id="b">
        <AccordionTrigger>Section B</AccordionTrigger>
        <AccordionContent>Content B</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('renders triggers and hides panels by default', () => {
    render(<BasicAccordion />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByText('Content A')).not.toBeVisible();
    expect(screen.getByText('Content B')).not.toBeVisible();
  });

  it('expands an item on click and shows its panel', async () => {
    const user = userEvent.setup();
    render(<BasicAccordion />);
    await user.click(screen.getByText('Section A'));
    expect(screen.getByText('Content A')).toBeVisible();
    expect(screen.getByRole('button', { name: /Section A/ })).toHaveAttribute('aria-expanded', 'true');
  });

  it('collapses an open item on second click', async () => {
    const user = userEvent.setup();
    render(<BasicAccordion defaultValue={['a']} />);
    expect(screen.getByText('Content A')).toBeVisible();
    await user.click(screen.getByText('Section A'));
    expect(screen.getByText('Content A')).not.toBeVisible();
  });

  it('closes the other item when collapsible (single-open)', async () => {
    const user = userEvent.setup();
    render(<BasicAccordion defaultValue={['a']} collapsible />);
    await user.click(screen.getByText('Section B'));
    expect(screen.getByText('Content A')).not.toBeVisible();
    expect(screen.getByText('Content B')).toBeVisible();
  });

  it('keeps multiple items open when not collapsible', async () => {
    const user = userEvent.setup();
    render(<BasicAccordion defaultValue={['a']} collapsible={false} />);
    await user.click(screen.getByText('Section B'));
    expect(screen.getByText('Content A')).toBeVisible();
    expect(screen.getByText('Content B')).toBeVisible();
  });

  it('calls onValueChange with the new open set', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicAccordion onValueChange={onValueChange} />);
    await user.click(screen.getByText('Section A'));
    expect(onValueChange).toHaveBeenCalledWith(['a']);
  });

  it('links trigger to panel via aria-controls / aria-labelledby', async () => {
    const user = userEvent.setup();
    render(<BasicAccordion />);
    await user.click(screen.getByText('Section A'));
    const trigger = screen.getByRole('button', { name: /Section A/ });
    const panel = screen.getByText('Content A').closest('div[id]');
    expect(trigger).toHaveAttribute('aria-controls', panel?.id);
    expect(panel).toHaveAttribute('aria-labelledby', trigger.id);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<BasicAccordion defaultValue={['a']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Accordion variant and gap', () => {
  it('borderless variant drops the border/dividers', () => {
    const { container } = render(
      <Accordion variant="borderless">
        <AccordionItem id="a">
          <AccordionTrigger>One</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const root = container.querySelector('[data-slot="accordion-root"]') ?? container.firstChild as HTMLElement;
    expect(root).not.toHaveClass('rounded-lg', 'border');
  });

  it('token gap applies a literal gap class', () => {
    const { container } = render(
      <Accordion gap="lg">
        <AccordionItem id="a">
          <AccordionTrigger>One</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const root = container.querySelector('[data-slot="accordion-root"]') ?? container.firstChild as HTMLElement;
    expect(root).toHaveClass('gap-6');
  });

  it('numeric gap applies exact pixels', () => {
    const { container } = render(
      <Accordion gap={10}>
        <AccordionItem id="a">
          <AccordionTrigger>One</AccordionTrigger>
          <AccordionContent>Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const root = container.querySelector('[data-slot="accordion-root"]') ?? container.firstChild as HTMLElement;
    expect(root).toHaveStyle({ gap: '10px' });
  });
});

describe('declarative items', () => {
  it('renders a trigger and panel per item', async () => {
    const user = userEvent.setup();
    render(
      <Accordion items={[
        { id: 'one', title: 'First', content: 'First body' },
        { id: 'two', title: 'Second', content: 'Second body' },
      ]} />
    );
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByText('First body')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'First' }));
    expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('disables an item without dropping its panel', () => {
    render(
      <Accordion items={[{ id: 'locked', title: 'Locked', content: 'Body', disabled: true }]} />
    );
    expect(screen.getByRole('button', { name: 'Locked' })).toBeDisabled();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Accordion items={[{ id: 'one', title: 'First', content: 'First body' }]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
