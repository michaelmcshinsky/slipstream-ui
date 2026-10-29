import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Label } from './Label';
import { Input } from '../input';

describe('Label', () => {
  it('renders label text', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('associates with a control via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </>
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('forwards className', () => {
    render(<Label className="custom-class">Name</Label>);
    expect(screen.getByText('Name')).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="f">Field</Label>
        <Input id="f" />
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
