import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Image } from './Image';

describe('Image', () => {
  it('renders the primary source with intrinsic dimensions and lazy loading', () => {
    render(<Image src="/event.jpg" alt="Fall Classic" />);
    const img = screen.getByRole('img', { name: 'Fall Classic' });
    expect(img).toHaveAttribute('src', '/event.jpg');
    expect(img).toHaveAttribute('width', '1200');
    expect(img).toHaveAttribute('height', '630');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('fetchpriority', 'auto');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('loads eagerly only when priority is set', () => {
    render(<Image src="/hero.jpg" alt="Hero" priority width={1600} height={900} />);
    const img = screen.getByRole('img', { name: 'Hero' });
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).toHaveAttribute('width', '1600');
    expect(img).toHaveAttribute('height', '900');
  });

  it('falls back to fallbackSrc after the primary fails', () => {
    render(
      <Image src="/broken.jpg" fallbackSrc="/placeholder.svg" alt="Event" />
    );
    const img = screen.getByRole('img', { name: 'Event' });
    fireEvent.error(img);
    expect(screen.getByRole('img', { name: 'Event' })).toHaveAttribute(
      'src',
      '/placeholder.svg'
    );
  });

  it('renders the fallback node when both URLs fail', () => {
    render(
      <Image
        src="/broken.jpg"
        fallbackSrc="/also-broken.svg"
        alt="Event"
        fallback={<span data-testid="fallback">No image</span>}
      />
    );
    fireEvent.error(screen.getByRole('img', { name: 'Event' }));
    fireEvent.error(screen.getByRole('img', { name: 'Event' }));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback')).toHaveTextContent('No image');
  });

  it('renders the fallback node on the first error without a fallbackSrc', () => {
    render(
      <Image src="/broken.jpg" alt="Event" fallback={<span data-testid="fallback">No image</span>} />
    );
    fireEvent.error(screen.getByRole('img', { name: 'Event' }));
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('renders nothing when it fails without a fallback node', () => {
    const { container } = render(<Image src="/broken.jpg" alt="Event" />);
    fireEvent.error(screen.getByRole('img', { name: 'Event' }));
    expect(container).toBeEmptyDOMElement();
  });

  it('keeps dimensions in server-rendered markup', () => {
    const html = renderToString(<Image src="/event.jpg" alt="Event" width={640} height={360} />);
    expect(html).toContain('width="640"');
    expect(html).toContain('height="360"');
    expect(html).toContain('alt="Event"');
  });

  it('merges className and imgClassName', () => {
    render(
      <Image
        src="/event.jpg"
        alt="Event"
        className="rounded-md"
        imgClassName="object-cover"
      />
    );
    const img = screen.getByRole('img', { name: 'Event' });
    expect(img).toHaveClass('rounded-md');
    expect(img).toHaveClass('object-cover');
  });

  it('restarts the fallback chain when src changes', () => {
    const { rerender } = render(
      <Image
        src="/broken.jpg"
        fallbackSrc="/fallback.svg"
        alt="Event"
        fallback={<span data-testid="fallback">No image</span>}
      />
    );
    fireEvent.error(screen.getByRole('img', { name: 'Event' }));
    fireEvent.error(screen.getByRole('img', { name: 'Event' }));
    expect(screen.getByTestId('fallback')).toBeInTheDocument();

    rerender(
      <Image
        src="/new.jpg"
        fallbackSrc="/fallback.svg"
        alt="Event"
        fallback={<span data-testid="fallback">No image</span>}
      />
    );
    expect(screen.getByRole('img', { name: 'Event' })).toHaveAttribute('src', '/new.jpg');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Image src="/event.jpg" alt="Fall Classic" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
