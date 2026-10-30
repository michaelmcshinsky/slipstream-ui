import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Alert, AlertDescription, AlertTitle } from './Alert';

describe('Alert', () => {
  it('renders with role alert', () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Something happened');
  });

  it('renders title and description', () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>You can do things here.</AlertDescription>
      </Alert>
    );
    expect(screen.getByRole('heading', { level: 5, name: 'Heads up' })).toBeInTheDocument();
    expect(screen.getByText('You can do things here.')).toBeInTheDocument();
  });

  it.each(['default', 'destructive', 'success', 'warning', 'info'] as const)(
    'applies the %s variant class',
    (variant) => {
      const { container: rendered } = render(<Alert variant={variant}>msg</Alert>);
      expect(rendered.firstChild).toBeInTheDocument();
    }
  );

  it('forwards className', () => {
    render(<Alert className="custom-class">msg</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
