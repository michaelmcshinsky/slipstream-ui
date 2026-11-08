import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { DocumentCard } from './DocumentCard';

describe('DocumentCard', () => {
  it('renders file metadata and a download action', () => {
    const onDownload = vi.fn();
    render(
      <DocumentCard
        name="Q3-financials.pdf"
        fileType="PDF"
        size="2.4 MB"
        updatedAt="Nov 1, 2026"
        onDownload={onDownload}
      />
    );
    expect(screen.getByText('Q3-financials.pdf')).toBeInTheDocument();
    expect(screen.getByText('PDF · 2.4 MB · Nov 1, 2026')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Download Q3-financials.pdf' }));
    expect(onDownload).toHaveBeenCalled();
  });

  it('disables download when the document is restricted', () => {
    render(
      <DocumentCard
        name="CIM.pdf"
        fileType="PDF"
        status="restricted"
        onDownload={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: 'Download CIM.pdf' })).toBeDisabled();
    expect(screen.getByText('Restricted')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DocumentCard name="File" fileType="PDF" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
