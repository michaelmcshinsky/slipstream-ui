import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Avatar, AvatarFallback, AvatarImage } from './Avatar';

describe('Avatar', () => {
  it('renders the fallback when no image is available', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('applies rounded styling to the root', () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByTestId('avatar')).toHaveClass('rounded-full');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/avatar.png" alt="Ada Lovelace" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Avatar usability', () => {
  it('falls back to initials without an image', () => {
    render(
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText('AL')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container } = render(
      <Avatar className="h-10 w-10">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    );
    expect(container.firstChild).toHaveClass('h-10', 'w-10');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://example.com/a.png" alt="Ada" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Avatar image loading (radix gated)', () => {
  it('shows the fallback while the image has not loaded', () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/a.png" alt="Ada Lovelace" />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    );
    // jsdom never fires load, so radix keeps the fallback visible.
    expect(screen.getByText('AL')).toBeVisible();
  });

  it('renders nothing visible for an image without a fallback before load', () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://example.com/a.png" alt="Ada" />
      </Avatar>
    );
    expect(container.textContent).toBe('');
  });
});
