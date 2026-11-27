import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { CoverImage } from './CoverImage';

describe('CoverImage', () => {
  it('renders the image inside an aspect-ratio box', () => {
    render(<CoverImage src="/cover.jpg" alt="Fall Classic" />);
    const img = screen.getByRole('img', { name: 'Fall Classic' });
    expect(img).toHaveAttribute('src', '/cover.jpg');
    expect(img.parentElement).toHaveClass('aspect-video', 'overflow-hidden');
    expect(img).toHaveClass('object-cover');
  });

  it('supports aspect presets and custom ratios', () => {
    const { container, rerender } = render(
      <CoverImage src="/a.jpg" alt="A" aspect="square" />
    );
    expect(container.firstElementChild).toHaveClass('aspect-square');
    rerender(<CoverImage src="/a.jpg" alt="A" aspect="16/10" />);
    expect((container.firstElementChild as HTMLElement).style.aspectRatio).toBe('16 / 10');
  });

  it('renders the seeded gradient fallback when src is absent', () => {
    const { container } = render(<CoverImage alt="No art" seed="entity-42" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    const fallback = container.querySelector('[style*="linear-gradient"]');
    expect(fallback).not.toBeNull();
  });

  it('picks a stable gradient per seed', () => {
    const a = render(<CoverImage alt="A" seed="same" />).container.querySelector('[style*="linear-gradient"]') as HTMLElement;
    const b = render(<CoverImage alt="B" seed="same" />).container.querySelector('[style*="linear-gradient"]') as HTMLElement;
    const c = render(<CoverImage alt="C" seed="other" />).container.querySelector('[style*="linear-gradient"]') as HTMLElement;
    expect(a.style.backgroundImage).toBe(b.style.backgroundImage);
    expect(a.style.backgroundImage).toContain('linear-gradient');
    // different seeds may collide by chance; assert determinism only for same seed
    expect(c.style.backgroundImage).toContain('linear-gradient');
  });

  it('degrades a broken image to the fallback gradient', () => {
    render(<CoverImage src="/broken.jpg" alt="Event" seed="x" />);
    fireEvent.error(screen.getByRole('img', { name: 'Event' }));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('honors priority and sizes on the image', () => {
    render(<CoverImage src="/hero.jpg" alt="Hero" priority sizes="100vw" />);
    const img = screen.getByRole('img', { name: 'Hero' });
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).toHaveAttribute('sizes', '100vw');
  });

  it('renders a custom fallback and mark', () => {
    render(
      <CoverImage
        alt="Event"
        mark={<svg data-testid="mark" />}
        fallback={<div data-testid="custom">Custom</div>}
      />
    );
    expect(screen.getByTestId('custom')).toBeInTheDocument();
    expect(screen.queryByTestId('mark')).not.toBeInTheDocument();
  });

  it('renders the mark on the default gradient', () => {
    render(<CoverImage alt="Event" mark={<svg data-testid="mark" />} />);
    expect(screen.getByTestId('mark')).toBeInTheDocument();
  });

  it('keeps the aspect box in server-rendered markup', () => {
    const html = renderToString(<CoverImage src="/c.jpg" alt="Cover" />);
    expect(html).toContain('aspect-video');
    expect(html).toContain('alt="Cover"');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <CoverImage src="/c.jpg" alt="With image" />
        <CoverImage alt="Placeholder" seed="s" />
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
