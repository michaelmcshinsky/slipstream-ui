import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { CTASection } from './CTASection';

describe('CTASection', () => {
  it('renders a heading, copy and actions', () => {
    render(
      <CTASection
        eyebrow="Join Axial"
        title="Join the network"
        description="Connect with counterparties."
        actions={<a href="/join">Get started</a>}
      />
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Join the network' })).toBeInTheDocument();
    expect(screen.getByText('Join Axial')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get started' })).toBeInTheDocument();
  });

  it('uses the inverse tone by default', () => {
    const { container } = render(<CTASection title="Ready?" />);
    expect(container.querySelector('[data-tone="inverse"]')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CTASection title="Ready?" description="Get started." />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
