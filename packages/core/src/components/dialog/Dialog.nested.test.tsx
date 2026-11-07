import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Dialog } from './Dialog';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

function Nested({ secondOpen, onFirst, onSecond }: { secondOpen: boolean; onFirst: () => void; onSecond: () => void }) {
  return (
    <>
      <Dialog open onOpenChange={onFirst} title="First dialog">
        <p>First body</p>
      </Dialog>
      <Dialog open={secondOpen} onOpenChange={onSecond} title="Second dialog">
        <p>Second body</p>
      </Dialog>
    </>
  );
}

describe('Dialog modal layer', () => {
  it('locks body scroll and restores it after the last dialog closes', () => {
    const view = render(
      <Dialog open onOpenChange={() => {}} title="Scroll lock">
        <p>Body</p>
      </Dialog>
    );
    expect(document.body.style.overflow).toBe('hidden');

    view.rerender(
      <Dialog open={false} onOpenChange={() => {}} title="Scroll lock">
        <p>Body</p>
      </Dialog>
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('closes the topmost dialog only and keeps the lock until the stack is empty', () => {
    const onFirst = vi.fn();
    const onSecond = vi.fn();
    const view = render(<Nested secondOpen onFirst={onFirst} onSecond={onSecond} />);

    expect(screen.getByRole('dialog', { name: 'First dialog' })).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Second dialog' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onSecond).toHaveBeenCalledTimes(1);
    expect(onFirst).not.toHaveBeenCalled();

    view.rerender(<Nested secondOpen={false} onFirst={onFirst} onSecond={onSecond} />);
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onFirst).toHaveBeenCalledTimes(1);
  });

  it('restores the previous overflow value rather than assuming empty', () => {
    document.body.style.overflow = 'scroll';
    const view = render(
      <Dialog open onOpenChange={() => {}} title="Preserve overflow">
        <p>Body</p>
      </Dialog>
    );
    expect(document.body.style.overflow).toBe('hidden');
    view.unmount();
    expect(document.body.style.overflow).toBe('scroll');
  });
});
