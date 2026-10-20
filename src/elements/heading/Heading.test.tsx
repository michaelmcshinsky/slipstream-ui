import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Heading } from './Heading';

describe('Heading', () => {
  it('renders with default h2 level', () => {
    render(<Heading>Title</Heading>);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders with specified level', () => {
    render(<Heading level="h3">Section</Heading>);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Section');
  });
});
