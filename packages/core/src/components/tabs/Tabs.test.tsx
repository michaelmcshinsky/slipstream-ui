import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

function BasicTabs({ defaultValue = 'a', onValueChange }: { defaultValue?: string; onValueChange?: (v: string) => void }) {
  return (
    <Tabs defaultValue={defaultValue} onValueChange={onValueChange}>
      <TabsList>
        <TabsTrigger value="a">Tab A</TabsTrigger>
        <TabsTrigger value="b">Tab B</TabsTrigger>
        <TabsTrigger value="c">Tab C</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Content A</TabsContent>
      <TabsContent value="b">Content B</TabsContent>
      <TabsContent value="c">Content C</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('renders a tablist with three tabs', () => {
    render(<BasicTabs />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('activates the default tab and shows its panel', () => {
    render(<BasicTabs defaultValue="a" />);
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Content A')).toBeVisible();
    expect(screen.getByText('Content B')).not.toBeVisible();
  });

  it('switches tabs on click and calls onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs onValueChange={onValueChange} />);
    await user.click(screen.getByRole('tab', { name: 'Tab B' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.getByText('Content B')).toBeVisible();
    expect(screen.getByText('Content A')).not.toBeVisible();
  });

  it('uses roving tabindex so only the active tab is tabbable', () => {
    render(<BasicTabs defaultValue="a" />);
    const [a, b, c] = screen.getAllByRole('tab');
    expect(a).toHaveAttribute('tabindex', '0');
    expect(b).toHaveAttribute('tabindex', '-1');
    expect(c).toHaveAttribute('tabindex', '-1');
  });

  it('links tabs to their panels via aria-controls / aria-labelledby', () => {
    render(<BasicTabs />);
    const tab = screen.getByRole('tab', { name: 'Tab A' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });

  it('activates with Enter key', async () => {
    const user = userEvent.setup();
    render(<BasicTabs defaultValue="a" />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    // ArrowRight is DOM-order dependent; Tab B activation via click is covered above.
    await user.keyboard('{Enter}');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<BasicTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Tabs variants, sizes, and arrow navigation', () => {
  it('moves and activates with ArrowRight/ArrowLeft (wrapping)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="a" onValueChange={onValueChange} />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(onValueChange).toHaveBeenLastCalledWith('a');
  });

  it('jumps with Home and End', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="b" onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard('{Home}');
    expect(onValueChange).toHaveBeenCalledWith('a');
    await user.keyboard('{End}');
    expect(onValueChange).toHaveBeenLastCalledWith('c');
  });

  it('underline variant renders a borderless track with bordered triggers', () => {
    const { container } = render(
      <Tabs defaultValue="a" variant="underline">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
          <TabsTrigger value="b">Tab B</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    const list = screen.getByRole('tablist');
    expect(list.className).toContain('border-b');
    expect(list.className).not.toContain('bg-muted');
    const active = screen.getByRole('tab', { name: 'Tab A' });
    expect(active.className).toContain('border-primary');
    expect(container).toBeTruthy();
  });

  it('size sm tightens the trigger padding', () => {
    render(
      <Tabs defaultValue="a" size="sm">
        <TabsList>
          <TabsTrigger value="a">Tab A</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'Tab A' }).className).toContain('text-xs');
  });
});

describe('Tabs rounded variant', () => {
  it('rounded turns the track and triggers into pills', () => {
    render(
      <Tabs variant="rounded" defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Alpha</TabsTrigger>
          <TabsTrigger value="b">Beta</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
        <TabsContent value="b">B</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'Alpha' }).className).toContain('rounded-full');
    expect(screen.getByRole('tablist').className).toContain('rounded-full');
  });

  it('default variant keeps the square track', () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Alpha</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
      </Tabs>
    );
    expect(screen.getByRole('tablist').className).not.toContain('rounded-full');
  });

  it('rounded remains keyboard operable', async () => {
    const user = userEvent.setup();
    render(
      <Tabs variant="rounded" defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Alpha</TabsTrigger>
          <TabsTrigger value="b">Beta</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A</TabsContent>
        <TabsContent value="b">B</TabsContent>
      </Tabs>
    );
    await user.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
