import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('requests the next theme', async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    render(<ThemeToggle theme="light" onThemeChange={onThemeChange} />);
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });

  it('labels the reverse action in dark mode', async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    render(<ThemeToggle theme="dark" onThemeChange={onThemeChange} />);
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
    expect(onThemeChange).toHaveBeenCalledWith('light');
  });

  it('supports custom labels', () => {
    render(
      <ThemeToggle
        theme="light"
        onThemeChange={() => {}}
        labels={{ toDark: 'Dark mode', toLight: 'Light mode' }}
      />
    );
    expect(screen.getByRole('button', { name: 'Dark mode' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ThemeToggle theme="light" onThemeChange={() => {}} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
