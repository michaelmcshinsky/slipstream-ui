import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ContactStrip } from './ContactStrip';

describe('ContactStrip', () => {
  it('renders labels, values and contact links', () => {
    render(
      <ContactStrip
        items={[
          { label: 'Call', value: '1.800.860.4519', href: 'tel:18008604519' },
          { label: 'Email', value: 'info@axial.net', href: 'mailto:info@axial.net' },
        ]}
      />
    );
    expect(screen.getByText('Call')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '1.800.860.4519' })).toHaveAttribute('href', 'tel:18008604519');
    expect(screen.getByRole('link', { name: 'info@axial.net' })).toHaveAttribute('href', 'mailto:info@axial.net');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ContactStrip items={[{ label: 'Address', value: 'New York, NY' }]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
