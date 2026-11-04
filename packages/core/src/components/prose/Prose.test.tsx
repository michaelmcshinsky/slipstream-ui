import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Prose } from './Prose';

describe('Prose', () => {
  it('styles rendered markdown elements', () => {
    const { container } = render(
      <Prose>
        <h2>Heading</h2>
        <p>Body <a href="/x">link</a> <code>inline()</code></p>
        <ul><li>one</li></ul>
        <pre><code>const x = 1;</code></pre>
        <blockquote>quote</blockquote>
        <table><thead><tr><th>H</th></tr></thead><tbody><tr><td>C</td></tr></tbody></table>
      </Prose>
    );
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('[&_h2]:font-semibold');
    expect(root.className).toContain('[&_pre]:overflow-x-auto');
    expect(root.className).toContain('[&_table]:w-full');
    expect(screen.getByRole('heading', { name: 'Heading' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'link' })).toBeInTheDocument();
  });

  it('supports size presets', () => {
    const { container } = render(<Prose size="lg"><p>x</p></Prose>);
    expect((container.firstChild as HTMLElement).className).toContain('text-lg');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Prose><h2>Title</h2><p>Copy</p></Prose>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
