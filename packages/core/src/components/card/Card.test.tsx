import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

describe('Card', () => {
  it('renders a card with all sub-components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders CardTitle as a heading', () => {
    render(<Card><CardHeader><CardTitle>Heading</CardTitle></CardHeader></Card>);
    expect(screen.getByRole('heading', { level: 3, name: 'Heading' })).toBeInTheDocument();
  });

  it('forwards className on Card', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile settings</CardDescription>
        </CardHeader>
        <CardContent>Form fields here</CardContent>
      </Card>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
