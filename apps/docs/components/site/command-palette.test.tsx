import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@slipstream-ui/i18n/react';

const mocks = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock('@/lib/analytics', () => ({ track: vi.fn() }));

import { CommandPalette } from './command-palette';

// react-dom/client act() requires this flag outside the React test renderer.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  mocks.push.mockClear();
});

function paletteElement(open: boolean, onOpenChange: (open: boolean) => void) {
  return (
    <I18nProvider locale="en">
      <CommandPalette open={open} onOpenChange={onOpenChange} />
    </I18nProvider>
  );
}

function renderPalette(open = true, onOpenChange: (open: boolean) => void = vi.fn()) {
  act(() => root.render(paletteElement(open, onOpenChange)));
  return onOpenChange;
}

async function flushAnimationFrame() {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function keydown(target: Element | Window, key: string) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  });
}

describe('CommandPalette a11y', () => {
  it('exposes combobox + listbox semantics with an active descendant', async () => {
    renderPalette();
    await flushAnimationFrame();

    const input = container.querySelector('input[role="combobox"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-haspopup')).toBe('listbox');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');

    const listbox = container.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();
    expect(input.getAttribute('aria-controls')).toBe(listbox?.id);

    const options = container.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
    const activeId = input.getAttribute('aria-activedescendant');
    expect(activeId).toBeTruthy();
    expect(options[0]?.id).toBe(activeId);
    expect(options[0]?.getAttribute('aria-selected')).toBe('true');
  });

  it('moves the active option with arrow keys and navigates on Enter', async () => {
    const onOpenChange = renderPalette();
    await flushAnimationFrame();

    const input = container.querySelector('input[role="combobox"]') as HTMLInputElement;
    keydown(input, 'ArrowDown');
    const options = container.querySelectorAll('[role="option"]');
    expect(input.getAttribute('aria-activedescendant')).toBe(options[1]?.id);
    expect(options[1]?.getAttribute('aria-selected')).toBe('true');

    keydown(input, 'Enter');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(mocks.push).toHaveBeenCalledWith(expect.stringMatching(/^\//));
  });

  it('keeps Tab inside the dialog and restores focus to the trigger on close', async () => {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const onOpenChange = vi.fn();
    renderPalette(true, onOpenChange);
    await flushAnimationFrame();

    const input = container.querySelector('input[role="combobox"]') as HTMLInputElement;
    expect(document.activeElement).toBe(input);

    keydown(input, 'Tab');
    expect(document.activeElement).toBe(input);

    act(() => root.render(paletteElement(false, onOpenChange)));
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('closes on Escape', async () => {
    const onOpenChange = renderPalette();
    await flushAnimationFrame();
    keydown(window, 'Escape');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
